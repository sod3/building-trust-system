import { connectToDatabase } from "../_lib/db.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "../_lib/http.js";
import { createId, hashPassword, publicUser, signJwt } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const body = await readJsonBody(req);
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const password = String(body.password || "");

    if (!name || !email || !password) {
      return sendError(res, 400, "Name, email, and password are required.");
    }

    const { db } = await connectToDatabase();
    const now = new Date();
    const user = {
      _id: createId("user"),
      name,
      email,
      phone,
      passwordHash: hashPassword(password),
      role: "owner",
      status: "pending_payment",
      createdAt: now,
      updatedAt: now,
    };

    await db.collection("users").insertOne(user);
    const token = signJwt({ sub: user._id, role: user.role });

    sendJson(res, 201, { success: true, token, user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) return sendError(res, 409, "An account with this email already exists.");
    console.error("[register-owner]", error.message);
    sendError(res, 500, "Could not register owner.");
  }
}
