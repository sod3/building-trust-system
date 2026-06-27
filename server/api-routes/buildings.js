import { enforceBuildingLimit, getUserContext, requireDashboardAccess } from "./_lib/access.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "./_lib/http.js";
import { createId, requireRole, ROLES } from "./_lib/security.js";
import { publicBuilding } from "./_lib/summaries.js";
import { asString } from "./_lib/validation.js";
import { writeAuditLog } from "./_lib/audit.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET", "POST"])) return;

  try {
    const user = await requireRole(req, [ROLES.OWNER, ROLES.LABOUR, ROLES.SUPER_ADMIN]);
    if (!user) return sendError(res, 401, "Unauthorized.");
    const context = await getUserContext(user);

    if (req.method === "GET") {
      if (context.role !== ROLES.SUPER_ADMIN) requireDashboardAccess(context);
      const filter =
        context.role === ROLES.SUPER_ADMIN
          ? { status: { $ne: "deleted" } }
          : context.role === ROLES.LABOUR
            ? {
                orgId: user.orgId,
                _id: { $in: user.assignedBuildingIds || [] },
                status: { $ne: "deleted" },
              }
            : { orgId: context.org._id, status: { $ne: "deleted" } };
      const buildings = await context.db
        .collection("buildings")
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();
      return sendJson(res, 200, { success: true, buildings: buildings.map(publicBuilding) });
    }

    if (![ROLES.OWNER, ROLES.SUPER_ADMIN].includes(context.role)) {
      return sendError(res, 403, "Only owners can create buildings.");
    }

    const body = await readJsonBody(req);
    const orgId = context.role === ROLES.SUPER_ADMIN ? asString(body.orgId) : context.org?._id;
    if (!orgId) return sendError(res, 400, "Organization is required.");
    const org =
      context.role === ROLES.SUPER_ADMIN
        ? await context.db.collection("organizations").findOne({ _id: orgId })
        : context.org;
    if (!org) return sendError(res, 404, "Organization not found.");
    const plan =
      context.role === ROLES.SUPER_ADMIN
        ? await context.db.collection("plans").findOne({ slug: org.planId })
        : context.plan;

    await enforceBuildingLimit(context.db, orgId, plan);

    const name = asString(body.name);
    if (!name) return sendError(res, 400, "Building name is required.");

    const now = new Date();
    const building = {
      _id: createId("bld"),
      orgId,
      name,
      address: asString(body.address),
      city: asString(body.city),
      buildingType: asString(body.buildingType || "residential"),
      status: "active",
      cover: asString(body.cover),
      defaultTaskCount: Number(body.defaultTaskCount || 0),
      createdAt: now,
      updatedAt: now,
    };

    await context.db.collection("buildings").insertOne(building);
    await writeAuditLog(context.db, {
      orgId,
      userId: user._id,
      action: "building.created",
      details: { buildingId: building._id, name: building.name },
    });

    sendJson(res, 201, { success: true, building: publicBuilding(building) });
  } catch (error) {
    console.error("[buildings]", error.message);
    sendError(
      res,
      error.status || 500,
      error.status ? error.message : "Could not process buildings request.",
    );
  }
}
