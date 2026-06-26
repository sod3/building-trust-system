import { getUserContext, requireDashboardAccess } from "../_lib/access.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireRole, ROLES } from "../_lib/security.js";
import { publicBuilding } from "../_lib/summaries.js";
import { asString } from "../_lib/validation.js";
import { writeAuditLog } from "../_lib/audit.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET", "PATCH", "DELETE"])) return;

  try {
    const user = await requireRole(req, [ROLES.OWNER, ROLES.LABOUR, ROLES.SUPER_ADMIN]);
    if (!user) return sendError(res, 401, "Unauthorized.");
    const context = await getUserContext(user);
    if (context.role !== ROLES.SUPER_ADMIN) requireDashboardAccess(context);

    const id = req.query?.id || req.url.split("/").pop();
    if (context.role === ROLES.LABOUR && !(user.assignedBuildingIds || []).includes(id)) {
      return sendError(res, 404, "Building not found.");
    }

    const filter = context.role === ROLES.SUPER_ADMIN
      ? { _id: id }
      : { _id: id, orgId: context.role === ROLES.LABOUR ? user.orgId : context.org._id };

    const building = await context.db.collection("buildings").findOne(filter);
    if (!building || building.status === "deleted") return sendError(res, 404, "Building not found.");

    if (req.method === "GET") {
      return sendJson(res, 200, { success: true, building: publicBuilding(building) });
    }

    if (![ROLES.OWNER, ROLES.SUPER_ADMIN].includes(context.role)) {
      return sendError(res, 403, "Only owners can update buildings.");
    }

    if (req.method === "DELETE") {
      await context.db.collection("buildings").updateOne(
        { _id: building._id },
        { $set: { status: "deleted", updatedAt: new Date() } },
      );
      await writeAuditLog(context.db, { orgId: building.orgId, userId: user._id, action: "building.deleted", details: { buildingId: building._id } });
      return sendJson(res, 200, { success: true });
    }

    const body = await readJsonBody(req);
    const update = {
      name: asString(body.name || building.name),
      address: asString(body.address ?? building.address),
      city: asString(body.city ?? building.city),
      buildingType: asString(body.buildingType ?? building.buildingType),
      cover: asString(body.cover ?? building.cover),
      updatedAt: new Date(),
    };

    await context.db.collection("buildings").updateOne({ _id: building._id }, { $set: update });
    const updated = await context.db.collection("buildings").findOne({ _id: building._id });
    await writeAuditLog(context.db, { orgId: building.orgId, userId: user._id, action: "building.updated", details: { buildingId: building._id } });
    sendJson(res, 200, { success: true, building: publicBuilding(updated) });
  } catch (error) {
    console.error("[building-id]", error.message);
    sendError(res, error.status || 500, error.status ? error.message : "Could not process building.");
  }
}
