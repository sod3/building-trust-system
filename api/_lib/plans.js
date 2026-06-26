export const DEFAULT_PLANS = [
  {
    planId: "starter",
    name: "Starter",
    priceSar: 299,
    amountHalalas: 29900,
    currency: "SAR",
    billingCycle: "monthly",
    buildingLimit: 1,
    labourLimit: 5,
    isActive: true,
    description: "Perfect for single-building owners getting started.",
  },
  {
    planId: "professional",
    name: "Professional",
    priceSar: 899,
    amountHalalas: 89900,
    currency: "SAR",
    billingCycle: "monthly",
    buildingLimit: 5,
    labourLimit: 20,
    isActive: true,
    description: "Ideal for multi-building operations and growing portfolios.",
  },
  {
    planId: "enterprise",
    name: "Enterprise",
    priceSar: 1999,
    amountHalalas: 199900,
    currency: "SAR",
    billingCycle: "monthly",
    buildingLimit: 999,
    labourLimit: 999,
    isActive: true,
    description: "Full-scale solution for large property management operations.",
  },
];

export async function seedPlans(db) {
  const now = new Date();
  await Promise.all(
    DEFAULT_PLANS.map((plan) =>
      db.collection("plans").updateOne(
        { planId: plan.planId },
        {
          $set: { ...plan, updatedAt: now },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true },
      ),
    ),
  );
}

export async function getActivePlan(db, planId) {
  await seedPlans(db);
  return db.collection("plans").findOne({ planId, isActive: true });
}
