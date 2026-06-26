import { readJsonBody, requireMethod, sendJson } from "./_lib/http.js";
import { verifyAndPersistPayment } from "./_lib/payment.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const event = await readJsonBody(req);
    const payment = event.data || event.payment || event;
    const paymentId = payment.id || event.id;
    const eventType = event.type || event.event || payment.status;

    // TODO: Add Moyasar webhook signature verification when a webhook secret is configured.
    if (paymentId && ["payment_paid", "payment.paid", "paid"].includes(eventType)) {
      await verifyAndPersistPayment(paymentId);
    }

    sendJson(res, 200, { received: true });
  } catch (error) {
    console.error("[moyasar-webhook]", error.message);
    sendJson(res, 200, { received: true });
  }
}
