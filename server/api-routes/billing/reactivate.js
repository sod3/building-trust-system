import { createInvoiceAndOrder } from "../_lib/billing.js";
import { getUserContext, requireDashboardAccess } from "../_lib/access.js";
import { getActivePlan } from "../_lib/plans.js";
import { requireMethod, sendError, sendJson } from "../_lib/http.js";
import { requireRole, ROLES } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const user = await requireRole(req, ROLES.OWNER);
    if (!user) return sendError(res, 401, "Owner access required.");
    const context = await getUserContext(user);
    requireDashboardAccess(context, { allowBilling: true });

    const now = new Date();
    if (context.subscription?.status === "active" || context.subscription?.cancelAtPeriodEnd) {
      await context.db
        .collection("subscriptions")
        .updateOne(
          { orgId: context.org._id },
          { $set: { cancelAtPeriodEnd: false, updatedAt: now } },
        );
      return sendJson(res, 200, { success: true, message: "Subscription reactivated." });
    }

    const plan = await getActivePlan(
      context.db,
      context.subscription?.planId || context.org.planId,
    );
    if (!plan) return sendError(res, 400, "Current plan is not active.");
    const { invoice, order } = await createInvoiceAndOrder(context.db, {
      orgId: context.org._id,
      userId: user._id,
      subscriptionId: context.subscription._id,
      plan,
      billingReason: "renewal",
    });

    sendJson(res, 201, {
      success: true,
      message: "Complete payment to reactivate dashboard access.",
      orderId: order.orderId,
      invoiceId: invoice.invoiceId,
      orgId: context.org._id,
      userId: user._id,
      planId: plan.slug || plan.planId,
      planName: plan.name,
      amountHalalas: plan.amountHalalas,
      currency: plan.currency,
      description: `${plan.name} renewal - FacilityOS Arabia`,
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
    console.error("[billing-reactivate]", error.message);
    sendError(
      res,
      error.status || 500,
      error.status ? error.message : "Could not reactivate subscription.",
    );
  }
}
