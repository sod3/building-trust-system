import { connectToDatabase } from "./db.js";
import { getActivePlan } from "./plans.js";
import { chargeMoyasarToken, verifyAndPersistPayment } from "./payment.js";
import { createId } from "./security.js";

const retryDelays = [1, 3, 5];

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export async function createInvoiceAndOrder(
  db,
  { orgId, userId, subscriptionId, plan, billingReason },
) {
  const now = new Date();
  const invoiceId = createId("inv");
  const orderId = createId("order");

  const invoice = {
    _id: createId("invoicedoc"),
    invoiceId,
    orgId,
    userId,
    subscriptionId,
    planId: plan.slug || plan.planId,
    amount: plan.amountHalalas,
    amountHalalas: plan.amountHalalas,
    currency: plan.currency,
    status: "pending",
    billingReason,
    moyasarPaymentId: null,
    dueDate: now,
    paidAt: null,
    createdAt: now,
    updatedAt: now,
  };

  const order = {
    _id: createId("orderdoc"),
    orderId,
    invoiceId,
    orgId,
    userId,
    subscriptionId,
    planId: plan.slug || plan.planId,
    planName: plan.name,
    amountHalalas: plan.amountHalalas,
    currency: plan.currency,
    status: "pending",
    billingReason,
    moyasarPaymentId: null,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection("invoices").insertOne(invoice);
  await db.collection("orders").insertOne(order);
  return { invoice, order };
}

async function markRenewalFailed(db, { subscription, invoice, order, reason }) {
  const now = new Date();
  const retryCount = (subscription.retryCount || 0) + 1;
  const gracePeriodEndsAt = subscription.gracePeriodEndsAt || addDays(now, 7);
  const shouldSuspend = now >= new Date(gracePeriodEndsAt) || retryCount > retryDelays.length;
  const nextRetryDelay = retryDelays[Math.min(retryCount - 1, retryDelays.length - 1)];

  await db
    .collection("invoices")
    .updateOne(
      { invoiceId: invoice.invoiceId },
      { $set: { status: "failed", failureReason: reason, updatedAt: now } },
    );
  await db
    .collection("orders")
    .updateOne(
      { orderId: order.orderId },
      { $set: { status: "failed", failureReason: reason, updatedAt: now } },
    );
  await db.collection("subscriptions").updateOne(
    { _id: subscription._id },
    {
      $set: {
        status: shouldSuspend ? "suspended" : "past_due",
        lastPaymentStatus: "failed",
        retryCount,
        gracePeriodEndsAt,
        nextBillingDate: shouldSuspend
          ? subscription.nextBillingDate
          : addDays(now, nextRetryDelay),
        updatedAt: now,
      },
    },
  );
  await db.collection("organizations").updateOne(
    { _id: subscription.orgId },
    {
      $set: {
        subscriptionStatus: shouldSuspend ? "suspended" : "past_due",
        status: shouldSuspend ? "suspended" : "active",
        updatedAt: now,
      },
    },
  );
  await db
    .collection("users")
    .updateMany(
      { orgId: subscription.orgId, role: { $in: ["OWNER", "owner"] } },
      { $set: { status: shouldSuspend ? "suspended" : "active", updatedAt: now } },
    );

  return { status: shouldSuspend ? "suspended" : "past_due", reason };
}

export async function processDueSubscriptions({ limit = 50 } = {}) {
  const { db } = await connectToDatabase();
  const now = new Date();
  const subscriptions = await db
    .collection("subscriptions")
    .find({
      billingMode: "automatic",
      status: { $in: ["active", "past_due"] },
      cancelAtPeriodEnd: { $ne: true },
      nextBillingDate: { $lte: now },
    })
    .limit(limit)
    .toArray();

  const results = [];
  for (const subscription of subscriptions) {
    const plan = await getActivePlan(db, subscription.planId);
    if (!plan) {
      results.push({
        subscriptionId: subscription._id,
        success: false,
        message: "Plan is not active.",
      });
      continue;
    }

    const paymentMethod = subscription.paymentMethodId
      ? await db
          .collection("paymentMethods")
          .findOne({ _id: subscription.paymentMethodId, status: "active" })
      : await db
          .collection("paymentMethods")
          .findOne({ orgId: subscription.orgId, status: "active" });

    const { invoice, order } = await createInvoiceAndOrder(db, {
      orgId: subscription.orgId,
      userId: subscription.userId,
      subscriptionId: subscription._id,
      plan,
      billingReason: "renewal",
    });

    if (!paymentMethod?.moyasarTokenId) {
      const failed = await markRenewalFailed(db, {
        subscription,
        invoice,
        order,
        reason: "No saved Moyasar payment token is available.",
      });
      results.push({ subscriptionId: subscription._id, success: false, ...failed });
      continue;
    }

    try {
      const payment = await chargeMoyasarToken({
        amount: plan.amountHalalas,
        currency: plan.currency,
        description: `${plan.name} renewal - FacilityOS Arabia`,
        token: paymentMethod.moyasarTokenId,
        metadata: {
          orderId: order.orderId,
          order_id: order.orderId,
          invoiceId: invoice.invoiceId,
          invoice_id: invoice.invoiceId,
          userId: subscription.userId,
          user_id: subscription.userId,
          orgId: subscription.orgId,
          org_id: subscription.orgId,
          planId: plan.slug || plan.planId,
          plan_id: plan.slug || plan.planId,
          billingReason: "renewal",
        },
      });

      const verified = await verifyAndPersistPayment(payment.id);
      results.push({
        subscriptionId: subscription._id,
        success: verified.success,
        paymentId: payment.id,
      });
    } catch (error) {
      const failed = await markRenewalFailed(db, {
        subscription,
        invoice,
        order,
        reason: error?.response?.message || error.message || "Renewal payment failed.",
      });
      results.push({ subscriptionId: subscription._id, success: false, ...failed });
    }
  }

  return { processed: results.length, results };
}
