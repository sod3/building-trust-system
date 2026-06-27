import { connectToDatabase } from "../../../_lib/db.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "../../../_lib/http.js";
import { requireAdmin } from "../../../_lib/security.js";
import { asString } from "../../../_lib/validation.js";
import { writeAuditLog } from "../../../_lib/audit.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["PATCH"])) return;

  try {
    const admin = await requireAdmin(req);
    if (!admin) return sendError(res, 401, "Admin access required.");

    const id = req.query?.id || req.url.split("/").slice(-2)[0];
    const body = await readJsonBody(req);
    const status = asString(body.status);
    if (!["active", "suspended", "pending_payment"].includes(status)) {
      return sendError(res, 400, "Status must be active, suspended, or pending_payment.");
    }

    const { db } = await connectToDatabase();
    const subscriptionStatus =
      status === "active" ? "active" : status === "suspended" ? "suspended" : "pending";
    await db
      .collection("organizations")
      .updateOne({ _id: id }, { $set: { status, subscriptionStatus, updatedAt: new Date() } });
    await db
      .collection("subscriptions")
      .updateOne({ orgId: id }, { $set: { status: subscriptionStatus, updatedAt: new Date() } });
    await db.collection("users").updateMany(
      { orgId: id, role: { $in: ["OWNER", "owner"] } },
      {
        $set: { status: status === "suspended" ? "suspended" : "active", updatedAt: new Date() },
      },
    );
    await writeAuditLog(db, {
      orgId: id,
      userId: admin._id,
      action: "admin.organization.status_updated",
      details: { status },
    });
    sendJson(res, 200, { success: true });
  } catch (error) {
    console.error("[admin-org-status]", error.message);
    sendError(res, 500, "Could not update organization status.");
  }
}
