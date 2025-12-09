import * as brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export async function POST(req) {
  try {
    const { name, email, orderNumber, message } = await req.json();

    // Validation des champs obligatoires
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Nom, email et message sont obligatoires" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Email invalide" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Envoi de l'email via Brevo
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = `[WAstick Contact] Message de ${name}`;
    sendSmtpEmail.sender = { name: "WAstick Contact", email: "wastick@wastick.com" };
    sendSmtpEmail.to = [{ email: "fornasiermathys@gmail.com", name: "WAstick" }];
    sendSmtpEmail.replyTo = { email: email, name: name };
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E645AC;">Nouveau message de contact WAstick</h2>
        <hr style="border: 1px solid #eee;" />
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
        ${orderNumber ? `<p><strong>N° de commande :</strong> ${orderNumber}</p>` : ""}
        <hr style="border: 1px solid #eee;" />
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
      </div>
    `;

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    return new Response(
      JSON.stringify({ success: true, message: "Message envoyé avec succès" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[api/contact] error:", err);
    return new Response(
      JSON.stringify({ error: "Erreur lors de l'envoi du message" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

