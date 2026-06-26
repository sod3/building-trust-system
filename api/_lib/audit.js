import { createId } from "./security.js";

export async function writeAuditLog(db, { orgId = null, userId = null, action, details = {} }) {
  await db.collection("auditLogs").insertOne({
    _id: createId("audit"),
    orgId,
    userId,
    action,
    details,
    createdAt: new Date(),
  });
}
