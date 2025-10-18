// netlify/functions/send-email.js

// einfache E-Mail-Validierung
function isValidEmail(s = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// minimal XSS-Schutz für HTML-Mail
function escapeHtml(s = "") {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  // Env-Check frühzeitig
  const missing = ["RESEND_API_KEY", "MAIL_TO"].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error("Missing env vars:", missing);
    return { statusCode: 500, body: JSON.stringify({ error: "Serverkonfiguration unvollständig." }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();
    const consent = !!body.consent;

    // Pflichtfelder & Prüfungen
    if (!name || !email || !message || !consent) {
      return { statusCode: 400, body: JSON.stringify({ error: "Bitte Pflichtfelder ausfüllen und Datenschutzzustimmung erteilen." }) };
    }
    if (!isValidEmail(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Bitte eine gültige E-Mail-Adresse eingeben." }) };
    }
    if (message.length < 20) {
      return { statusCode: 400, body: JSON.stringify({ error: "Bitte eine aussagekräftige Nachricht (mind. 20 Zeichen) eingeben." }) };
    }
    // zu viele Links -> Spam
    if ((message.match(/https?:\/\//gi) || []).length > 2) {
      return { statusCode: 400, body: JSON.stringify({ error: "Zu viele Links in der Nachricht." }) };
    }

    const subject = `Neue BU-Anfrage von ${name}`;
    const text = `
Neue Anfrage über die Website:

Name:    ${name}
E-Mail:  ${email}
Telefon: ${phone || "-"}

Nachricht:
${message}

Einwilligung Datenschutz: ${consent ? "ja" : "nein"}
`.trim();

    const html = `
      <h2>Neue BU-Anfrage</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(phone || "-")}</p>
      <p><strong>Nachricht:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      <p><strong>Einwilligung Datenschutz:</strong> ${consent ? "ja" : "nein"}</p>
    `;

    // sinnvolle Defaults für From/Reply-To
    const from = process.env.MAIL_FROM || "Website <onboarding@resend.dev>";
    const to = process.env.MAIL_TO;

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email, // auf Absender antworten
        subject,
        text,
        html,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Resend error:", resp.status, errText);
      return { statusCode: 502, body: JSON.stringify({ error: "Mailversand fehlgeschlagen." }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    console.error("Function error:", e);
    return { statusCode: 500, body: JSON.stringify({ error: "Serverfehler." }) };
  }
}
