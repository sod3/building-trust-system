import { connectToDatabase } from "../_lib/db.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireAdmin } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const admin = await requireAdmin(req);
    if (!admin) return sendError(res, 401, "Admin access required.");

    const { db } = await connectToDatabase();
    const subscriptions = await db
      .collection("subscriptions")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "ownerRows",
          },
        },
        { $sort: { updatedAt: -1 } },
        {
          $project: {
            "ownerRows.passwordHash": 0,
          },
        },
      ])
      .toArray();

    sendJson(res, 200, {
      success: true,
      subscriptions: subscriptions.map((subscription) => ({
        ...subscription,
        owner: subscription.ownerRows?.[0] || null,
      })),
    });
  } catch (error) {
    console.error("[admin-subscriptions]", error.message);
    sendError(res, 500, "Could not load subscriptions.");
  }
}
