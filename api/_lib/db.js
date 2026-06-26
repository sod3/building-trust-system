import { MongoClient, ObjectId } from "mongodb";

const globalCache = globalThis.__facilityosMongo ?? {
  client: null,
  db: null,
  indexesReady: false,
};

globalThis.__facilityosMongo = globalCache;

export { ObjectId };

export async function connectToDatabase() {
  if (globalCache.client && globalCache.db) {
    return { client: globalCache.client, db: globalCache.db };
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "building_trust_system";

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const client = new MongoClient(uri);
  await client.connect();

  globalCache.client = client;
  globalCache.db = client.db(dbName);

  await ensureIndexes(globalCache.db);

  return { client, db: globalCache.db };
}

async function ensureIndexes(db) {
  if (globalCache.indexesReady) return;

  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("users").createIndex({ orgId: 1, role: 1, status: 1 }),
    db.collection("organizations").createIndex({ ownerUserId: 1 }),
    db.collection("organizations").createIndex({ status: 1, subscriptionStatus: 1 }),
    db.collection("plans").createIndex({ slug: 1 }, { unique: true }),
    db.collection("plans").createIndex({ planId: 1 }, { unique: true }),
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
