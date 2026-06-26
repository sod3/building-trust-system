import { getUserContext, requireDashboardAccess } from "../_lib/access.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { buildOwnerDashboard } from "../_lib/summaries.js";
import { requireRole, ROLES } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const user = await requireRole(req, ROLES.OWNER);
    if (!user) return sendError(res, 401, "Owner access required.");
    const context = await getUserContext(user);
    requireDashboardAccess(context);
    const dashboard = await buildOwnerDashboard(context.db, context);
    sendJson(res, 200, { success: true, ...dashboard });
  } catch (error) {
    console.error("[owner-overview]", error.message);
    sendError(res, error.status || 500, error.status ? error.message : "Could not load owner dashboard.");
  }
}
