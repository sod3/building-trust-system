import { connectToDatabase } from "../_lib/db.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireAdmin } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const admin = await requireAdmin(req);
    if (!admin) return sendError(res, 401, "Admin access required.");

    const { db } = await connectToDatabase();
    const owners = await db
      .collection("users")
      .aggregate([
        { $match: { role: { $in: ["OWNER", "owner"] } } },
        {
          $lookup: {
            from: "organizations",
            localField: "_id",
            foreignField: "ownerUserId",
            as: "orgRows",
          },
        },
        {
          $lookup: {
            from: "subscriptions",
            localField: "orgRows._id",
            foreignField: "orgId",
            as: "subscriptionRows",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "orgRows._id",
            foreignField: "orgId",
            as: "paymentRows",
          },
        },
        {
          $lookup: {
            from: "buildings",
            localField: "orgRows._id",
            foreignField: "orgId",
            as: "buildingRows",
          },
        },
        {
          $project: {
            passwordHash: 0,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    const rows = owners.map((owner) => {
      const subscription = owner.subscriptionRows?.[0] || null;
      const totalPaidHalalas = (owner.paymentRows || []).reduce(
        (sum, payment) => sum + (payment.status === "paid" ? payment.amountHalalas || 0 : 0),
        0,
      );

      return {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone || "",
        status: owner.status,
        organization: owner.orgRows?.[0] || null,
        plan: subscription?.planName || "No Plan",
        planId: subscription?.planId || null,
        subscriptionStatus: subscription?.status || "inactive",
        currentPeriodEnd: subscription?.currentPeriodEnd || null,
        buildingCount: (owner.buildingRows || []).filter((building) => building.status !== "deleted").length,
        totalPaidSar: totalPaidHalalas / 100,
        createdAt: owner.createdAt,
      };
    });

    sendJson(res, 200, { success: true, owners: rows });
  } catch (error) {
    console.error("[admin-owners]", error.message);
    sendError(res, 500, "Could not load owners.");
  }
}
