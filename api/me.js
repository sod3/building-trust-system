import { connectToDatabase } from "./_lib/db.js";
import { requireMethod, sendError, sendJson } from "./_lib/http.js";
import { getAuthUser, publicUser } from "./_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;

  try {
    const user = await getAuthUser(req);
    if (!user) return sendError(res, 401, "Unauthorized.");

    const { db } = await connectToDatabase();
    const subscription = await db.collection("subscriptions").findOne({ userId: user._id });

    sendJson(res, 200, { success: true, user: publicUser(user), subscription });
  } catch (error) {
    console.error("[me]", error.message);
    sendError(res, 500, "Could not load profile.");
  }
}
