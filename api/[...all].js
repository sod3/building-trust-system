import express from "express";

import adminCustomersHandler from "../server/api-routes/admin/customers.js";
import adminEarningsHandler from "../server/api-routes/admin/earnings.js";
import adminInvoicesHandler from "../server/api-routes/admin/invoices.js";
import adminOrganizationsHandler from "../server/api-routes/admin/organizations.js";
import adminOrganizationStatusHandler from "../server/api-routes/admin/organizations/[id]/status.js";
import adminOverviewHandler from "../server/api-routes/admin/overview.js";
import adminOwnersHandler from "../server/api-routes/admin/owners.js";
import adminPaymentsHandler from "../server/api-routes/admin/payments.js";
import adminSubscriptionHandler from "../server/api-routes/admin/subscriptions/[id].js";
import adminSubscriptionsHandler from "../server/api-routes/admin/subscriptions.js";
import authLoginHandler from "../server/api-routes/auth/login.js";
import authLogoutHandler from "../server/api-routes/auth/logout.js";
import authMeHandler from "../server/api-routes/auth/me.js";
import authRegisterOwnerHandler from "../server/api-routes/auth/register-owner.js";
import authRegisterHandler from "../server/api-routes/auth/register.js";
import billingCancelHandler from "../server/api-routes/billing/cancel.js";
import billingDowngradeHandler from "../server/api-routes/billing/downgrade.js";
import billingInvoicesHandler from "../server/api-routes/billing/invoices.js";
import billingReactivateHandler from "../server/api-routes/billing/reactivate.js";
import billingRunRecurringHandler from "../server/api-routes/billing/run-recurring.js";
import billingSubscriptionHandler from "../server/api-routes/billing/subscription.js";
import billingUpdatePaymentMethodHandler from "../server/api-routes/billing/update-payment-method.js";
import billingUpgradeHandler from "../server/api-routes/billing/upgrade.js";
import buildingHandler from "../server/api-routes/buildings/[id].js";
import buildingsHandler from "../server/api-routes/buildings.js";
import checkoutCreateOrderHandler from "../server/api-routes/checkout/create-order.js";
import checkoutInitiateHandler from "../server/api-routes/checkout/initiate.js";
import checklistTemplateHandler from "../server/api-routes/checklist-templates/[id].js";
import checklistTemplatesHandler from "../server/api-routes/checklist-templates.js";
import dailyReportsHandler from "../server/api-routes/daily-reports.js";
import dailyReportsHistoryHandler from "../server/api-routes/daily-reports/history.js";
import dailyReportsTodayHandler from "../server/api-routes/daily-reports/today.js";
import labourHandler from "../server/api-routes/labour/[id].js";
import labourListHandler from "../server/api-routes/labour.js";
import meHandler from "../server/api-routes/me.js";
import moyasarWebhookHandler from "../server/api-routes/moyasar-webhook.js";
import ownerOverviewHandler from "../server/api-routes/owner/overview.js";
import ownerPermissionsHandler from "../server/api-routes/owner/permissions.js";
import ownerSubscriptionHandler from "../server/api-routes/owner/subscription.js";
import ownerUsageHandler from "../server/api-routes/owner/usage.js";
import paymentVerifyHandler from "../server/api-routes/payments/verify.js";
import plansHandler from "../server/api-routes/plans.js";
import planHandler from "../server/api-routes/plans/[slug].js";
import supportHandler from "../server/api-routes/support.js";
import verifyPaymentHandler from "../server/api-routes/verify-payment.js";
import webhookMoyasarHandler from "../server/api-routes/webhooks/moyasar.js";

const app = express();

app.use((req, _res, next) => {
  if (!req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? req.url : `/${req.url}`}`;
  }
  next();
});

app.use(express.json({ limit: "2mb", type: ["application/json", "application/*+json"] }));
app.use(express.urlencoded({ extended: false }));

function run(handler) {
  return async (req, res, next) => {
    req.query = { ...(req.query || {}), ...(req.params || {}) };

    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

const routes = [
  ["/api/admin/customers", adminCustomersHandler],
  ["/api/admin/earnings", adminEarningsHandler],
  ["/api/admin/invoices", adminInvoicesHandler],
  ["/api/admin/organizations/:id/status", adminOrganizationStatusHandler],
  ["/api/admin/organizations", adminOrganizationsHandler],
  ["/api/admin/overview", adminOverviewHandler],
  ["/api/admin/owners", adminOwnersHandler],
  ["/api/admin/payments", adminPaymentsHandler],
  ["/api/admin/subscriptions/:id", adminSubscriptionHandler],
  ["/api/admin/subscriptions", adminSubscriptionsHandler],
  ["/api/auth/login", authLoginHandler],
  ["/api/auth/logout", authLogoutHandler],
  ["/api/auth/me", authMeHandler],
  ["/api/auth/register-owner", authRegisterOwnerHandler],
  ["/api/auth/register", authRegisterHandler],
  ["/api/billing/cancel", billingCancelHandler],
  ["/api/billing/downgrade", billingDowngradeHandler],
  ["/api/billing/invoices", billingInvoicesHandler],
  ["/api/billing/reactivate", billingReactivateHandler],
  ["/api/billing/run-recurring", billingRunRecurringHandler],
  ["/api/billing/subscription", billingSubscriptionHandler],
  ["/api/billing/update-payment-method", billingUpdatePaymentMethodHandler],
  ["/api/billing/upgrade", billingUpgradeHandler],
  ["/api/buildings/:id", buildingHandler],
  ["/api/buildings", buildingsHandler],
  ["/api/checkout/create-order", checkoutCreateOrderHandler],
  ["/api/checkout/initiate", checkoutInitiateHandler],
  ["/api/checklist-templates/:id", checklistTemplateHandler],
  ["/api/checklist-templates", checklistTemplatesHandler],
  ["/api/daily-reports/history", dailyReportsHistoryHandler],
  ["/api/daily-reports/today", dailyReportsTodayHandler],
  ["/api/daily-reports", dailyReportsHandler],
  ["/api/labour/:id", labourHandler],
  ["/api/labour", labourListHandler],
  ["/api/me", meHandler],
  ["/api/moyasar-webhook", moyasarWebhookHandler],
  ["/api/owner/overview", ownerOverviewHandler],
  ["/api/owner/permissions", ownerPermissionsHandler],
  ["/api/owner/subscription", ownerSubscriptionHandler],
  ["/api/owner/usage", ownerUsageHandler],
  ["/api/payments/verify", paymentVerifyHandler],
  ["/api/plans/:slug", planHandler],
  ["/api/plans", plansHandler],
  ["/api/support", supportHandler],
  ["/api/verify-payment", verifyPaymentHandler],
  ["/api/webhooks/moyasar", webhookMoyasarHandler],
];

for (const [path, handler] of routes) {
  app.all(path, run(handler));
}

app.use((err, _req, res, _next) => {
  console.error("[api-catch-all]", err);
  if (res.headersSent) return;
  const status = err?.type === "entity.parse.failed" ? 400 : 500;
  res.status(status).json({
    success: false,
    message: status === 400 ? "Invalid JSON request body." : "Internal server error.",
  });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "API route not found." });
});

export default app;
