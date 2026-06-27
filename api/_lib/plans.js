const unlimited = null;

export const DEFAULT_PLANS = [
  {
    slug: "starter",
    planId: "starter",
    name: "Starter",
    priceSar: 299,
    amountHalalas: 29900,
    currency: "SAR",
    billingCycle: "monthly",
    maxBuildings: 1,
    maxLabourUsers: 1,
    maxOwnerUsers: 1,
    checklistTemplates: false,
    dailyReports: true,
    todaysReports: true,
    reportHistory: "basic",
    reportHistoryDays: 30,
    advancedReports: false,
    supportLevel: "email",
    customSetup: false,
    isActive: true,
    description: "Perfect for single-building owners getting started.",
    features: [
      "1 building only",
      "Owner dashboard access",
      "Labour checklist dashboard",
      "Daily reports",
      "Basic report history",
      "Email support",
    ],
  },
  {
    slug: "professional",
    planId: "professional",
    name: "Professional",
    priceSar: 899,
    amountHalalas: 89900,
    currency: "SAR",
    billingCycle: "monthly",
    maxBuildings: 5,
    maxLabourUsers: 25,
    maxOwnerUsers: 1,
    checklistTemplates: true,
    dailyReports: true,
    todaysReports: true,
    reportHistory: "standard",
    reportHistoryDays: 365,
    advancedReports: false,
    supportLevel: "priority",
    customSetup: false,
    isActive: true,
    description: "Ideal for multi-building operations and growing portfolios.",
    features: [
      "Up to 5 buildings",
      "Multiple labour accounts",
      "Checklist templates",
      "Today's reports",
      "Report history",
      "Priority support",
    ],
  },
  {
    slug: "enterprise",
    planId: "enterprise",
    name: "Enterprise",
    priceSar: 1999,
    amountHalalas: 199900,
    currency: "SAR",
    billingCycle: "monthly",
    maxBuildings: unlimited,
    maxLabourUsers: unlimited,
    maxOwnerUsers: unlimited,
    checklistTemplates: true,
    dailyReports: true,
    todaysReports: true,
    reportHistory: "advanced",
    reportHistoryDays: unlimited,
    advancedReports: true,
    supportLevel: "dedicated",
    customSetup: true,
    isActive: true,
    description: "Full-scale solution for large property management operations.",
    features: [
      "Multiple/unlimited buildings",
      "Custom setup",
      "Multiple owner/supervisor users later",
      "Advanced report history",
      "Priority support",
      "Dedicated support",
    ],
  },
].map((plan) => ({
  ...plan,
  buildingLimit: plan.maxBuildings,
  labourLimit: plan.maxLabourUsers,
}));

export function normalizePlanSlug(planId) {
  return String(planId || "")
    .trim()
    .toLowerCase();
}

export function getPlanConfig(planId) {
  const slug = normalizePlanSlug(planId);
  return DEFAULT_PLANS.find((plan) => plan.slug === slug || plan.planId === slug) || null;
}

export function isUnlimited(value) {
  return value === null || value === undefined || value < 0 || value >= 999;
}

export function publicPlan(plan) {
  if (!plan) return null;
  const { _id, ...safePlan } = plan;
  return {
    ...safePlan,
    id: safePlan.slug || safePlan.planId,
    slug: safePlan.slug || safePlan.planId,
    planId: safePlan.planId || safePlan.slug,
    buildingLimit: safePlan.maxBuildings,
    labourLimit: safePlan.maxLabourUsers,
  };
}

export async function seedPlans(db) {
  const now = new Date();
  await Promise.all(
    DEFAULT_PLANS.map(async (plan) => {
      const existingPlan = await db.collection("plans").findOne({
        $or: [{ slug: plan.slug }, { planId: plan.slug }],
      });

      if (existingPlan) {
        await db.collection("plans").updateOne(
          { _id: existingPlan._id },
          {
            $set: { ...plan, updatedAt: now },
            $setOnInsert: { createdAt: now },
          },
        );
        return;
      }

      await db.collection("plans").insertOne({
        ...plan,
        createdAt: now,
        updatedAt: now,
      });
    }),
  );
}

export async function getActivePlan(db, planId) {
  await seedPlans(db);
  const slug = normalizePlanSlug(planId);
  return db.collection("plans").findOne({
    $or: [{ slug }, { planId: slug }],
    isActive: true,
  });
}
