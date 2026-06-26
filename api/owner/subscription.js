import { connectToDatabase } from "../_lib/db.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { getUserContext, requireDashboardAccess, serializeContext } from "../_lib/access.js";
import { buildOwnerDashboard } from "../_lib/summaries.js";
import { requireRole, ROLES } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const user = await requireRole(req, ROLES.OWNER);
    if (!user) return sendError(res, 401, "Unauthorized.");

    const { db } = await connectToDatabase();
    const context = await getUserContext(user);
    requireDashboardAccess(context, { allowBilling: true });
    const subscription = await db.collection("subscriptions").findOne({ orgId: context.org._id });
    const invoices = await db
      .collection("invoices")
      .find({ orgId: context.org._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
    const payments = await db
      .collection("payments")
      .find({ orgId: context.org._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();
    const paymentMethod = await db.collection("paymentMethods").findOne(
      { orgId: context.org._id, status: "active" },
      { projection: { moyasarTokenId: 0 } },
    );
    const dashboard = await buildOwnerDashboard(db, context);

    const now = new Date();
    const isActive =
      subscription?.status === "active" ||
      (subscription?.status === "past_due" && subscription?.gracePeriodEndsAt && new Date(subscription.gracePeriodEndsAt) > now);

    sendJson(res, 200, {
      success: true,
      access: isActive ? "active" : "inactive",
      user,
      ...serializeContext(context),
      usage: dashboard.usage,
      subscription,
      invoices,
      payments,
      paymentMethod,
    });
  } catch (error) {
    console.error("[owner-subscription]", error.message);
    sendError(res, 500, "Could not load owner subscription.");
  }
}
