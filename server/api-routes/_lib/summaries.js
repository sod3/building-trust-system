import { isUnlimited, publicPlan } from "./plans.js";
import { ROLES } from "./security.js";

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function publicBuilding(building) {
  if (!building) return null;
  return {
    id: building._id,
    ...building,
  };
}

export function publicLabour(user, buildingMap = new Map(), latestReportMap = new Map()) {
  const assignedBuildingIds = user.assignedBuildingIds || [];
  const firstBuilding = buildingMap.get(assignedBuildingIds[0]);
  const latestReport = latestReportMap.get(user._id);
  const totalTasks = latestReport?.items?.length || 0;
  const completedTasks = latestReport?.items?.filter((item) => item.status === "done").length || 0;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: "labour",
    status: user.status,
    orgId: user.orgId,
    assignedBuildingIds,
    buildingId: assignedBuildingIds[0] || "",
    buildingName: firstBuilding?.name || "Unassigned",
    todayStatus: latestReport ? "Submitted" : "Not Started",
    completedTasksToday: completedTasks,
    totalTasksToday: totalTasks || 0,
    lastSubmission: latestReport?.submittedAt || "Never",
    performanceWeek: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function publicReport(report, buildingMap = new Map(), labourMap = new Map()) {
  const items = report.items || [];
  const completedTasks = items.filter((item) => item.status === "done").length;
  const pendingTasks = items.filter((item) => item.status !== "done").length;
  const building = buildingMap.get(report.buildingId);
  const labour = labourMap.get(report.labourUserId);

  return {
    id: report._id,
    ...report,
    buildingName: report.buildingName || building?.name || "Building",
    labourName: report.labourName || labour?.name || "Labour",
    completedTasks,
    totalTasks: items.length,
    pendingTasks,
    status:
      report.overallStatus === "done"
        ? "Submitted"
        : report.overallStatus === "issue"
          ? "Pending"
          : "Missed",
    submittedAt: report.submittedAt || report.createdAt,
  };
}

export async function buildOwnerDashboard(db, context) {
  const orgId = context.org._id;
  const date = todayKey();

  const [buildings, labourUsers, templates, reports, invoices, payments] = await Promise.all([
    db
      .collection("buildings")
      .find({ orgId, status: { $ne: "deleted" } })
      .sort({ createdAt: -1 })
      .toArray(),
    db
      .collection("users")
      .find(
        { orgId, role: { $in: [ROLES.LABOUR, "labour"] }, status: { $ne: "deleted" } },
        { projection: { passwordHash: 0 } },
      )
      .toArray(),
    db.collection("checklistTemplates").find({ orgId }).sort({ createdAt: -1 }).toArray(),
    db
      .collection("dailyReports")
      .find({ orgId })
      .sort({ submittedAt: -1, createdAt: -1 })
      .limit(200)
      .toArray(),
    db.collection("invoices").find({ orgId }).sort({ createdAt: -1 }).limit(20).toArray(),
    db.collection("payments").find({ orgId }).sort({ createdAt: -1 }).limit(20).toArray(),
  ]);

  const buildingMap = new Map(buildings.map((building) => [building._id, building]));
  const labourMap = new Map(labourUsers.map((user) => [user._id, user]));
  const todayReports = reports.filter((report) => report.date === date);
  const latestReportByBuilding = new Map();
  const latestReportByLabour = new Map();
  for (const report of reports) {
    if (!latestReportByBuilding.has(report.buildingId))
      latestReportByBuilding.set(report.buildingId, report);
    if (!latestReportByLabour.has(report.labourUserId))
      latestReportByLabour.set(report.labourUserId, report);
  }

  const buildingRows = buildings.map((building) => {
    const latest = latestReportByBuilding.get(building._id);
    const items = latest?.items || [];
    const done = items.filter((item) => item.status === "done").length;
    const total = items.length || building.defaultTaskCount || 0;
    const completionToday = total ? Math.round((done / total) * 100) : 0;
    return {
      ...publicBuilding(building),
      ownerName: context.user.name,
      assignedLabourIds: labourUsers
        .filter((user) => (user.assignedBuildingIds || []).includes(building._id))
        .map((user) => user._id),
      completionToday,
      totalTasksToday: total,
      doneTasksToday: done,
      lastReportTime: latest?.submittedAt || "No report yet",
      status:
        completionToday >= 80 ? "Healthy" : completionToday > 0 ? "Pending" : "Attention Needed",
      cover:
        building.cover || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=70",
    };
  });

  const reportRows = reports.map((report) => publicReport(report, buildingMap, labourMap));
  const todayRows = reportRows.filter((report) => report.date === date);
  const tasksTotalToday = todayRows.reduce((sum, report) => sum + report.totalTasks, 0);
  const tasksCompletedToday = todayRows.reduce((sum, report) => sum + report.completedTasks, 0);
  const pendingTasks = Math.max(tasksTotalToday - tasksCompletedToday, 0);
  const completionRate = tasksTotalToday
    ? Math.round((tasksCompletedToday / tasksTotalToday) * 100)
    : 0;

  const plan = publicPlan(context.plan);
  return {
    organization: context.org,
    subscription: context.subscription,
    plan,
    usage: {
      buildingsUsed: buildings.length,
      buildingLimit: plan?.maxBuildings,
      labourUsersUsed: labourUsers.length,
      labourLimit: plan?.maxLabourUsers,
      checklistTemplatesUsed: templates.length,
      reportHistory: plan?.reportHistory,
      reportHistoryDays: plan?.reportHistoryDays,
      supportLevel: plan?.supportLevel,
      unlimitedBuildings: isUnlimited(plan?.maxBuildings),
      unlimitedLabour: isUnlimited(plan?.maxLabourUsers),
    },
    kpis: {
      buildings: buildings.length,
      activeLabour: labourUsers.length,
      tasksCompletedToday,
      tasksTotalToday,
      pendingTasks,
      completionRate,
      lastReport: todayRows.find((report) => report.submittedAt)?.submittedAt || "No reports yet",
    },
    buildings: buildingRows,
    labour: labourUsers.map((user) => publicLabour(user, buildingMap, latestReportByLabour)),
    reports: reportRows,
    todayReports: todayRows,
    templates,
    invoices,
    payments,
  };
}
