import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_WILLOU;
const priceId = "price_1SVDGN2SUMsUUiRSXlt4JQUA";

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
      success_url: `${origin}/merci-wood?session_id={CHECKOUT_SESSION_ID}`,
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
      },
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
