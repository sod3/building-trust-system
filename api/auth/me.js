import { connectToDatabase } from "../_lib/db.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { getAuthUser, publicUser } from "../_lib/security.js";
import { getUserContext, serializeContext } from "../_lib/access.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const user = await getAuthUser(req);
    if (!user) return sendError(res, 401, "Unauthorized.");

    const { db } = await connectToDatabase();
    const context = await getUserContext(user);
    const subscription = user.orgId
      ? await db.collection("subscriptions").findOne({ orgId: user.orgId })
      : await db.collection("subscriptions").findOne({ userId: user._id });

    sendJson(res, 200, {
      success: true,
      user: publicUser(user),
      subscription,
      ...(context ? serializeContext(context) : {}),
    });
  } catch (error) {
    console.error("[auth-me]", error.message);
    sendError(res, 500, "Could not load profile.");
  }
}
