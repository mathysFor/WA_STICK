// app/api/create-checkout-session/route.js
import Stripe from "stripe";

import { adminDb } from "@/app/firebase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Stripe n'accepte que certains champs dans line_items (price, quantity, etc.)
    // On nettoie donc les items pour ne garder que ce qui est supporté.
    const lineItems = items.map((item) => ({
      price: item.price,
      quantity: item.quantity,
    }));

    // Vérification du stock
for (const item of items) {
  const productId = item.id; // ou item.title en version nettoyée

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

  if (available < item.quantity) {
    return new Response(
      JSON.stringify({ error: `Stock insuffisant pour ${item.title}` }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems, // [{ price: 'price_xxx', quantity: 1 }, ...]
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
      shipping_options: [
        {
          shipping_rate: process.env.STRIPE_SHIPPING_RATE_FR,
        },
      ],
      success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      metadata: {
        items: JSON.stringify(
          items.map((item) => ({
            priceId: item.price,
            quantity: item.quantity,
            title: item.title, // pratique aussi
            model: item.title.toLowerCase().replace(/\s+/g, "_"), // "Le Fantastic" → "le_fantastic"
            id: item.id,
          }))
        ),
      },
      phone_number_collection: {
        enabled: true,
      },
      invoice_creation: {
        enabled: true,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[api/create-checkout-session] error:", err);
    return new Response(
      JSON.stringify({ error: "Unable to create checkout session" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
