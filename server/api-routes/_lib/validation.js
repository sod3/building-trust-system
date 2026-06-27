export function asString(value, fallback = "") {
  return String(value ?? fallback).trim();
}

export function asEmail(value) {
  return asString(value).toLowerCase();
}

export function requireFields(body, fields) {
  const missing = fields.filter((field) => !asString(body[field]));
  if (missing.length) {
    const error = new Error(
      `${missing.join(", ")} ${missing.length === 1 ? "is" : "are"} required.`,
    );
    error.status = 400;
    throw error;
  }
}

export function assertEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const error = new Error("A valid email address is required.");
    error.status = 400;
    throw error;
  }
}
