import { connectToDatabase } from "./_lib/db.js";
import { getPathId, requireMethod, sendError, sendJson } from "./_lib/http.js";
import { getActivePlan, publicPlan, seedPlans } from "./_lib/plans.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const { db } = await connectToDatabase();
    await seedPlans(db);
    const slug = getPathId(req, "/api/plans");

    if (slug) {
      const plan = await getActivePlan(db, slug);
      if (!plan) return sendError(res, 404, "Plan not found.");
      return sendJson(res, 200, { success: true, plan: publicPlan(plan) });
    }

    const plans = await db.collection("plans").find({ isActive: true }).sort({ amountHalalas: 1 }).toArray();
    sendJson(res, 200, { success: true, plans: plans.map(publicPlan) });
  } catch (error) {
    console.error("[plans]", error.message);
    sendError(res, 500, "Could not load plans.");
  }
}
