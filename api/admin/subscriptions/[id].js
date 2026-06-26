import { connectToDatabase } from "../../_lib/db.js";
import { getActivePlan } from "../../_lib/plans.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "../../_lib/http.js";
import { requireAdmin } from "../../_lib/security.js";
import { asString } from "../../_lib/validation.js";
import { writeAuditLog } from "../../_lib/audit.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["PATCH"])) return;

  try {
    const admin = await requireAdmin(req);
    if (!admin) return sendError(res, 401, "Admin access required.");

    const id = req.query?.id || req.url.split("/").pop();
    const body = await readJsonBody(req);
    const { db } = await connectToDatabase();
    const subscription = await db.collection("subscriptions").findOne({ _id: id });
    if (!subscription) return sendError(res, 404, "Subscription not found.");

    const update = { updatedAt: new Date() };
    if (body.status) update.status = asString(body.status);
    if (body.planId) {
      const plan = await getActivePlan(db, body.planId);
      if (!plan) return sendError(res, 404, "Plan not found.");
      Object.assign(update, {
        planId: plan.slug || plan.planId,
        planName: plan.name,
        amountSar: plan.priceSar,
        amountHalalas: plan.amountHalalas,
        maxBuildings: plan.maxBuildings,
        maxLabourUsers: plan.maxLabourUsers,
        buildingLimit: plan.maxBuildings,
        labourLimit: plan.maxLabourUsers,
      });
      await db.collection("organizations").updateOne(
        { _id: subscription.orgId },
        { $set: { planId: plan.slug || plan.planId, updatedAt: new Date() } },
      );
    }

    await db.collection("subscriptions").updateOne({ _id: id }, { $set: update });
    await writeAuditLog(db, { orgId: subscription.orgId, userId: admin._id, action: "admin.subscription.updated", details: update });
    const updated = await db.collection("subscriptions").findOne({ _id: id });
    sendJson(res, 200, { success: true, subscription: updated });
  } catch (error) {
    console.error("[admin-subscription-id]", error.message);
    sendError(res, 500, "Could not update subscription.");
  }
}
