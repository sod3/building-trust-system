import { getUserContext, requireDashboardAccess } from "../_lib/access.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "../_lib/http.js";
import { createId, requireRole, ROLES } from "../_lib/security.js";
import { asString } from "../_lib/validation.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const user = await requireRole(req, ROLES.OWNER);
    if (!user) return sendError(res, 401, "Owner access required.");
    const context = await getUserContext(user);
    requireDashboardAccess(context, { allowBilling: true });

    const body = await readJsonBody(req);
    const moyasarTokenId = asString(body.moyasarTokenId || body.token || body.paymentMethodToken);
    if (!moyasarTokenId) return sendError(res, 400, "A Moyasar payment method token is required.");

    const now = new Date();
    await context.db.collection("paymentMethods").updateMany(
      { orgId: context.org._id, status: "active" },
      { $set: { status: "replaced", updatedAt: now } },
    );

    const paymentMethod = {
      _id: createId("pm"),
      orgId: context.org._id,
      userId: user._id,
      moyasarTokenId,
      brand: asString(body.brand) || null,
      last4: asString(body.last4) || null,
      expiryMonth: asString(body.expiryMonth) || null,
      expiryYear: asString(body.expiryYear) || null,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    await context.db.collection("paymentMethods").insertOne(paymentMethod);
    await context.db.collection("subscriptions").updateOne(
      { orgId: context.org._id },
      { $set: { paymentMethodId: paymentMethod._id, updatedAt: now } },
    );

    const { moyasarTokenId: _hidden, ...safePaymentMethod } = paymentMethod;
    sendJson(res, 200, { success: true, paymentMethod: safePaymentMethod });
  } catch (error) {
    console.error("[billing-update-payment-method]", error.message);
    sendError(res, error.status || 500, error.status ? error.message : "Could not update payment method.");
  }
}
