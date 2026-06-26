import { connectToDatabase } from "./db.js";
import { seedPlans } from "./plans.js";

const MOYASAR_API_BASE = "https://api.moyasar.com/v1";

export async function fetchMoyasarPayment(paymentId) {
  const secretKey = process.env.MOYASAR_SECRET_KEY;
  if (!secretKey) {
    throw new Error("MOYASAR_SECRET_KEY is not configured.");
  }

  const credentials = Buffer.from(`${secretKey}:`).toString("base64");
  const response = await fetch(`${MOYASAR_API_BASE}/payments/${paymentId}`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Moyasar payment fetch failed (${response.status}): ${body}`);
  }

  return response.json();
}

function getPaymentMetadata(payment) {
  return payment.metadata || payment.source?.metadata || {};
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

export async function verifyAndPersistPayment(paymentId) {
  if (!paymentId) {
    return { success: false, status: 400, message: "Missing Moyasar payment ID." };
  }

  const { db } = await connectToDatabase();
  await seedPlans(db);

  const existingPayment = await db.collection("payments").findOne({ paymentId });
  if (existingPayment) {
    const subscription = await db.collection("subscriptions").findOne({ userId: existingPayment.userId });
    return {
      success: true,
      alreadyVerified: true,
      paymentId,
      orderId: existingPayment.orderId,
      userId: existingPayment.userId,
      plan: existingPayment.planId,
      planName: subscription?.planName || existingPayment.planId,
      amount: existingPayment.amountHalalas,
      currency: existingPayment.currency,
      subscription,
    };
  }

  const payment = await fetchMoyasarPayment(paymentId);
  const metadata = getPaymentMetadata(payment);
  const orderId = metadata.orderId;
  const userId = metadata.userId;
  const planId = metadata.planId;

  if (!orderId || !userId || !planId) {
    return { success: false, status: 400, message: "Payment metadata is missing orderId, userId, or planId." };
  }

  const order = await db.collection("orders").findOne({ orderId });
  if (!order) {
    return { success: false, status: 404, message: "Order not found for this payment." };
  }

  if (order.status === "paid") {
    const paymentRecord = await db.collection("payments").findOne({ orderId });
    const subscription = await db.collection("subscriptions").findOne({ userId: order.userId });
    return {
      success: true,
      alreadyVerified: true,
      paymentId: paymentRecord?.paymentId || paymentId,
      orderId,
      userId: order.userId,
      plan: order.planId,
      planName: order.planName,
      amount: order.amountHalalas,
      currency: order.currency,
      subscription,
    };
  }

  const plan = await db.collection("plans").findOne({ planId: order.planId, isActive: true });
  if (!plan) {
    return { success: false, status: 400, message: "The selected plan is no longer active." };
  }

  if (payment.status !== "paid") {
    await db.collection("orders").updateOne(
      { orderId },
      { $set: { status: payment.status === "failed" ? "failed" : "pending", moyasarPaymentId: payment.id, updatedAt: new Date() } },
    );
    return { success: false, status: 400, message: `Payment status is "${payment.status}".` };
  }

  if (payment.currency !== order.currency || payment.currency !== "SAR") {
    return { success: false, status: 400, message: "Invalid payment currency." };
  }

  if (payment.amount !== order.amountHalalas || plan.amountHalalas !== order.amountHalalas) {
    return { success: false, status: 400, message: "Payment amount does not match the selected plan." };
  }

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setDate(periodEnd.getDate() + 30);

  const source = payment.source || {};
  const cardNumber = typeof source.number === "string" ? source.number : "";

  const paymentRecord = {
    paymentId: payment.id,
    orderId,
    userId: order.userId,
    planId: order.planId,
    provider: "moyasar",
    status: "paid",
    amountHalalas: payment.amount,
    currency: payment.currency,
    paymentMethod: source.type || "creditcard",
    cardBrand: source.company || null,
    cardLast4: cardNumber.slice(-4) || null,
    rawProviderResponse: safePaymentSnapshot(payment),
    verifiedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection("payments").insertOne(paymentRecord);
  await db.collection("orders").updateOne(
    { orderId },
    { $set: { status: "paid", moyasarPaymentId: payment.id, updatedAt: now } },
  );

  const subscription = {
    userId: order.userId,
    planId: plan.planId,
    planName: plan.name,
    status: "active",
    amountSar: plan.priceSar,
    amountHalalas: plan.amountHalalas,
    currency: "SAR",
    billingCycle: plan.billingCycle,
    startsAt: now,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    paymentId: payment.id,
    orderId,
    buildingLimit: plan.buildingLimit,
    labourLimit: plan.labourLimit,
    updatedAt: now,
  };

  await db.collection("subscriptions").updateOne(
    { userId: order.userId },
    { $set: subscription, $setOnInsert: { createdAt: now } },
    { upsert: true },
  );

  await db.collection("users").updateOne(
    { _id: order.userId },
    { $set: { status: "active", updatedAt: now } },
  );

  return {
    success: true,
    alreadyVerified: false,
    paymentId: payment.id,
    orderId,
    userId: order.userId,
    plan: plan.planId,
    planName: plan.name,
    amount: payment.amount,
    currency: payment.currency,
    subscription,
  };
}
