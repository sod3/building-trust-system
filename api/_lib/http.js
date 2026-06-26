export function sendJson(res, status, payload) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export function sendError(res, status, message, details) {
  sendJson(res, status, { success: false, message, ...(details ? { details } : {}) });
}

export function requireMethod(req, res, methods) {
  if (methods.includes(req.method)) return true;
  res.setHeader("Allow", methods.join(", "));
  sendError(res, 405, "Method not allowed.");
  return false;
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON request body.");
  }
}

export function getQueryParam(req, key) {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url, `http://${host}`);
  return url.searchParams.get(key);
}
