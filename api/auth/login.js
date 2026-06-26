import { connectToDatabase } from "../_lib/db.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "../_lib/http.js";
import { ensureSeedAdmin, publicUser, signJwt, setAuthCookie, verifyPassword } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const body = await readJsonBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return sendError(res, 400, "Email and password are required.");
    }

    const { db } = await connectToDatabase();
    await ensureSeedAdmin(db);

    const user = await db.collection("users").findOne({ email });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return sendError(res, 401, "Invalid email or password.");
    }

    if (user.status === "suspended") {
      return sendError(res, 403, "This account is suspended.");
    }

    const now = new Date();
    await db.collection("users").updateOne({ _id: user._id }, { $set: { lastLogin: now, updatedAt: now } });

    const token = signJwt({ sub: user._id, role: user.role, orgId: user.orgId || null });
    setAuthCookie(res, token);
    sendJson(res, 200, { success: true, token, user: publicUser(user) });
  } catch (error) {
    console.error("[login]", error.message);
    sendError(res, 500, "Could not sign in.");
  }
}
