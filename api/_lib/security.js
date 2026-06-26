import crypto from "node:crypto";
import { connectToDatabase } from "./db.js";

const DEFAULT_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
export const AUTH_COOKIE_NAME = "facilityos_token";

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  OWNER: "OWNER",
  LABOUR: "LABOUR",
  SUPERVISOR: "SUPERVISOR",
};

const roleAliases = {
  admin: ROLES.SUPER_ADMIN,
  super_admin: ROLES.SUPER_ADMIN,
  SUPER_ADMIN: ROLES.SUPER_ADMIN,
  owner: ROLES.OWNER,
  OWNER: ROLES.OWNER,
  labour: ROLES.LABOUR,
  labor: ROLES.LABOUR,
  LABOUR: ROLES.LABOUR,
  supervisor: ROLES.SUPERVISOR,
  SUPERVISOR: ROLES.SUPERVISOR,
};

const publicRoleAliases = {
  [ROLES.SUPER_ADMIN]: "admin",
  [ROLES.OWNER]: "owner",
  [ROLES.LABOUR]: "labour",
  [ROLES.SUPERVISOR]: "supervisor",
};

export function createId(prefix) {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "")}`;
}

function getTokenTtlSeconds() {
  const raw = process.env.JWT_EXPIRES_IN || "";
  const match = raw.match(/^(\d+)\s*([smhd])?$/i);
  if (!match) return DEFAULT_TOKEN_TTL_SECONDS;
  const value = Number(match[1]);
  const unit = (match[2] || "s").toLowerCase();
  if (unit === "m") return value * 60;
  if (unit === "h") return value * 60 * 60;
  if (unit === "d") return value * 60 * 60 * 24;
  return value;
}

export function normalizeRole(role) {
  return roleAliases[String(role || "")] || String(role || "").toUpperCase();
}

export function toPublicRole(role) {
  return publicRoleAliases[normalizeRole(role)] || String(role || "").toLowerCase();
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

  if (actual.length !== expected.length) return false;
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
  const ttlSeconds = getTokenTtlSeconds();
  const header = { alg: "HS256", typ: "JWT" };
  const body = { ...payload, role: normalizeRole(payload.role), iat: now, exp: now + ttlSeconds };
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

  if (signature.length !== expected.length) return null;
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

export function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const index = entry.indexOf("=");
        if (index === -1) return [entry, ""];
        return [decodeURIComponent(entry.slice(0, index)), decodeURIComponent(entry.slice(index + 1))];
      }),
  );
}

export function getAuthToken(req) {
  return getBearerToken(req) || parseCookies(req)[AUTH_COOKIE_NAME] || null;
}

export function setAuthCookie(res, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const maxAge = getTokenTtlSeconds();
  res.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`,
  );
}

export function clearAuthCookie(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`,
  );
}

export async function getAuthUser(req) {
  const token = getAuthToken(req);
  const payload = verifyJwt(token);
  if (!payload?.sub) return null;

  const { db } = await connectToDatabase();
  const user = await db.collection("users").findOne(
    { _id: payload.sub },
    { projection: { passwordHash: 0 } },
  );

  return user ? { ...user, role: normalizeRole(user.role) } : null;
}

export async function requireAdmin(req) {
  const user = await getAuthUser(req);
  if (!user || normalizeRole(user.role) !== ROLES.SUPER_ADMIN) return null;
  return user;
}

export async function requireRole(req, roles) {
  const allowed = new Set([].concat(roles).map(normalizeRole));
  const user = await getAuthUser(req);
  if (!user || !allowed.has(normalizeRole(user.role))) return null;
  return user;
}

export async function ensureSeedAdmin(db) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existingAdmin = await db.collection("users").findOne({
    role: { $in: ["admin", ROLES.SUPER_ADMIN] },
  });
  if (existingAdmin) return;

  const now = new Date();
  await db.collection("users").insertOne({
    _id: createId("user"),
    name: process.env.ADMIN_NAME || "Platform Admin",
    email: email.toLowerCase(),
    phone: "",
    passwordHash: hashPassword(password),
    role: ROLES.SUPER_ADMIN,
    status: "active",
    createdAt: now,
    updatedAt: now,
  });
}

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return {
    ...safeUser,
    id: safeUser._id,
    role: toPublicRole(safeUser.role),
    systemRole: normalizeRole(safeUser.role),
  };
}
