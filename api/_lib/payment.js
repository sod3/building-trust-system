import { connectToDatabase } from "./db.js";
import { getActivePlan, seedPlans } from "./plans.js";
import { createId } from "./security.js";
import https from "node:https";

const MOYASAR_API_BASE = "https://api.moyasar.com/v1";

function isEnabled(value) {
  return ["1", "true", "yes"].includes(
    String(value || "")
      .trim()
      .toLowerCase(),
  );
}

function allowInvalidMoyasarTls() {
  return (
    process.env.NODE_ENV !== "production" ||
    isEnabled(process.env.MOYASAR_TLS_ALLOW_INVALID_CERTIFICATES)
  );
}

function moyasarAuthHeaders() {
  const secretKey = process.env.MOYASAR_SECRET_KEY;
  if (!secretKey) {
    throw new Error("MOYASAR_SECRET_KEY is not configured.");
  }

  const credentials = Buffer.from(`${String(secretKey).trim()}:`).toString("base64");
  return {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };
}

async function requestMoyasar(path, { method = "GET", body } = {}) {
  const requestBody = body ? JSON.stringify(body) : null;
  const url = new URL(`${MOYASAR_API_BASE}${path}`);

  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method,
        headers: {
          ...moyasarAuthHeaders(),
          ...(requestBody ? { "Content-Length": Buffer.byteLength(requestBody) } : {}),
        },
        rejectUnauthorized: !allowInvalidMoyasarTls(),
      },
      (response) => {
        const chunks = [];

        response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        response.on("end", () => {
          const rawBody = Buffer.concat(chunks).toString("utf8");
          let payload = rawBody;

          try {
            payload = rawBody ? JSON.parse(rawBody) : {};
          } catch {
            payload = { raw: rawBody };
          }

          const statusCode = response.statusCode || 500;
          if (statusCode < 200 || statusCode >= 300) {
            const error = new Error(
              `Moyasar request failed (${statusCode}): ${
                typeof payload === "string" ? payload : JSON.stringify(payload)
              }`,
            );
            error.status = statusCode;
            error.response = payload;
            reject(error);
            return;
          }

          resolve(payload);
        });
      },
    );

    req.on("error", reject);
    if (requestBody) req.write(requestBody);
    req.end();
  });
}

export async function fetchMoyasarPayment(paymentId) {
  return requestMoyasar(`/payments/${encodeURIComponent(paymentId)}`);
}

export async function chargeMoyasarToken({
  amount,
  currency = "SAR",
  description,
  token,
  metadata,
}) {
  if (!token) {
    throw new Error("No saved Moyasar payment token is available for this subscription.");
  }

  return requestMoyasar("/payments", {
    method: "POST",
    body: {
      amount,
      currency,
      description,
      source: { type: "token", token },
      metadata,
    },
  });
}

function getPaymentMetadata(payment) {
  return payment.metadata || payment.source?.metadata || {};
}

function metadataValue(metadata, camelKey, snakeKey = camelKey) {
  return (
    metadata?.[camelKey] ||
    metadata?.[snakeKey] ||
    metadata?.[camelKey.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)]
  );
}

function safePaymentSnapshot(payment) {
  const source = payment.source || {};
  const number = typeof source.number === "string" ? source.number : "";

  return {
    id: payment.id,
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
    description: payment.description,
    metadata: getPaymentMetadata(payment),
    created_at: payment.created_at,
    updated_at: payment.updated_at,
    fee: payment.fee,
    source: {
      type: source.type,
      company: source.company,
      name: source.name,
      number: number ? number.slice(-4).padStart(number.length, "*") : undefined,
      message: source.message,
    },
  };
}

function getTokenFromSource(source = {}) {
  return (
    source.token || source.token_id || source.payment_token || source.payment_method_token || null
  );
}

async function findExistingPayment(db, paymentId) {
  return db.collection("payments").findOne({
    $or: [{ paymentId }, { moyasarPaymentId: paymentId }],
  });
}

async function persistFailedPayment(db, { payment, order, invoice, status }) {
  const now = new Date();
  const source = payment.source || {};
  const cardNumber = typeof source.number === "string" ? source.number : "";
  const failedPaymentInsert = {
    _id: createId("pay"),
    paymentId: payment.id,
    moyasarPaymentId: payment.id,
    orderId: order?.orderId || null,
    invoiceId: invoice?.invoiceId || null,
    userId: order?.userId || invoice?.userId || null,
    orgId: order?.orgId || invoice?.orgId || null,
    planId: order?.planId || invoice?.planId || null,
    provider: "moyasar",
    amount: payment.amount || order?.amountHalalas || invoice?.amount || 0,
    amountHalalas: payment.amount || order?.amountHalalas || invoice?.amount || 0,
    currency: payment.currency || order?.currency || invoice?.currency || "SAR",
    fee: payment.fee || null,
    sourceType: source.type || "creditcard",
    cardBrand: source.company || null,
    last4: cardNumber.slice(-4) || null,
    rawResponse: safePaymentSnapshot(payment),
    rawProviderResponse: safePaymentSnapshot(payment),
    processedAt: now,
    createdAt: now,
  };

  await db.collection("payments").updateOne(
    { moyasarPaymentId: payment.id },
    {
      $setOnInsert: failedPaymentInsert,
      $set: { status, updatedAt: now },
    },
    { upsert: true },
  );
}

