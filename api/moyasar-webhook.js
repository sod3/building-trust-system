import { connectToDatabase } from "./_lib/db.js";
import { readJsonBody, requireMethod, sendJson } from "./_lib/http.js";
import { verifyAndPersistPayment } from "./_lib/payment.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const event = await readJsonBody(req);
    const { db } = await connectToDatabase();
    const configuredSecret = process.env.MOYASAR_WEBHOOK_SECRET;

    if (configuredSecret && event.secret_token !== configuredSecret) {
      console.warn("[moyasar-webhook] invalid secret token");
      return sendJson(res, 401, { received: false });
    }

    if (event.id) {
      const existing = await db.collection("webhookEvents").findOne({ eventId: event.id });
      if (existing?.processedAt) {
        return sendJson(res, 200, { received: true, duplicate: true });
      }
      await db.collection("webhookEvents").updateOne(
        { eventId: event.id },
        {
          $setOnInsert: {
            _id: event.id,
            eventId: event.id,
            type: event.type,
            createdAt: new Date(event.created_at || Date.now()),
          },
          $set: { updatedAt: new Date() },
        },
        { upsert: true },
      );
    }

    const payment = event.data || event.payment || event;
    const paymentId = payment.id || event.id;
    const eventType = event.type || event.event || payment.status;

    if (paymentId && ["payment_paid", "payment.paid", "paid", "payment_captured"].includes(eventType)) {
      await verifyAndPersistPayment(paymentId);
    }

    if (paymentId && ["payment_failed", "payment_faild", "payment.failed", "failed"].includes(eventType)) {
      await verifyAndPersistPayment(paymentId).catch(() => null);
    }

    if (event.id) {
      await db.collection("webhookEvents").updateOne(
        { eventId: event.id },
        { $set: { processedAt: new Date(), updatedAt: new Date() } },
      );
    }

    sendJson(res, 200, { received: true });
  } catch (error) {
    console.error("[moyasar-webhook]", error.message);
    sendJson(res, 200, { received: true });
  }
}
