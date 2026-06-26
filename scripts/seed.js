import { connectToDatabase } from "../api/_lib/db.js";
import { seedPlans } from "../api/_lib/plans.js";
import { createId, ensureSeedAdmin, hashPassword, ROLES } from "../api/_lib/security.js";

async function main() {
  const { db, client } = await connectToDatabase();
  await seedPlans(db);
  await ensureSeedAdmin(db);

  if (process.env.NODE_ENV !== "production" && process.env.SEED_DEMO_ORG === "true") {
    const now = new Date();
    const ownerEmail = "owner@building.com";
    const existing = await db.collection("users").findOne({ email: ownerEmail });
    if (!existing) {
      const orgId = createId("org");
      const ownerId = createId("user");
      const periodEnd = new Date(now);
      periodEnd.setDate(periodEnd.getDate() + 30);

      await db.collection("organizations").insertOne({
        _id: orgId,
        name: "Demo Building Group",
        ownerUserId: ownerId,
        planId: "professional",
        subscriptionStatus: "active",
        status: "active",
        createdAt: now,
        updatedAt: now,
      });
      await db.collection("users").insertOne({
        _id: ownerId,
        name: "Demo Owner",
        email: ownerEmail,
        phone: "+966 55 000 0000",
        passwordHash: hashPassword("owner123"),
        role: ROLES.OWNER,
        orgId,
        status: "active",
        createdAt: now,
        updatedAt: now,
      });
      await db.collection("subscriptions").insertOne({
        _id: createId("sub"),
        orgId,
        userId: ownerId,
        planId: "professional",
        planName: "Professional",
        status: "active",
        billingMode: "automatic",
        amountSar: 899,
        amountHalalas: 89900,
        currency: "SAR",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        nextBillingDate: periodEnd,
        cancelAtPeriodEnd: false,
        retryCount: 0,
        lastPaymentStatus: "paid",
        maxBuildings: 5,
        maxLabourUsers: 25,
        buildingLimit: 5,
        labourLimit: 25,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  await client.close();
  console.log("Seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
