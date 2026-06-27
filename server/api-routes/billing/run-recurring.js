import { processDueSubscriptions } from "../_lib/billing.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST", "GET"])) return;

  try {
    const cronSecret = process.env.CRON_SECRET;
    const provided = req.headers.authorization?.replace(/^Bearer\s+/i, "") || req.query?.secret;
    if (cronSecret && provided !== cronSecret) {
      return sendError(res, 401, "Unauthorized.");
    }

    const result = await processDueSubscriptions();
    sendJson(res, 200, { success: true, ...result });
  } catch (error) {
    console.error("[billing-run-recurring]", error.message);
    sendError(res, 500, "Could not process recurring billing.");
  }
}
