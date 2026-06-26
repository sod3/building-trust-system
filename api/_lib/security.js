import crypto from "node:crypto";
import { connectToDatabase } from "./db.js";

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

export function createId(prefix) {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "")}`;
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256").toString("hex");
  return `pbkdf2_sha256$100000$${salt}$${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.startsWith("pbkdf2_sha256$")) return false;

  const [, iterationsRaw, salt, expected] = storedHash.split("$");
  const actual = crypto
    .pbkdf2Sync(password, salt, Number(iterationsRaw), 32, "sha256")
    .toString("hex");

  return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeBase64Url(input) {
  const padded = input + "=".repeat((4 - (input.length % 4)) % 4);
  return Buffer.from(padded.replaceAll("-", "+").replaceAll("_", "/"), "base64").toString("utf8");
}

export function signJwt(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured.");

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const body = { ...payload, iat: now, exp: now + TOKEN_TTL_SECONDS };
  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(body))}`;
  const signature = crypto.createHmac("sha256", secret).update(unsigned).digest("base64url");

  return `${unsigned}.${signature}`;
}

export function verifyJwt(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  const expected = crypto.createHmac("sha256", secret).update(unsigned).digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  const payload = JSON.parse(decodeBase64Url(encodedPayload));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}

export function getBearerToken(req) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
}

export async function getAuthUser(req) {
  const token = getBearerToken(req);
  const payload = verifyJwt(token);
  if (!payload?.sub) return null;

  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne(
    { _id: payload.sub },
    { projection: { passwordHash: 0 } },
  );

  return user || null;
}

export async function requireAdmin(req) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function ensureSeedAdmin(db) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existingAdmin = await db.collection("users").findOne({ role: "admin" });
  if (existingAdmin) return;

  const now = new Date();
  await db.collection("users").insertOne({
    _id: createId("user"),
    name: process.env.ADMIN_NAME || "Platform Admin",
    email: email.toLowerCase(),
    phone: "",
    passwordHash: hashPassword(password),
    role: "admin",
    status: "active",
    createdAt: now,
    updatedAt: now,
  });
}

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return { ...safeUser, id: safeUser._id };
}
