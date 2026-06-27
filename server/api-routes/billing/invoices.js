import { getUserContext, requireDashboardAccess } from "../_lib/access.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireRole, ROLES } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const user = await requireRole(req, [ROLES.OWNER, ROLES.SUPER_ADMIN]);
    if (!user) return sendError(res, 401, "Unauthorized.");
    const context = await getUserContext(user);
    requireDashboardAccess(context, { allowBilling: true });

    const invoices = await context.db
      .collection("invoices")
      .find({ orgId: context.org._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    sendJson(res, 200, { success: true, invoices });
  } catch (error) {
    console.error("[billing-invoices]", error.message);
    sendError(res, error.status || 500, error.status ? error.message : "Could not load invoices.");
  }
}
