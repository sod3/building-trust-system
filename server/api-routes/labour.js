import { enforceLabourLimit, getUserContext, requireDashboardAccess } from "./_lib/access.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "./_lib/http.js";
import { asEmail, asString, assertEmail } from "./_lib/validation.js";
import { createId, hashPassword, requireRole, ROLES } from "./_lib/security.js";
import { publicLabour } from "./_lib/summaries.js";
import { writeAuditLog } from "./_lib/audit.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET", "POST"])) return;

  try {
    const user = await requireRole(req, [ROLES.OWNER, ROLES.LABOUR, ROLES.SUPER_ADMIN]);
    if (!user) return sendError(res, 401, "Unauthorized.");
    const context = await getUserContext(user);
    if (context.role !== ROLES.SUPER_ADMIN) requireDashboardAccess(context);

    if (req.method === "GET") {
      const filter =
        context.role === ROLES.SUPER_ADMIN
          ? { role: { $in: [ROLES.LABOUR, "labour"] }, status: { $ne: "deleted" } }
          : context.role === ROLES.LABOUR
            ? { _id: user._id }
            : {
                orgId: context.org._id,
                role: { $in: [ROLES.LABOUR, "labour"] },
                status: { $ne: "deleted" },
              };
      const [labourUsers, buildings, reports] = await Promise.all([
        context.db
          .collection("users")
          .find(filter, { projection: { passwordHash: 0 } })
          .sort({ createdAt: -1 })
          .toArray(),
        context.db
          .collection("buildings")
          .find(context.org ? { orgId: context.org._id } : {})
          .toArray(),
        context.db
          .collection("dailyReports")
          .find(context.org ? { orgId: context.org._id } : {})
          .sort({ submittedAt: -1 })
          .limit(200)
          .toArray(),
      ]);
      const buildingMap = new Map(buildings.map((building) => [building._id, building]));
      const latestReportMap = new Map();
      for (const report of reports) {
        if (!latestReportMap.has(report.labourUserId))
          latestReportMap.set(report.labourUserId, report);
      }
      return sendJson(res, 200, {
        success: true,
        labour: labourUsers.map((labourUser) =>
          publicLabour(labourUser, buildingMap, latestReportMap),
        ),
      });
    }

    if (![ROLES.OWNER, ROLES.SUPER_ADMIN].includes(context.role)) {
      return sendError(res, 403, "Only owners can create labour accounts.");
    }

    const body = await readJsonBody(req);
    const orgId = context.role === ROLES.SUPER_ADMIN ? asString(body.orgId) : context.org._id;
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

    await enforceLabourLimit(context.db, orgId, plan);

    const name = asString(body.name);
    const email = asEmail(body.email);
    const phone = asString(body.phone);
    assertEmail(email);
    if (!name || !phone) return sendError(res, 400, "Name, email, and phone are required.");

    const assignedBuildingIds = []
      .concat(body.assignedBuildingIds || body.buildingId || [])
      .filter(Boolean)
      .map(String);
    const validBuildingCount = assignedBuildingIds.length
      ? await context.db
          .collection("buildings")
          .countDocuments({ orgId, _id: { $in: assignedBuildingIds }, status: { $ne: "deleted" } })
      : 0;
    if (assignedBuildingIds.length && validBuildingCount !== assignedBuildingIds.length) {
      return sendError(
        res,
        400,
        "One or more assigned buildings are invalid for this organization.",
      );
    }

    const temporaryPassword = asString(body.password) || createId("temp").slice(0, 14);
    const now = new Date();
    const labourUser = {
      _id: createId("user"),
      name,
      email,
      phone,
      passwordHash: hashPassword(temporaryPassword),
      role: ROLES.LABOUR,
      orgId,
      assignedBuildingIds,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    await context.db.collection("users").insertOne(labourUser);
    await writeAuditLog(context.db, {
      orgId,
      userId: user._id,
      action: "labour.created",
      details: { labourUserId: labourUser._id },
    });

    const { passwordHash: _hidden, ...safeLabourUser } = labourUser;
    sendJson(res, 201, {
      success: true,
      labour: { id: labourUser._id, ...safeLabourUser },
      temporaryPassword: body.password ? undefined : temporaryPassword,
    });
  } catch (error) {
    if (error?.code === 11000) return sendError(res, 409, "A user with this email already exists.");
    console.error("[labour]", error.message);
    sendError(
      res,
      error.status || 500,
      error.status ? error.message : "Could not process labour request.",
    );
  }
}
