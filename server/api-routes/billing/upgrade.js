import { createInvoiceAndOrder } from "../_lib/billing.js";
import { getUserContext, requireDashboardAccess } from "../_lib/access.js";
import { getActivePlan } from "../_lib/plans.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireRole, ROLES } from "../_lib/security.js";
import { asString } from "../_lib/validation.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const user = await requireRole(req, ROLES.OWNER);
    if (!user) return sendError(res, 401, "Owner access required.");
    const context = await getUserContext(user);
    requireDashboardAccess(context, { allowBilling: true });

    const body = await readJsonBody(req);
    const targetPlanId = asString(body.planId || body.targetPlanId).toLowerCase();
    const plan = await getActivePlan(context.db, targetPlanId);
    if (!plan) return sendError(res, 404, "Target plan was not found.");
    if (plan.amountHalalas <= (context.subscription?.amountHalalas || 0)) {
      return sendError(res, 400, "Please use the downgrade endpoint for lower-priced plans.");
    }

    const { invoice, order } = await createInvoiceAndOrder(context.db, {
      orgId: context.org._id,
      userId: user._id,
      subscriptionId: context.subscription._id,
      plan,
      billingReason: "upgrade",
    });

    sendJson(res, 201, {
      success: true,
      message: `Complete payment to upgrade to ${plan.name}.`,
      orderId: order.orderId,
      invoiceId: invoice.invoiceId,
      orgId: context.org._id,
      userId: user._id,
      planId: plan.slug || plan.planId,
      planName: plan.name,
      amountHalalas: plan.amountHalalas,
      currency: plan.currency,
      description: `${plan.name} upgrade - FacilityOS Arabia`,
      metadata: {
        orderId: order.orderId,
        order_id: order.orderId,
        invoiceId: invoice.invoiceId,
        invoice_id: invoice.invoiceId,
        userId: user._id,
        user_id: user._id,
        orgId: context.org._id,
        org_id: context.org._id,
        planId: plan.slug || plan.planId,
        plan_id: plan.slug || plan.planId,
      },
    });
  } catch (error) {
    console.error("[billing-upgrade]", error.message);
    sendError(res, error.status || 500, error.status ? error.message : "Could not start upgrade.");
  }
}
