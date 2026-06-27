import { getUserContext, requireDashboardAccess } from "../_lib/access.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireRole, ROLES } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const user = await requireRole(req, ROLES.OWNER);
    if (!user) return sendError(res, 401, "Owner access required.");
    const context = await getUserContext(user);
    requireDashboardAccess(context, { allowBilling: true });

    const now = new Date();
    await context.db
      .collection("subscriptions")
      .updateOne({ orgId: context.org._id }, { $set: { cancelAtPeriodEnd: true, updatedAt: now } });

    sendJson(res, 200, {
      success: true,
      message: "Subscription will cancel at the end of the current billing period.",
    });
  } catch (error) {
    console.error("[billing-cancel]", error.message);
    sendError(
      res,
      error.status || 500,
      error.status ? error.message : "Could not cancel subscription.",
    );
  }
}
