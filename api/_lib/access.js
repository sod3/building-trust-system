import { connectToDatabase } from "./db.js";
import { getActivePlan, isUnlimited, publicPlan } from "./plans.js";
import { normalizeRole, ROLES } from "./security.js";

export function isActiveOrGrace(subscription) {
  if (!subscription) return false;
  const now = new Date();
  if (subscription.status === "active") return true;
  if (subscription.status === "past_due" && subscription.gracePeriodEndsAt) {
    return new Date(subscription.gracePeriodEndsAt) > now;
  }
  if (subscription.status === "cancelled" && subscription.cancelAtPeriodEnd && subscription.currentPeriodEnd) {
    return new Date(subscription.currentPeriodEnd) > now;
  }
  return false;
}

export async function getUserContext(user) {
  const { db } = await connectToDatabase();
  const role = normalizeRole(user?.role);

  if (!user) return null;
  if (role === ROLES.SUPER_ADMIN) return { db, user, role, org: null, subscription: null, plan: null };

  const org = user.orgId
    ? await db.collection("organizations").findOne({ _id: user.orgId })
    : null;
  const subscription = org
    ? await db.collection("subscriptions").findOne({ orgId: org._id })
    : null;
  const plan = org?.planId ? await getActivePlan(db, org.planId) : null;

  return { db, user, role, org, subscription, plan };
}

export function requireOrg(context) {
  if (!context?.org) {
    const error = new Error("Organization was not found for this account.");
    error.status = 403;
    throw error;
  }
}

export function requireDashboardAccess(context, options = {}) {
  const { allowBilling = false } = options;
  if (context.role === ROLES.SUPER_ADMIN) return;
  requireOrg(context);

  const subscription = context.subscription;
  if (subscription?.status === "suspended" && !allowBilling) {
    const error = new Error("Dashboard access is suspended until payment is completed.");
    error.status = 402;
    throw error;
  }

  if (!isActiveOrGrace(subscription) && !allowBilling) {
    const error = new Error("An active subscription is required.");
    error.status = 402;
    throw error;
  }
}

export function requireFeature(plan, featureKey) {
  if (!plan?.[featureKey]) {
    const error = new Error("This feature is not included in your current plan.");
    error.status = 403;
    throw error;
  }
}

export async function enforceBuildingLimit(db, orgId, plan) {
  const max = plan?.maxBuildings ?? plan?.buildingLimit;
  if (isUnlimited(max)) return;
  const count = await db.collection("buildings").countDocuments({ orgId, status: { $ne: "deleted" } });
  if (count >= max) {
    const error = new Error(
      plan?.slug === "starter"
        ? "Your Starter plan includes 1 building. Upgrade to Professional to manage up to 5 buildings."
        : "Your Professional plan includes up to 5 buildings. Upgrade to Enterprise for multiple buildings.",
    );
    error.status = 403;
    throw error;
  }
}

export async function enforceLabourLimit(db, orgId, plan) {
  const max = plan?.maxLabourUsers ?? plan?.labourLimit;
  if (isUnlimited(max)) return;
  const count = await db.collection("users").countDocuments({
    orgId,
    role: { $in: [ROLES.LABOUR, "labour"] },
    status: { $ne: "deleted" },
  });
  if (count >= max) {
    const error = new Error(
      plan?.slug === "starter"
        ? "Your Starter plan includes 1 labour account. Upgrade to Professional for multiple labour accounts."
        : "Your Professional plan labour limit has been reached. Upgrade to Enterprise for unlimited labour accounts.",
    );
    error.status = 403;
    throw error;
  }
}

export function serializeContext(context) {
  return {
    organization: context.org,
    subscription: context.subscription,
    plan: publicPlan(context.plan),
    access: isActiveOrGrace(context.subscription) ? "active" : "inactive",
  };
}
