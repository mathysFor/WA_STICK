import Stripe from "stripe";
import * as Brevo from "@getbrevo/brevo";
import { NextResponse } from "next/server";
import { adminDb, admin } from "@/app/firebase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
      process.env.STRIPE_WEBHOOK_SECRET
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

    // 🔹 Ancien système (Woodstick) : qty + sizes
    let qty = session.metadata?.qty || "";
    let sizes = session.metadata?.sizes || "";

    // 🔹 Nouveau système : items = JSON.stringify([...])
    let items = [];
    let itemsListText = "";

    try {
      if (session.metadata?.items) {
        const parsed = JSON.parse(session.metadata.items);
        if (Array.isArray(parsed)) {
          items = parsed;
        }
      }
    } catch (e) {
      console.error("❌ Impossible de parser metadata.items :", e);
    }

    // Si on a des items, on peut en déduire la quantité totale
    if (items.length > 0) {
      const totalQty = items.reduce(
        (sum, it) => sum + Number(it.quantity || 0),
        0
      );
      if (!qty && totalQty > 0) {
        qty = String(totalQty);
      }
      

      for (const item of items) {
        const ref = adminDb.collection("stock").doc(item.id);
        await ref.update({
          sold: admin.firestore.FieldValue.increment(item.quantity),
        });
      }

      // Ex : "• Le Fantastic × 2\n• Le Drastick × 4\n• Extra Drastick - Bâton de secours × 1"
      itemsListText = items
        .map((it) => {
          const title = it.title || it.model || it.priceId || "Produit Wastick";
          const q = it.quantity ?? 1;
          return `• ${title} × ${q}`;
        })
        .join("<br />");
    }

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
        invoiceUrl = invoice.hosted_invoice_url || invoice.invoice_pdf || null;
      } else if (session.payment_intent) {
        const pi = await stripe.paymentIntents.retrieve(session.payment_intent);
        const charge = pi.charges?.data?.[0];
        if (charge?.receipt_url) {
          invoiceUrl = charge.receipt_url;
        }
      }
    } catch (err) {
      console.error("❌ Erreur lors de la récupération de l’invoice :", err);
    }

    // 🔹 Normalisation des tailles (ancien système)
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

    // 🔹 Envoi de l’email au client via Brevo (template woodstick réutilisé)
    try {
      await brevoClient.sendTransacEmail({
        to: [{ email }],
        sender: { email: "wastick@wastick.com", name: "Mickael de Wastick" },
        templateId: Number(process.env.BREVO_TEMPLATE_WOODSTICK),
        params: {
          firstname: name,
          qty,
          sizes: sizesText,
          amount,
          invoice_url: invoiceUrl,
        },
      });

      // 🔹 Email producteur : on lui envoie la LISTE des produits
      // ➜ Dans Brevo tu affiches {{params.items_list}}
      //    Exemple rendu :
      //    • Le Fantastic × 2
      //    • Le Drastick × 4
      //    • Extra Drastick - Bâton de secours × 1
      const shippingAddress = session.customer_details?.address || {};

      await brevoClient.sendTransacEmail({
        to: [{ email: "mfornasier@yahoo.fr" }],
        sender: { email: "wastick@wastick.com", name: "Mickael de Wastick" },
        templateId: 5,
        params: {
          firstname: name,
          amount,
          invoice_url: invoiceUrl,
          shipping_adress: shippingAddress,
          city: shippingAddress.city,
          postal_code: shippingAddress.postal_code,
          line: shippingAddress.line1 || shippingAddress.line2,
          phone: session.customer_details?.phone,
          // compat ancien système
          qty: qty,
          sizes: sizesText,
          // 🆕 liste claire pour le producteur
          items_list:
            itemsListText ||
            (qty
              ? `• Woodstick × ${qty}${
                  sizesText ? ` (tailles : ${sizesText})` : ""
                }`
              : ""),
        },
        invoice_url: invoiceUrl,
      });

      console.log("✔ Emails envoyés (client + producteur) pour :", email);
    } catch (err) {
      console.error("❌ Erreur d’envoi Brevo :", err);
    }
  } catch (err) {
    console.error("❌ Erreur interne handler webhook :", err);
  }

  // Toujours répondre 200 à Stripe pour éviter les retries infinis
  return NextResponse.json({ received: true });
}
