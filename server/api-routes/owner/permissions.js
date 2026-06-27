import { getUserContext, requireDashboardAccess } from "../_lib/access.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { publicPlan } from "../_lib/plans.js";
import { requireRole, ROLES } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const user = await requireRole(req, ROLES.OWNER);
    if (!user) return sendError(res, 401, "Owner access required.");
    const context = await getUserContext(user);
    requireDashboardAccess(context, { allowBilling: true });
    const plan = publicPlan(context.plan);
    sendJson(res, 200, {
      success: true,
      plan,
      permissions: {
        canCreateBuildings: plan?.maxBuildings === null,
        maxBuildings: plan?.maxBuildings,
        maxLabourUsers: plan?.maxLabourUsers,
        checklistTemplates: !!plan?.checklistTemplates,
        dailyReports: !!plan?.dailyReports,
        todaysReports: !!plan?.todaysReports,
        reportHistory: plan?.reportHistory,
        reportHistoryDays: plan?.reportHistoryDays,
        advancedReports: !!plan?.advancedReports,
        supportLevel: plan?.supportLevel,
        customSetup: !!plan?.customSetup,
      },
    });
  } catch (error) {
    console.error("[owner-permissions]", error.message);
    sendError(
      res,
      error.status || 500,
      error.status ? error.message : "Could not load permissions.",
    );
  }
}
