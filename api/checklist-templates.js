import { getUserContext, requireDashboardAccess, requireFeature } from "./_lib/access.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "./_lib/http.js";
import { createId, requireRole, ROLES } from "./_lib/security.js";
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
      const filter = context.role === ROLES.SUPER_ADMIN ? {} : { orgId: user.orgId };
      const templates = await context.db.collection("checklistTemplates").find(filter).sort({ createdAt: -1 }).toArray();
      return sendJson(res, 200, { success: true, templates });
    }

    if (![ROLES.OWNER, ROLES.SUPER_ADMIN].includes(context.role)) {
      return sendError(res, 403, "Only owners can create checklist templates.");
    }
    if (context.role !== ROLES.SUPER_ADMIN) requireFeature(context.plan, "checklistTemplates");

    const body = await readJsonBody(req);
    const name = asString(body.name);
    if (!name) return sendError(res, 400, "Template name is required.");
    const items = [].concat(body.items || []).map((item, index) => ({
      title: asString(item.title),
      icon: asString(item.icon || "CheckCircle2"),
      required: item.required !== false,
      order: Number(item.order ?? index),
    })).filter((item) => item.title);
    if (!items.length) return sendError(res, 400, "At least one checklist item is required.");

    const now = new Date();
    const template = {
      _id: createId("tpl"),
      orgId: context.role === ROLES.SUPER_ADMIN ? asString(body.orgId) : context.org._id,
      buildingId: asString(body.buildingId) || null,
      name,
      items,
      createdBy: user._id,
      createdAt: now,
      updatedAt: now,
    };
    await context.db.collection("checklistTemplates").insertOne(template);
    await writeAuditLog(context.db, { orgId: template.orgId, userId: user._id, action: "checklist_template.created", details: { templateId: template._id } });
    sendJson(res, 201, { success: true, template });
  } catch (error) {
    console.error("[checklist-templates]", error.message);
    sendError(res, error.status || 500, error.status ? error.message : "Could not process checklist templates.");
  }
}
