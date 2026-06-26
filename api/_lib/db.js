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
    db.collection("plans").createIndex({ planId: 1 }, { unique: true }),
    db.collection("orders").createIndex({ orderId: 1 }, { unique: true }),
    db.collection("orders").createIndex({ userId: 1, status: 1 }),
    db.collection("payments").createIndex({ paymentId: 1 }, { unique: true }),
    db.collection("payments").createIndex({ userId: 1, createdAt: -1 }),
    db.collection("subscriptions").createIndex({ userId: 1 }, { unique: true }),
    db.collection("subscriptions").createIndex({ status: 1, currentPeriodEnd: 1 }),
    db.collection("buildings").createIndex({ ownerId: 1 }),
    db.collection("labour").createIndex({ ownerId: 1 }),
    db.collection("reports").createIndex({ ownerId: 1, createdAt: -1 }),
  ]);

  globalCache.indexesReady = true;
}
