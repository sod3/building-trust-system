import { connectToDatabase } from "../_lib/db.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireAdmin } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const admin = await requireAdmin(req);
    if (!admin) return sendError(res, 401, "Admin access required.");

    const { db } = await connectToDatabase();
    const invoices = await db
      .collection("invoices")
      .aggregate([
        {
          $lookup: {
            from: "organizations",
            localField: "orgId",
            foreignField: "_id",
            as: "orgRows",
          },
        },
        { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userRows" } },
        { $project: { "userRows.passwordHash": 0 } },
        { $sort: { createdAt: -1 } },
        { $limit: 200 },
      ])
      .toArray();

    sendJson(res, 200, {
      success: true,
      invoices: invoices.map((invoice) => ({
        ...invoice,
        organization: invoice.orgRows?.[0] || null,
        user: invoice.userRows?.[0] || null,
      })),
    });
  } catch (error) {
    console.error("[admin-invoices]", error.message);
    sendError(res, 500, "Could not load invoices.");
  }
}
