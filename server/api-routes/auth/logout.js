import { requireMethod, sendJson } from "../_lib/http.js";
import { clearAuthCookie } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;
  clearAuthCookie(res);
  sendJson(res, 200, { success: true });
}
