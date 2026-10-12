import nodemailer from 'nodemailer';

const RECIPIENT_EMAIL = 'pratyushkarki6@gmail.com';
const WEB3FORMS_ACCESS_KEY = '97d3105d-c0c0-488d-9f46-b4c76208352b';

/**
 * Escapes HTML characters in user input to prevent injection in emails.
 */
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates an elegant, professional, clean auto-reply email template.
 */
function buildAutoReplyHtml(name, message) {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for getting in touch</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1f2937; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="padding: 36px 32px 32px 32px;">
              <!-- Greeting -->
              <h1 style="margin: 0 0 18px 0; font-size: 20px; font-weight: 600; color: #111827; line-height: 1.4;">
                Hi ${safeName},
              </h1>

              <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 1.6; color: #374151;">
                Thank you for reaching out. I have received your message and will review it shortly. You can expect a response within 24 to 48 hours.
              </p>

              <!-- Message Summary Box -->
              <div style="margin: 24px 0; background-color: #f9fafb; border: 1px solid #e5e7eb; border-left: 3px solid #2563eb; border-radius: 6px; padding: 16px 18px;">
                <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
                  Summary of your message:
                </div>
                <div style="font-size: 14px; line-height: 1.6; color: #374151; word-break: break-word;">
                  ${safeMessage}
                </div>
              </div>

              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                If you have any urgent updates or additional information, please feel free to reply directly to this email.
              </p>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 24px 0;" />

              <!-- Professional Signature -->
              <div>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #4b5563;">
                  Best regards,
                </p>
                <div style="font-size: 15px; font-weight: 600; color: #111827;">
                  Shrawan Karki
                </div>
                <div style="font-size: 13px; color: #6b7280; margin-top: 2px;">
                  Frontend Developer &amp; UI/UX Designer
                </div>
                <div style="font-size: 13px; margin-top: 12px;">
                  <a href="https://shrawankarki.com.np" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 500;">shrawankarki.com.np</a>
                  <span style="color: #9ca3af; margin: 0 6px;">&bull;</span>
                  <a href="https://www.linkedin.com/in/shrawan-karki-187706428/" target="_blank" style="color: #4b5563; text-decoration: none;">LinkedIn</a>
                  <span style="color: #9ca3af; margin: 0 6px;">&bull;</span>
                  <a href="https://github.com/frontend-fuchhey" target="_blank" style="color: #4b5563; text-decoration: none;">GitHub</a>
                </div>
              </div>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin-top: 20px;">
          <tr>
            <td align="center" style="font-size: 12px; color: #9ca3af;">
              This is an automated confirmation sent from shrawankarki.com.np
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Fallback dispatcher using Web3Forms when SMTP is unavailable.
 */
async function sendViaWeb3FormsFallback({ name, email, message }) {
  const fallbackResponse = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      access_key: process.env.WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY,
      subject: `[Portfolio Contact] Message from ${name}`,
      from_name: name,
      email: email,
      message: message,
    }),
  });

  if (!fallbackResponse.ok) {
    const errorBody = await fallbackResponse.text().catch(() => '');
    throw new Error(`Web3Forms fallback returned HTTP ${fallbackResponse.status}: ${errorBody}`);
  }

  return await fallbackResponse.json();
}

export const handler = async (event) => {
  // CORS Preflight support
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { name, email, message, botField } = JSON.parse(event.body || '{}');

    // Honeypot spam defense: Silently accept without sending emails
    if (botField && String(botField).trim() !== '') {
      console.warn('Honeypot trap triggered. Suppressing email transmission.');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Message received successfully.' }),
      };
    }

    // Input Validation
    const trimmedName = (name || '').trim();
    const trimmedEmail = (email || '').trim();
    const trimmedMessage = (message || '').trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Name, email, and message are required fields.' }),
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Please provide a valid email address.' }),
      };
    }

    const gmailUser = process.env.MY_GMAIL_ADDRESS;
    const gmailPass = process.env.MY_GMAIL_APP_PASSWORD;

    // Check if Gmail SMTP credentials are configured
    if (!gmailUser || !gmailPass) {
      console.warn('Gmail SMTP credentials missing in environment. Using Web3Forms fallback.');
      await sendViaWeb3FormsFallback({ name: trimmedName, email: trimmedEmail, message: trimmedMessage });
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Message delivered via fallback dispatcher.',
        }),
      };
    }

    // Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // 1. Notification Email to Shrawan
    const notificationHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 18px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Message from Portfolio Website</h2>
        <p style="margin: 12px 0 6px 0;"><strong>Sender Name:</strong> ${escapeHtml(trimmedName)}</p>
        <p style="margin: 6px 0 6px 0;"><strong>Sender Email:</strong> <a href="mailto:${escapeHtml(trimmedEmail)}" style="color: #2563eb;">${escapeHtml(trimmedEmail)}</a></p>
        <p style="margin: 6px 0 16px 0; color: #64748b; font-size: 13px;"><strong>Date:</strong> ${new Date().toUTCString()}</p>
        <div style="margin-top: 16px; padding: 16px; background-color: #f8fafc; border-left: 3px solid #2563eb; border-radius: 6px;">
          <div style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Message:</div>
          <div style="white-space: pre-wrap; color: #1e293b; font-size: 14px; line-height: 1.6;">${escapeHtml(trimmedMessage)}</div>
        </div>
      </div>
    `;

    const notificationPromise = transporter.sendMail({
      from: `"Portfolio Contact Form" <${gmailUser}>`,
      to: RECIPIENT_EMAIL,
      replyTo: trimmedEmail,
      subject: `[Portfolio Contact] Message from ${trimmedName}`,
      text: `Sender: ${trimmedName}\nEmail: ${trimmedEmail}\n\nMessage:\n${trimmedMessage}`,
      html: notificationHtml,
    });

    // 2. Clean, Professional Auto-Reply Email to Visitor
    const autoReplyHtml = buildAutoReplyHtml(trimmedName, trimmedMessage);
    const autoReplyText = `Hi ${trimmedName},\n\nThank you for reaching out. I have received your message and will review it shortly. You can expect a response within 24 to 48 hours.\n\nSummary of your message:\n"${trimmedMessage}"\n\nIf you have any urgent updates or additional information, please feel free to reply directly to this email.\n\nBest regards,\nShrawan Karki\nFrontend Developer & UI/UX Designer\nhttps://shrawankarki.com.np`;

    const autoReplyPromise = transporter.sendMail({
      from: `"Shrawan Karki" <${gmailUser}>`,
      to: trimmedEmail,
      subject: 'Thank you for getting in touch — Shrawan Karki',
      text: autoReplyText,
      html: autoReplyHtml,
    });

    // Dispatch both concurrently
    await Promise.all([notificationPromise, autoReplyPromise]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Message and confirmation email dispatched successfully.' }),
    };

  } catch (err) {
    console.error('Nodemailer failed, attempting Web3Forms fallback:', err);
    try {
      const parsed = JSON.parse(event.body || '{}');
      await sendViaWeb3FormsFallback({
        name: parsed.name || 'Anonymous Visitor',
        email: parsed.email || RECIPIENT_EMAIL,
        message: parsed.message || 'No message provided',
      });
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Message delivered via backup service.',
        }),
      };
    } catch (fallbackErr) {
      console.error('All dispatch mechanisms failed:', fallbackErr);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Unable to deliver message at this time. Please email pratyushkarki6@gmail.com directly.',
        }),
      };
    }
  }
};
