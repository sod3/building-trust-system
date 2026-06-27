import { getUserContext, requireDashboardAccess } from "./_lib/access.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "./_lib/http.js";
import { createId, requireRole, ROLES } from "./_lib/security.js";
import { asString } from "./_lib/validation.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET", "POST"])) return;

  try {
    const user = await requireRole(req, [ROLES.OWNER, ROLES.LABOUR, ROLES.SUPER_ADMIN]);
    if (!user) return sendError(res, 401, "Unauthorized.");
    const context = await getUserContext(user);
    if (context.role !== ROLES.SUPER_ADMIN) requireDashboardAccess(context, { allowBilling: true });

    if (req.method === "GET") {
      const filter = context.role === ROLES.SUPER_ADMIN ? {} : { orgId: user.orgId };
      const tickets = await context.db
        .collection("supportTickets")
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();
      return sendJson(res, 200, { success: true, tickets });
    }

    const body = await readJsonBody(req);
    const subject = asString(body.subject);
    const message = asString(body.message);
    if (!subject || !message) return sendError(res, 400, "Subject and message are required.");

    const now = new Date();
    const ticket = {
      _id: createId("ticket"),
      orgId: context.org?._id || asString(body.orgId) || null,
      userId: user._id,
      subject,
      message,
      priority: asString(
        body.priority || (context.plan?.supportLevel === "dedicated" ? "high" : "normal"),
      ),
      status: "open",
      planSupportLevel: context.plan?.supportLevel || "platform",
      createdAt: now,
      updatedAt: now,
    };

    await context.db.collection("supportTickets").insertOne(ticket);
    sendJson(res, 201, { success: true, ticket });
  } catch (error) {
    console.error("[support]", error.message);
    sendError(
      res,
      error.status || 500,
      error.status ? error.message : "Could not process support request.",
    );
  }
}
