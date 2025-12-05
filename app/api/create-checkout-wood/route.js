import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_WILLOU;
const priceId = "price_1Sb3QtCeOpCabCO82mJUyiN1";
import { adminDb } from "@/app/firebase/admin";

if (!stripeSecretKey) {
  console.warn("[create-checkout-wood] Missing STRIPE_SECRET_KEY_WOOD env var");
}

if (!priceId) {
  console.warn("[create-checkout-wood] Missing STRIPE_WOOD_PRICE_ID env var");
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" })
  : null;

export async function POST(req) {
  try {
    if (!stripe || !priceId) {
      return NextResponse.json(
        { error: "Stripe is not configured correctly on the server." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { quantity = 1, sizes = [], productSlug = "woodstick" } = body || {};

    const qty = Math.max(1, Math.min(99, Number(quantity) || 1));

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";


  const productId = body.id; // ou item.title en version nettoyée

  const ref = adminDb.collection("stock").doc(productId);
  const snap = await ref.get();

  if (!snap.exists) {
    return new Response(
      JSON.stringify({ error: `Produit inconnu : ${productId}` }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const data = snap.data();
  const available = data.total - data.sold;

  if (available < qty) {
    return new Response(
      JSON.stringify({ error: `Stock insuffisant pour ${productId}` }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }


    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
      line_items: [
        {
          price: priceId,
          quantity: qty,
        },
      ],
      success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/products/${productSlug}?canceled=1`,
      shipping_options: [
        {
          shipping_rate: process.env.STRIPE_SHIPPING_RATE_WILLOU,
        },
      ],
      invoice_creation: {
        enabled: true,
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        qty: String(qty),
        sizes: sizes.join(","),
        productSlug,
        id: body.id || "",
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(
      "[create-checkout-wood] Error creating checkout session:",
      err
    );
    return NextResponse.json(
      { error: "Unable to create Stripe Checkout session." },
      { status: 500 }
    );
  }
}
