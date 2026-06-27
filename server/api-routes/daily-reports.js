import { getUserContext, requireDashboardAccess } from "./_lib/access.js";
import { getRequestUrl, readJsonBody, requireMethod, sendError, sendJson } from "./_lib/http.js";
import { createId, requireRole, ROLES } from "./_lib/security.js";
import { publicReport, todayKey } from "./_lib/summaries.js";
import { asString } from "./_lib/validation.js";
import { writeAuditLog } from "./_lib/audit.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET", "POST"])) return;

  try {
    const user = await requireRole(req, [ROLES.OWNER, ROLES.LABOUR, ROLES.SUPER_ADMIN]);
    if (!user) return sendError(res, 401, "Unauthorized.");
    const context = await getUserContext(user);
    if (context.role !== ROLES.SUPER_ADMIN) requireDashboardAccess(context);

    if (req.method === "GET") {
      const url = getRequestUrl(req);
      const onlyToday = url.searchParams.get("today") === "true";
      const buildingId = url.searchParams.get("buildingId");
      const filter = context.role === ROLES.SUPER_ADMIN ? {} : { orgId: user.orgId };
      if (context.role === ROLES.LABOUR) filter.labourUserId = user._id;
      if (onlyToday) filter.date = todayKey();
      if (buildingId) filter.buildingId = buildingId;
      if (!onlyToday && context.role === ROLES.OWNER && context.plan?.reportHistoryDays) {
        const start = new Date();
        start.setDate(start.getDate() - context.plan.reportHistoryDays);
        filter.createdAt = { $gte: start };
      }

      const [reports, buildings, labourUsers] = await Promise.all([
        context.db
          .collection("dailyReports")
          .find(filter)
          .sort({ date: -1, submittedAt: -1 })
          .limit(200)
          .toArray(),
        context.db
          .collection("buildings")
          .find(context.org ? { orgId: context.org._id } : {})
          .toArray(),
        context.db
          .collection("users")
          .find(
            context.org ? { orgId: context.org._id, role: { $in: [ROLES.LABOUR, "labour"] } } : {},
            { projection: { passwordHash: 0 } },
          )
          .toArray(),
      ]);
      const buildingMap = new Map(buildings.map((building) => [building._id, building]));
      const labourMap = new Map(labourUsers.map((labourUser) => [labourUser._id, labourUser]));
      return sendJson(res, 200, {
        success: true,
        reports: reports.map((report) => publicReport(report, buildingMap, labourMap)),
      });
    }

    if (context.role !== ROLES.LABOUR)
      return sendError(res, 403, "Only labour users can submit daily reports.");
    const body = await readJsonBody(req);
    const buildingId = asString(body.buildingId);
    if (!buildingId) return sendError(res, 400, "Building is required.");
    if (!(user.assignedBuildingIds || []).includes(buildingId)) {
      return sendError(res, 403, "You are not assigned to this building.");
    }

    const building = await context.db
      .collection("buildings")
      .findOne({ _id: buildingId, orgId: user.orgId, status: { $ne: "deleted" } });
    if (!building) return sendError(res, 404, "Building not found.");

    const items = []
      .concat(body.items || [])
      .map((item) => ({
        title: asString(item.title),
        status: ["done", "issue", "not_done"].includes(item.status) ? item.status : "not_done",
        note: asString(item.note),
        photoUrl: asString(item.photoUrl) || null,
      }))
      .filter((item) => item.title);
    if (!items.length) return sendError(res, 400, "At least one report item is required.");

    const now = new Date();
    const date = asString(body.date) || todayKey(now);
    const hasIssue = items.some((item) => item.status === "issue");
    const allDone = items.every((item) => item.status === "done");
    const report = {
      _id: createId("rpt"),
      orgId: user.orgId,
      buildingId,
      buildingName: building.name,
      labourUserId: user._id,
      labourName: user.name,
      date,
      items,
      overallStatus: allDone ? "done" : hasIssue ? "issue" : "not_done",
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const { _id, createdAt, ...reportFields } = report;
    await context.db
      .collection("dailyReports")
      .updateOne(
        { orgId: user.orgId, buildingId, labourUserId: user._id, date },
        { $set: reportFields, $setOnInsert: { _id, createdAt } },
        { upsert: true },
      );
    const saved = await context.db
      .collection("dailyReports")
      .findOne({ orgId: user.orgId, buildingId, labourUserId: user._id, date });
    await writeAuditLog(context.db, {
      orgId: user.orgId,
      userId: user._id,
      action: "daily_report.submitted",
      details: { reportId: saved._id, buildingId },
    });
    sendJson(res, 201, { success: true, report: saved });
  } catch (error) {
    console.error("[daily-reports]", error.message);
    sendError(
      res,
      error.status || 500,
      error.status ? error.message : "Could not process daily reports.",
    );
  }
}
