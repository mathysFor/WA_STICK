import Stripe from "stripe";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_WILLOU, {
  apiVersion: "2024-06-20",
});

const brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_WILLOU
    );
  } catch (err) {
    console.error("❌ SIGNATURE ERROR :", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const email = session.customer_details.email;
    const qty = session.metadata?.qty;
    const sizes = session.metadata?.sizes;
    const amount = session.amount_total / 100;

    let pdfUrl = null;
    if (session.invoice) {
      const invoice = await stripe.invoices.retrieve(session.invoice);
      pdfUrl = invoice.invoice_pdf;
    }

    await brevoClient.sendTransacEmail({
      to: [{ email }],
      sender: { email: "wastick@wastick.com", name: "WASTICK" },
      templateId: Number(process.env.BREVO_TEMPLATE_WOODSTICK),
      params: { qty, sizes, amount },
      attachment: pdfUrl
        ? [{ url: pdfUrl, name: "facture.pdf" }]
        : undefined,
    });

    console.log("✔ Email envoyé à :", email);
  }

  return NextResponse.json({ received: true });
}