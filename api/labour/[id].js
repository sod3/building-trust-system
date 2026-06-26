import { getUserContext, requireDashboardAccess } from "../_lib/access.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "../_lib/http.js";
import { asEmail, asString } from "../_lib/validation.js";
import { hashPassword, requireRole, ROLES } from "../_lib/security.js";
import { writeAuditLog } from "../_lib/audit.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET", "PATCH", "DELETE"])) return;

  try {
    const user = await requireRole(req, [ROLES.OWNER, ROLES.LABOUR, ROLES.SUPER_ADMIN]);
    if (!user) return sendError(res, 401, "Unauthorized.");
    const context = await getUserContext(user);
    if (context.role !== ROLES.SUPER_ADMIN) requireDashboardAccess(context);

    const id = req.query?.id || req.url.split("/").pop();
    const filter = context.role === ROLES.SUPER_ADMIN
      ? { _id: id, role: { $in: [ROLES.LABOUR, "labour"] } }
      : context.role === ROLES.LABOUR
        ? { _id: user._id }
        : { _id: id, orgId: context.org._id, role: { $in: [ROLES.LABOUR, "labour"] } };
    const labourUser = await context.db.collection("users").findOne(filter, { projection: { passwordHash: 0 } });
    if (!labourUser || labourUser.status === "deleted") return sendError(res, 404, "Labour account not found.");

    if (req.method === "GET") return sendJson(res, 200, { success: true, labour: { id: labourUser._id, ...labourUser } });

    if (![ROLES.OWNER, ROLES.SUPER_ADMIN].includes(context.role)) {
      return sendError(res, 403, "Only owners can update labour accounts.");
    }

    if (req.method === "DELETE") {
      await context.db.collection("users").updateOne(
        { _id: labourUser._id },
        { $set: { status: "deleted", updatedAt: new Date() } },
      );
      await writeAuditLog(context.db, { orgId: labourUser.orgId, userId: user._id, action: "labour.deleted", details: { labourUserId: labourUser._id } });
      return sendJson(res, 200, { success: true });
    }

    const body = await readJsonBody(req);
    const assignedBuildingIds = body.assignedBuildingIds
      ? [].concat(body.assignedBuildingIds).filter(Boolean).map(String)
      : labourUser.assignedBuildingIds || [];
    const update = {
      name: asString(body.name || labourUser.name),
      email: asEmail(body.email || labourUser.email),
      phone: asString(body.phone ?? labourUser.phone),
      assignedBuildingIds,
      status: asString(body.status || labourUser.status),
      updatedAt: new Date(),
    };
    if (body.password) update.passwordHash = hashPassword(String(body.password));

    await context.db.collection("users").updateOne({ _id: labourUser._id }, { $set: update });
    const updated = await context.db.collection("users").findOne({ _id: labourUser._id }, { projection: { passwordHash: 0 } });
    await writeAuditLog(context.db, { orgId: labourUser.orgId, userId: user._id, action: "labour.updated", details: { labourUserId: labourUser._id } });
    sendJson(res, 200, { success: true, labour: { id: updated._id, ...updated } });
  } catch (error) {
    if (error?.code === 11000) return sendError(res, 409, "A user with this email already exists.");
    console.error("[labour-id]", error.message);
    sendError(res, error.status || 500, error.status ? error.message : "Could not process labour account.");
  }
}
