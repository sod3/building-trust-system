import { connectToDatabase } from "../_lib/db.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { getActivePlan, publicPlan } from "../_lib/plans.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const { db } = await connectToDatabase();
    const slug = req.query?.slug || req.url.split("/").pop();
    const plan = await getActivePlan(db, slug);
    if (!plan) return sendError(res, 404, "Plan not found.");
    sendJson(res, 200, { success: true, plan: publicPlan(plan) });
  } catch (error) {
    console.error("[plan-detail]", error.message);
    sendError(res, 500, "Could not load plan.");
  }
}