export async function verifyAndPersistPayment(paymentId) {
  if (!paymentId) {
    return { success: false, status: 400, message: "Missing Moyasar payment ID." };
  }

  const { db } = await connectToDatabase();
  await seedPlans(db);

  const existingPayment = await findExistingPayment(db, paymentId);
  if (existingPayment) {
    if (existingPayment.status !== "paid") {
      return {
        success: false,
        status: 400,
        message: `Payment status is "${existingPayment.status}".`,
      };
    }
    const subscription = await db
      .collection("subscriptions")
      .findOne({ orgId: existingPayment.orgId });
    return {
      success: true,
      alreadyVerified: true,
      paymentId,
      orderId: existingPayment.orderId,
      userId: existingPayment.userId,
      orgId: existingPayment.orgId,
      invoiceId: existingPayment.invoiceId,
      plan: existingPayment.planId,
      planName: subscription?.planName || existingPayment.planId,
      amount: existingPayment.amountHalalas,
      currency: existingPayment.currency,
      subscription,
    };
  }

  const payment = await fetchMoyasarPayment(paymentId);
  const metadata = getPaymentMetadata(payment);
  const orderId = metadataValue(metadata, "orderId", "order_id");
  const invoiceId = metadataValue(metadata, "invoiceId", "invoice_id");
  const userId = metadataValue(metadata, "userId", "user_id");
  const orgId = metadataValue(metadata, "orgId", "org_id");
  const planId = metadataValue(metadata, "planId", "plan_id");

  if (!orderId || !invoiceId || !userId || !orgId || !planId) {
    return {
      success: false,
      status: 400,
      message: "Payment metadata is missing order, invoice, user, organization, or plan details.",
    };
  }

  const order = await db.collection("orders").findOne({ orderId });
  if (!order) {
    return { success: false, status: 404, message: "Order not found for this payment." };
  }
  const invoice = await db
    .collection("invoices")
    .findOne({ invoiceId: order.invoiceId || invoiceId });
  if (!invoice) {
    return { success: false, status: 404, message: "Invoice not found for this payment." };
  }

  if (
    order.userId !== userId ||
    order.orgId !== orgId ||
    order.planId !== planId ||
    invoice.invoiceId !== invoiceId
  ) {
    return {
      success: false,
      status: 400,
      message: "Payment metadata does not match the checkout order.",
    };
  }

  if (order.status === "paid") {
    const paymentRecord = await db.collection("payments").findOne({ orderId });
    const subscription = await db.collection("subscriptions").findOne({ orgId: order.orgId });
    return {
      success: true,
      alreadyVerified: true,
      paymentId: paymentRecord?.paymentId || paymentId,
      orderId,
      userId: order.userId,
      orgId: order.orgId,
      invoiceId: order.invoiceId,
      plan: order.planId,
      planName: order.planName,
      amount: order.amountHalalas,
      currency: order.currency,
      subscription,
    };
  }

  const plan = await getActivePlan(db, order.planId);
  if (!plan) {
    return { success: false, status: 400, message: "The selected plan is no longer active." };
  }

  if (payment.status !== "paid") {
    const status = payment.status === "failed" ? "failed" : payment.status || "pending";
    await persistFailedPayment(db, { payment, order, invoice, status });
    await db
      .collection("orders")
      .updateOne(
        { orderId },
        { $set: { status, moyasarPaymentId: payment.id, updatedAt: new Date() } },
      );
    await db.collection("invoices").updateOne(
      { invoiceId: invoice.invoiceId },
      {
        $set: {
          status: status === "failed" ? "failed" : "pending",
          moyasarPaymentId: payment.id,
          updatedAt: new Date(),
        },
      },
    );
    return { success: false, status: 400, message: `Payment status is "${payment.status}".` };
  }

  if (payment.currency !== order.currency || payment.currency !== "SAR") {
    return { success: false, status: 400, message: "Invalid payment currency." };
  }

  if (payment.amount !== order.amountHalalas || plan.amountHalalas !== order.amountHalalas) {
    return {
      success: false,
      status: 400,
      message: "Payment amount does not match the selected plan.",
    };
  }

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setDate(periodEnd.getDate() + 30);

  const source = payment.source || {};
  const cardNumber = typeof source.number === "string" ? source.number : "";
  const moyasarTokenId = getTokenFromSource(source);

  const paymentRecord = {
    _id: createId("pay"),
    paymentId: payment.id,
    moyasarPaymentId: payment.id,
    orderId,
    invoiceId: invoice.invoiceId,
    userId: order.userId,
    orgId: order.orgId,
    planId: order.planId,
    provider: "moyasar",
    status: "paid",
    amount: payment.amount,
    amountHalalas: payment.amount,
    currency: payment.currency,
    fee: payment.fee || null,
    sourceType: source.type || "creditcard",
    paymentMethod: source.type || "creditcard",
    cardBrand: source.company || null,
    last4: cardNumber.slice(-4) || null,
    cardLast4: cardNumber.slice(-4) || null,
    rawResponse: safePaymentSnapshot(payment),
    rawProviderResponse: safePaymentSnapshot(payment),
    processedAt: now,
    verifiedAt: now,
    createdAt: now,
    updatedAt: now,
  };
  const { status: _status, updatedAt: _updatedAt, ...paymentInsertRecord } = paymentRecord;

  await db
    .collection("payments")
    .updateOne(
      { moyasarPaymentId: payment.id },
      { $setOnInsert: paymentInsertRecord, $set: { status: "paid", updatedAt: now } },
      { upsert: true },
    );
  await db
    .collection("orders")
    .updateOne(
      { orderId },
      { $set: { status: "paid", moyasarPaymentId: payment.id, processedAt: now, updatedAt: now } },
    );
  await db
    .collection("invoices")
    .updateOne(
      { invoiceId: invoice.invoiceId },
      { $set: { status: "paid", moyasarPaymentId: payment.id, paidAt: now, updatedAt: now } },
    );

  let paymentMethodId = null;
  if (moyasarTokenId) {
    paymentMethodId = createId("pm");
    await db.collection("paymentMethods").updateOne(
      { orgId: order.orgId, userId: order.userId, moyasarTokenId },
      {
        $set: {
          brand: source.company || null,
          last4: cardNumber.slice(-4) || null,
          expiryMonth: source.month || source.expiry_month || null,
          expiryYear: source.year || source.expiry_year || null,
          status: "active",
          updatedAt: now,
        },
        $setOnInsert: {
          _id: paymentMethodId,
          orgId: order.orgId,
          userId: order.userId,
          moyasarTokenId,
          createdAt: now,
        },
      },
      { upsert: true },
    );
    const saved = await db
      .collection("paymentMethods")
      .findOne({ orgId: order.orgId, userId: order.userId, moyasarTokenId });
    paymentMethodId = saved?._id || paymentMethodId;
  }

  const subscription = {
    orgId: order.orgId,
    userId: order.userId,
    planId: plan.slug || plan.planId,
    planName: plan.name,
    status: "active",
    billingMode: "automatic",
    amountSar: plan.priceSar,
    amountHalalas: plan.amountHalalas,
    currency: "SAR",
    billingCycle: plan.billingCycle,
    startsAt: now,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    nextBillingDate: periodEnd,
    cancelAtPeriodEnd: false,
    gracePeriodEndsAt: null,
    retryCount: 0,
    lastPaymentStatus: "paid",
    paymentId: payment.id,
    paymentMethodId,
    orderId,
    maxBuildings: plan.maxBuildings,
    maxLabourUsers: plan.maxLabourUsers,
    buildingLimit: plan.maxBuildings,
    labourLimit: plan.maxLabourUsers,
    updatedAt: now,
  };

  await db
    .collection("subscriptions")
    .updateOne(
      { orgId: order.orgId },
      { $set: subscription, $setOnInsert: { createdAt: now } },
      { upsert: true },
    );

  await db
    .collection("users")
    .updateOne(
      { _id: order.userId },
      { $set: { status: "active", orgId: order.orgId, updatedAt: now } },
    );
  await db.collection("organizations").updateOne(
    { _id: order.orgId },
    {
      $set: {
        ownerUserId: order.userId,
        planId: plan.slug || plan.planId,
        subscriptionStatus: "active",
        status: "active",
        updatedAt: now,
      },
    },
  );

  return {
    success: true,
    alreadyVerified: false,
    paymentId: payment.id,
    orderId,
    invoiceId: invoice.invoiceId,
    userId: order.userId,
    orgId: order.orgId,
    plan: plan.slug || plan.planId,
    planName: plan.name,
    amount: payment.amount,
    currency: payment.currency,
    subscription,
  };
}
