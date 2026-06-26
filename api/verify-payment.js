import { getQueryParam, requireMethod, sendError, sendJson } from "./_lib/http.js";
import { publicUser, setAuthCookie, signJwt } from "./_lib/security.js";
import { connectToDatabase } from "./_lib/db.js";
import { verifyAndPersistPayment } from "./_lib/payment.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET", "POST"])) return;

  try {
    const paymentId = getQueryParam(req, "id");
    const result = await verifyAndPersistPayment(paymentId);

    if (!result.success) {
      return sendError(res, result.status || 400, result.message);
    }

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ _id: result.userId });
    const token = user ? signJwt({ sub: user._id, role: user.role, orgId: user.orgId || result.orgId || null }) : null;
    if (token) setAuthCookie(res, token);

    sendJson(res, 200, {
      success: true,
      alreadyVerified: result.alreadyVerified,
      token,
      user: publicUser(user),
      status: "paid",
      plan: result.plan,
      planName: result.planName,
      amount: result.amount,
      currency: result.currency,
      paymentId: result.paymentId,
      orderId: result.orderId,
      invoiceId: result.invoiceId,
      orgId: result.orgId,
      subscription: result.subscription,
    });
  } catch (error) {
    console.error("[verify-payment]", error.message);
    sendError(res, 500, error.message || "Payment verification failed.");
  }
}
