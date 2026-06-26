import { connectToDatabase } from "../_lib/db.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireAdmin } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const admin = await requireAdmin(req);
    if (!admin) return sendError(res, 401, "Admin access required.");

    const { db } = await connectToDatabase();
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      totalOrganizations,
      activeCustomers,
      activeSubscriptions,
      monthlyRecurring,
      paidInvoices,
      failedPayments,
      planDistribution,
      recentPayments,
      suspendedAccounts,
      totalBuildings,
      totalLabour,
      todayReports,
    ] = await Promise.all([
      db.collection("organizations").countDocuments({}),
      db.collection("organizations").countDocuments({ status: "active" }),
      db.collection("subscriptions").countDocuments({ status: "active" }),
      db.collection("subscriptions").aggregate([
        { $match: { status: "active" } },
        { $group: { _id: null, amount: { $sum: "$amountHalalas" } } },
      ]).toArray(),
      db.collection("invoices").countDocuments({ status: "paid" }),
      db.collection("payments").countDocuments({ status: { $in: ["failed", "declined"] } }),
      db.collection("subscriptions").aggregate([
        { $group: { _id: "$planId", count: { $sum: 1 }, mrrHalalas: { $sum: { $cond: [{ $eq: ["$status", "active"] }, "$amountHalalas", 0] } } } },
        { $sort: { _id: 1 } },
      ]).toArray(),
      db.collection("payments").aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        { $lookup: { from: "organizations", localField: "orgId", foreignField: "_id", as: "orgRows" } },
        { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userRows" } },
        { $project: { rawResponse: 0, rawProviderResponse: 0, "userRows.passwordHash": 0 } },
      ]).toArray(),
      db.collection("organizations").countDocuments({ status: "suspended" }),
      db.collection("buildings").countDocuments({ status: { $ne: "deleted" } }),
      db.collection("users").countDocuments({ role: { $in: ["LABOUR", "labour"] }, status: { $ne: "deleted" } }),
      db.collection("dailyReports").countDocuments({ date: new Date().toISOString().slice(0, 10) }),
    ]);

    sendJson(res, 200, {
      success: true,
      metrics: {
        totalOrganizations,
        activeCustomers,
        activeSubscriptions,
        monthlyRecurringRevenueSar: (monthlyRecurring[0]?.amount || 0) / 100,
        paidInvoices,
        failedPayments,
        suspendedAccounts,
        totalBuildings,
        totalLabour,
        todayReports,
      },
      planDistribution,
      recentPayments: recentPayments.map((payment) => ({
        ...payment,
        organization: payment.orgRows?.[0] || null,
        user: payment.userRows?.[0] || null,
      })),
    });
  } catch (error) {
    console.error("[admin-overview]", error.message);
    sendError(res, 500, "Could not load admin overview.");
  }
}
