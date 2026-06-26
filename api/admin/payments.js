import { connectToDatabase } from "../_lib/db.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireAdmin } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const admin = await requireAdmin(req);
    if (!admin) return sendError(res, 401, "Admin access required.");

    const { db } = await connectToDatabase();
    const payments = await db
      .collection("payments")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "ownerRows",
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            rawProviderResponse: 0,
            "ownerRows.passwordHash": 0,
          },
        },
      ])
      .toArray();

    sendJson(res, 200, {
      success: true,
      payments: payments.map((payment) => ({
        ...payment,
        owner: payment.ownerRows?.[0] || null,
      })),
    });
  } catch (error) {
    console.error("[admin-payments]", error.message);
    sendError(res, 500, "Could not load payments.");
  }
}
