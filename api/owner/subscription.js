import { connectToDatabase } from "../_lib/db.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { getAuthUser } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "owner") return sendError(res, 401, "Unauthorized.");

    const { db } = await connectToDatabase();
    const subscription = await db.collection("subscriptions").findOne({ userId: user._id });
    const payments = await db
      .collection("payments")
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    const now = new Date();
    const isActive =
      subscription?.status === "active" && new Date(subscription.currentPeriodEnd) > now;

    sendJson(res, 200, {
      success: true,
      access: isActive ? "active" : "inactive",
      user,
      subscription,
      payments,
    });
  } catch (error) {
    console.error("[owner-subscription]", error.message);
    sendError(res, 500, "Could not load owner subscription.");
  }
}
