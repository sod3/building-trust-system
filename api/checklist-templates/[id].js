import { getUserContext, requireDashboardAccess, requireFeature } from "../_lib/access.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireRole, ROLES } from "../_lib/security.js";
import { asString } from "../_lib/validation.js";
import { writeAuditLog } from "../_lib/audit.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["PATCH", "DELETE"])) return;

  try {
    const user = await requireRole(req, [ROLES.OWNER, ROLES.SUPER_ADMIN]);
    if (!user) return sendError(res, 401, "Owner access required.");
    const context = await getUserContext(user);
    if (context.role !== ROLES.SUPER_ADMIN) {
      requireDashboardAccess(context);
      requireFeature(context.plan, "checklistTemplates");
    }

    const id = req.query?.id || req.url.split("/").pop();
    const filter = context.role === ROLES.SUPER_ADMIN ? { _id: id } : { _id: id, orgId: context.org._id };
    const template = await context.db.collection("checklistTemplates").findOne(filter);
    if (!template) return sendError(res, 404, "Checklist template not found.");

    if (req.method === "DELETE") {
      await context.db.collection("checklistTemplates").deleteOne({ _id: template._id });
      await writeAuditLog(context.db, { orgId: template.orgId, userId: user._id, action: "checklist_template.deleted", details: { templateId: template._id } });
      return sendJson(res, 200, { success: true });
    }

    const body = await readJsonBody(req);
    const update = {
      name: asString(body.name || template.name),
      buildingId: body.buildingId === undefined ? template.buildingId : asString(body.buildingId) || null,
      updatedAt: new Date(),
    };
    if (body.items) {
      update.items = [].concat(body.items).map((item, index) => ({
        title: asString(item.title),
        icon: asString(item.icon || "CheckCircle2"),
        required: item.required !== false,
        order: Number(item.order ?? index),
      })).filter((item) => item.title);
    }

    await context.db.collection("checklistTemplates").updateOne({ _id: template._id }, { $set: update });
    const updated = await context.db.collection("checklistTemplates").findOne({ _id: template._id });
    await writeAuditLog(context.db, { orgId: template.orgId, userId: user._id, action: "checklist_template.updated", details: { templateId: template._id } });
    sendJson(res, 200, { success: true, template: updated });
  } catch (error) {
    console.error("[checklist-template-id]", error.message);
    sendError(res, error.status || 500, error.status ? error.message : "Could not process checklist template.");
  }
}
