import { MongoClient, ObjectId } from "mongodb";

const globalCache = globalThis.__facilityosMongo ?? {
  client: null,
  db: null,
  indexesReady: false,
};

globalThis.__facilityosMongo = globalCache;

export { ObjectId };

function isEnabled(value) {
  return ["1", "true", "yes"].includes(
    String(value || "")
      .trim()
      .toLowerCase(),
  );
}

export async function connectToDatabase() {
  if (globalCache.client && globalCache.db) {
    return { client: globalCache.client, db: globalCache.db };
  }

  const uri = String(process.env.MONGODB_URI || "").trim();
  const dbName = String(process.env.MONGODB_DB_NAME || "building_trust_system").trim();

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const client = new MongoClient(uri, {
    tlsAllowInvalidCertificates:
      process.env.NODE_ENV !== "production" ||
      isEnabled(process.env.MONGODB_TLS_ALLOW_INVALID_CERTIFICATES),
  });
  await client.connect();

  globalCache.client = client;
  globalCache.db = client.db(dbName);

  await ensureIndexes(globalCache.db);

  return { client, db: globalCache.db };
}

const CANONICAL_PLAN_SLUGS = ["starter", "professional", "enterprise"];

function normalizePlanKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function planSlugFromDocument(plan) {
  const slug = normalizePlanKey(plan.slug || plan.planId);
  if (CANONICAL_PLAN_SLUGS.includes(slug)) return slug;

  const name = normalizePlanKey(plan.name);
  return CANONICAL_PLAN_SLUGS.find((planSlug) => name.includes(planSlug)) || null;
}

async function repairPlanDocumentsForIndexes(db) {
  const plans = db.collection("plans");
  const existingPlans = await plans.find({}).toArray();
  const plansBySlug = new Map();

  for (const plan of existingPlans) {
    const slug = planSlugFromDocument(plan);
    if (!slug) continue;

    const matchingPlans = plansBySlug.get(slug) || [];
    matchingPlans.push(plan);
    plansBySlug.set(slug, matchingPlans);
  }

  for (const [slug, matchingPlans] of plansBySlug) {
    const [primaryPlan, ...duplicatePlans] = matchingPlans.sort((a, b) => {
      const aComplete = a.slug === slug && a.planId === slug ? 0 : 1;
      const bComplete = b.slug === slug && b.planId === slug ? 0 : 1;
      return aComplete - bComplete;
    });

    await plans.updateOne(
      { _id: primaryPlan._id },
      {
        $set: {
          slug,
          planId: slug,
          updatedAt: new Date(),
        },
      },
    );

    if (duplicatePlans.length > 0) {
      await plans.deleteMany({ _id: { $in: duplicatePlans.map((plan) => plan._id) } });
    }
  }
}

async function ensureIndexes(db) {
  if (globalCache.indexesReady) return;

  await repairPlanDocumentsForIndexes(db);

  const planIndexes = await db.collection("plans").indexes();
  const missingPlanIndexes = [];
  if (!planIndexes.some((index) => index.name === "slug_1")) {
    missingPlanIndexes.push(
      db
        .collection("plans")
        .createIndex(
          { slug: 1 },
          { unique: true, partialFilterExpression: { slug: { $type: "string" } } },
        ),
    );
  }
  if (!planIndexes.some((index) => index.name === "planId_1")) {
    missingPlanIndexes.push(
      db
        .collection("plans")
        .createIndex(
          { planId: 1 },
          { unique: true, partialFilterExpression: { planId: { $type: "string" } } },
        ),
    );
  }

  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("users").createIndex({ orgId: 1, role: 1, status: 1 }),
    db.collection("organizations").createIndex({ ownerUserId: 1 }),
    db.collection("organizations").createIndex({ status: 1, subscriptionStatus: 1 }),
    ...missingPlanIndexes,
    db.collection("orders").createIndex({ orderId: 1 }, { unique: true }),
    db.collection("orders").createIndex({ orgId: 1, userId: 1, status: 1 }),
    db.collection("payments").createIndex({ moyasarPaymentId: 1 }, { unique: true, sparse: true }),
    db.collection("payments").createIndex({ paymentId: 1 }, { unique: true }),
    db.collection("payments").createIndex({ orgId: 1, createdAt: -1 }),
    db.collection("subscriptions").createIndex({ orgId: 1 }, { unique: true }),
    db.collection("subscriptions").createIndex({ status: 1, nextBillingDate: 1 }),
    db.collection("invoices").createIndex({ invoiceId: 1 }, { unique: true }),
    db.collection("invoices").createIndex({ orgId: 1, createdAt: -1 }),
    db.collection("paymentMethods").createIndex({ orgId: 1, status: 1 }),
    db.collection("buildings").createIndex({ orgId: 1, status: 1 }),
    db.collection("checklistTemplates").createIndex({ orgId: 1, createdAt: -1 }),
    db.collection("dailyReports").createIndex({ orgId: 1, date: -1 }),
    db.collection("dailyReports").createIndex({ orgId: 1, buildingId: 1, date: -1 }),
    db.collection("supportTickets").createIndex({ orgId: 1, createdAt: -1 }),
    db.collection("auditLogs").createIndex({ orgId: 1, createdAt: -1 }),
    db.collection("webhookEvents").createIndex({ eventId: 1 }, { unique: true, sparse: true }),
  ]);

  globalCache.indexesReady = true;
}
