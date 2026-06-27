import { connectToDatabase } from "../_lib/db.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireAdmin } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const admin = await requireAdmin(req);
    if (!admin) return sendError(res, 401, "Admin access required.");

    const { db } = await connectToDatabase();
    const organizations = await db
      .collection("organizations")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "ownerUserId",
            foreignField: "_id",
            as: "ownerRows",
          },
        },
        {
          $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "orgId",
            as: "subscriptionRows",
          },
        },
        {
          $lookup: {
            from: "buildings",
            localField: "_id",
            foreignField: "orgId",
            as: "buildingRows",
          },
        },
        { $project: { "ownerRows.passwordHash": 0 } },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    sendJson(res, 200, {
      success: true,
      organizations: organizations.map((org) => ({
        ...org,
        owner: org.ownerRows?.[0] || null,
        subscription: org.subscriptionRows?.[0] || null,
        buildingCount: (org.buildingRows || []).filter((building) => building.status !== "deleted")
          .length,
      })),
    });
  } catch (error) {
    console.error("[admin-organizations]", error.message);
    sendError(res, 500, "Could not load organizations.");
  }
}
