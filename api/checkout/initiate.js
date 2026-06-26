import { connectToDatabase } from "../_lib/db.js";
import { createInvoiceAndOrder } from "../_lib/billing.js";
import { getActivePlan } from "../_lib/plans.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "../_lib/http.js";
import { createId, getAuthUser, hashPassword, ROLES } from "../_lib/security.js";
import { asEmail, asString, assertEmail } from "../_lib/validation.js";
import { writeAuditLog } from "../_lib/audit.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const body = await readJsonBody(req);
    const planId = asString(body.planId || body.plan).toLowerCase();
    const name = asString(body.fullName || body.ownerName || body.name);
    const email = asEmail(body.email);
    const phone = asString(body.phone);
    const companyName = asString(body.companyName || body.company || body.organizationName || body.buildingGroupName);
    const password = String(body.password || "");

    if (!planId) return sendError(res, 400, "Please select a plan.");
    if (!name || !email || !phone || !companyName) {
      return sendError(res, 400, "Full name, email, phone, and company/building group name are required.");
    }
    assertEmail(email);
    if (!password || password.length < 8) {
      return sendError(res, 400, "Password must be at least 8 characters.");
    }

    const { db } = await connectToDatabase();
    const plan = await getActivePlan(db, planId);
    if (!plan) return sendError(res, 404, "Selected plan was not found.");

    const authUser = await getAuthUser(req).catch(() => null);
    const now = new Date();
    let user = authUser?.role === ROLES.OWNER ? authUser : await db.collection("users").findOne({ email });

    if (user?.status === "active" && user.email === email && !authUser) {
      return sendError(res, 409, "An account with this email already exists. Please sign in to manage billing.");
    }

    if (!user) {
      user = {
        _id: createId("user"),
        name,
        email,
        phone,
        passwordHash: hashPassword(password),
        role: ROLES.OWNER,
        orgId: null,
        status: "pending_payment",
        lastLogin: null,
        createdAt: now,
        updatedAt: now,
      };
      await db.collection("users").insertOne(user);
    } else {
      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            name,
            phone,
            passwordHash: hashPassword(password),
            role: ROLES.OWNER,
            status: user.status === "active" ? "active" : "pending_payment",
            updatedAt: now,
          },
        },
      );
    }

    let org = user.orgId ? await db.collection("organizations").findOne({ _id: user.orgId }) : null;
    if (!org) {
      org = {
        _id: createId("org"),
        name: companyName,
        ownerUserId: user._id,
        planId: plan.slug || plan.planId,
        subscriptionStatus: "pending",
        status: "pending_payment",
        createdAt: now,
        updatedAt: now,
      };
      await db.collection("organizations").insertOne(org);
      await db.collection("users").updateOne({ _id: user._id }, { $set: { orgId: org._id, updatedAt: now } });
      user.orgId = org._id;
    } else {
      await db.collection("organizations").updateOne(
        { _id: org._id },
        {
          $set: {
            name: companyName || org.name,
            ownerUserId: user._id,
            planId: plan.slug || plan.planId,
            subscriptionStatus: org.subscriptionStatus === "active" ? org.subscriptionStatus : "pending",
            status: org.status === "active" ? org.status : "pending_payment",
            updatedAt: now,
          },
        },
      );
    }

    const subscriptionId = createId("sub");
    await db.collection("subscriptions").updateOne(
      { orgId: org._id },
      {
        $set: {
          orgId: org._id,
          userId: user._id,
          planId: plan.slug || plan.planId,
          planName: plan.name,
          status: "pending",
          billingMode: "automatic",
          amountSar: plan.priceSar,
          amountHalalas: plan.amountHalalas,
          currency: plan.currency,
          cancelAtPeriodEnd: false,
          retryCount: 0,
          lastPaymentStatus: "pending",
          maxBuildings: plan.maxBuildings,
          maxLabourUsers: plan.maxLabourUsers,
          buildingLimit: plan.maxBuildings,
          labourLimit: plan.maxLabourUsers,
          updatedAt: now,
        },
        $setOnInsert: {
          _id: subscriptionId,
          createdAt: now,
        },
      },
      { upsert: true },
    );
    const subscription = await db.collection("subscriptions").findOne({ orgId: org._id });

    const { invoice, order } = await createInvoiceAndOrder(db, {
      orgId: org._id,
      userId: user._id,
      subscriptionId: subscription?._id || subscriptionId,
      plan,
      billingReason: "initial",
    });

    await writeAuditLog(db, {
      orgId: org._id,
      userId: user._id,
      action: "checkout.initiated",
      details: { planId: plan.slug || plan.planId, orderId: order.orderId, invoiceId: invoice.invoiceId },
    });

    sendJson(res, 201, {
      success: true,
      orderId: order.orderId,
      invoiceId: invoice.invoiceId,
      userId: user._id,
      orgId: org._id,
      planId: plan.slug || plan.planId,
      planName: plan.name,
      amountHalalas: plan.amountHalalas,
      currency: plan.currency,
      description: `${plan.name} Plan - FacilityOS Arabia`,
      billingCycle: plan.billingCycle,
      buildingLimit: plan.maxBuildings,
      labourLimit: plan.maxLabourUsers,
      metadata: {
        orderId: order.orderId,
        order_id: order.orderId,
        invoiceId: invoice.invoiceId,
        invoice_id: invoice.invoiceId,
        userId: user._id,
        user_id: user._id,
        orgId: org._id,
        org_id: org._id,
        planId: plan.slug || plan.planId,
        plan_id: plan.slug || plan.planId,
      },
    });
  } catch (error) {
    console.error("[checkout-initiate]", error.message);
    sendError(res, error.status || 500, error.status ? error.message : "Could not initiate checkout.");
  }
}
