import { getUserContext, requireDashboardAccess } from "../_lib/access.js";
import { getActivePlan, isUnlimited } from "../_lib/plans.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireRole, ROLES } from "../_lib/security.js";
import { asString } from "../_lib/validation.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const user = await requireRole(req, ROLES.OWNER);
    if (!user) return sendError(res, 401, "Owner access required.");
    const context = await getUserContext(user);
    requireDashboardAccess(context, { allowBilling: true });

    const body = await readJsonBody(req);
    const targetPlanId = asString(body.planId || body.targetPlanId).toLowerCase();
    const plan = await getActivePlan(context.db, targetPlanId);
    if (!plan) return sendError(res, 404, "Target plan was not found.");
    if (plan.amountHalalas >= (context.subscription?.amountHalalas || 0)) {
      return sendError(res, 400, "Please use the upgrade endpoint for higher-priced plans.");
    }

    const [buildingCount, labourCount] = await Promise.all([
      context.db
        .collection("buildings")
        .countDocuments({ orgId: context.org._id, status: { $ne: "deleted" } }),
      context.db.collection("users").countDocuments({
        orgId: context.org._id,
        role: { $in: [ROLES.LABOUR, "labour"] },
        status: { $ne: "deleted" },
      }),
    ]);

    if (!isUnlimited(plan.maxBuildings) && buildingCount > plan.maxBuildings) {
      return sendError(
        res,
        400,
        plan.slug === "starter"
          ? "Starter allows only 1 building. Please remove extra buildings before downgrading."
          : "Professional allows up to 5 buildings. Please remove extra buildings before downgrading.",
      );
    }

    if (!isUnlimited(plan.maxLabourUsers) && labourCount > plan.maxLabourUsers) {
      return sendError(
        res,
        400,
        `${plan.name} allows ${plan.maxLabourUsers} labour account(s). Please remove extra labour users before downgrading.`,
      );
    }

    await context.db.collection("subscriptions").updateOne(
      { orgId: context.org._id },
      {
        $set: {
          pendingPlanId: plan.slug || plan.planId,
          pendingPlanName: plan.name,
          pendingPlanEffectiveAt: context.subscription.currentPeriodEnd,
          updatedAt: new Date(),
        },
      },
    );

    sendJson(res, 200, {
      success: true,
      message: `Downgrade to ${plan.name} scheduled for the next billing cycle.`,
      pendingPlanId: plan.slug || plan.planId,
      effectiveAt: context.subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error("[billing-downgrade]", error.message);
    sendError(
      res,
      error.status || 500,
      error.status ? error.message : "Could not schedule downgrade.",
    );
  }
}
