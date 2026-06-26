import { connectToDatabase } from "../_lib/db.js";
import { getActivePlan } from "../_lib/plans.js";
import { readJsonBody, requireMethod, sendError, sendJson } from "../_lib/http.js";
import { createId, getAuthUser, hashPassword } from "../_lib/security.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;

  try {
    const body = await readJsonBody(req);
    const planId = String(body.planId || "").trim().toLowerCase();
    const ownerName = String(body.ownerName || body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();

    if (!planId) return sendError(res, 400, "planId is required.");
    if (!ownerName || !email) return sendError(res, 400, "Owner name and email are required.");

    const { db } = await connectToDatabase();
    const plan = await getActivePlan(db, planId);
    if (!plan) return sendError(res, 404, "Selected plan was not found.");

    const authUser = await getAuthUser(req).catch(() => null);
    const now = new Date();
    let user = authUser?.role === "owner" ? authUser : await db.collection("users").findOne({ email });

    if (!user) {
      user = {
        _id: createId("user"),
        name: ownerName,
        email,
        phone,
        passwordHash: hashPassword(createId("temp")),
        role: "owner",
        status: "pending_payment",
        createdAt: now,
        updatedAt: now,
      };
      await db.collection("users").insertOne(user);
    } else {
      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            name: ownerName || user.name,
            phone: phone || user.phone || "",
            status: user.status === "active" ? "active" : "pending_payment",
            updatedAt: now,
          },
        },
      );
    }

    const order = {
      _id: createId("orderdoc"),
      orderId: createId("order"),
      userId: user._id,
      planId: plan.planId,
      planName: plan.name,
      amountHalalas: plan.amountHalalas,
      currency: plan.currency,
      status: "pending",
      moyasarPaymentId: null,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection("orders").insertOne(order);

    sendJson(res, 201, {
      success: true,
      orderId: order.orderId,
      userId: order.userId,
      planId: plan.planId,
      planName: plan.name,
      amountHalalas: plan.amountHalalas,
      currency: plan.currency,
      description: `${plan.name} Plan - FacilityOS Arabia`,
      billingCycle: plan.billingCycle,
      buildingLimit: plan.buildingLimit,
      labourLimit: plan.labourLimit,
    });
  } catch (error) {
    console.error("[create-order]", error.message);
    sendError(res, 500, "Could not create checkout order.");
  }
}
