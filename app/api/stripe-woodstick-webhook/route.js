import Stripe from "stripe";
import * as Brevo from "@getbrevo/brevo";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_WILLOU);

const brevoClient = new Brevo.TransactionalEmailsApi();
brevoClient.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export async function POST(req) {
  let rawBody;
  let signature;
  let event;

  try {
    rawBody = await req.text();
    signature = req.headers.get("stripe-signature");

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_WILLOU
    );
  } catch (err) {
    console.error("❌ SIGNATURE ERROR :", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // On ignore les autres events mais on confirme pour Stripe
    return NextResponse.json({ received: true });
  }

  try {
    const session = event.data.object;

    const email = session.customer_details?.email;
    const name = session.customer_details?.name || "";
    const qty = session.metadata?.qty || "";
    const sizes = session.metadata?.sizes || "";
    const amount = session.amount_total
      ? session.amount_total / 100
      : undefined;

    // ✅ Si pas d’email, on ne tente rien
    if (!email) {
      console.error("❌ Pas d’email dans customer_details, on stop.");
      return NextResponse.json({ received: true });
    }

    // 🔹 On essaie de récupérer une facture ou au moins un reçu Stripe
    let pdfUrl = null;
    let invoiceUrl = null;

    try {
      if (session.invoice) {
        const invoice = await stripe.invoices.retrieve(session.invoice);
        pdfUrl = invoice.invoice_pdf || null;
        invoiceUrl =
          invoice.hosted_invoice_url || invoice.invoice_pdf || null;
      } else if (session.payment_intent) {
        const pi = await stripe.paymentIntents.retrieve(
          session.payment_intent
        );
        const charge = pi.charges?.data?.[0];
        if (charge?.receipt_url) {
          invoiceUrl = charge.receipt_url;
        }
      }
    } catch (err) {
      console.error("❌ Erreur lors de la récupération de l’invoice :", err);
    }

    // 🔹 Normalisation des tailles (JSON.stringify côté Checkout)
    let sizesText = "";
    try {
      if (sizes) {
        const parsed = JSON.parse(sizes);
        if (Array.isArray(parsed)) {
          sizesText = parsed.join(" / ");
        } else {
          sizesText = String(sizes);
        }
      }
    } catch {
      sizesText = String(sizes || "");
    }

    // 🔹 Envoi de l’email via Brevo
    try {
    await brevoClient.sendTransacEmail({
  to: [{ email }],
  sender: { email: "shop@wastick.com", name: "WASTICK" },
  templateId: Number(process.env.BREVO_TEMPLATE_WOODSTICK),
  params: {
    firstname: name,
    qty,
    sizes: sizesText,
    amount,
    invoice_url: invoiceUrl,
  },
});

      console.log("✔ Email envoyé à :", email);
    } catch (err) {
      console.error("❌ Erreur d’envoi Brevo :", err);
    }
  } catch (err) {
    console.error("❌ Erreur interne handler webhook :", err);
  }

  // Toujours répondre 200 à Stripe pour éviter les retries infinis
  return NextResponse.json({ received: true });
}