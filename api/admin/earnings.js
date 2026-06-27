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

    const [allPaid, monthlyPaid, activeSubscriptions, paidOwners, recentPayments] =
      await Promise.all([
        db
          .collection("payments")
          .aggregate([
            { $match: { status: "paid" } },
            { $group: { _id: null, amount: { $sum: "$amountHalalas" } } },
          ])
          .toArray(),
        db
          .collection("payments")
          .aggregate([
            { $match: { status: "paid", createdAt: { $gte: monthStart } } },
            { $group: { _id: null, amount: { $sum: "$amountHalalas" } } },
          ])
          .toArray(),
        db.collection("subscriptions").countDocuments({
          status: "active",
          currentPeriodEnd: { $gt: new Date() },
        }),
        db.collection("subscriptions").distinct("userId", {
          status: "active",
          currentPeriodEnd: { $gt: new Date() },
        }),
        db
          .collection("payments")
          .aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: 8 },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "ownerRows",
              },
            },
            {
              $project: {
                rawProviderResponse: 0,
                "ownerRows.passwordHash": 0,
              },
            },
          ])
          .toArray(),
      ]);

    sendJson(res, 200, {
      success: true,
      totalRevenueSar: (allPaid[0]?.amount || 0) / 100,
      monthlyRevenueSar: (monthlyPaid[0]?.amount || 0) / 100,
      activeSubscriptions,
      paidOwners: paidOwners.length,
      recentPayments: recentPayments.map((payment) => ({
        ...payment,
        owner: payment.ownerRows?.[0] || null,
      })),
    });
  } catch (error) {
    console.error("[admin-earnings]", error.message);
    sendError(res, 500, "Could not load earnings.");
  }
}
