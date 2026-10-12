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
 * Generates the sleek, modern dark-themed Portfolio OS auto-reply email template.
 */
function buildAutoReplyHtml(name, message) {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transmission Received — Shrawan OS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Container Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #111827; border: 1px solid #1f2937; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);">
          
          <!-- OS Window Header -->
          <tr>
            <td style="padding: 16px 20px; background-color: #172033; border-bottom: 1px solid #1f2937;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="55" valign="middle">
                    <!-- macOS style traffic lights -->
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #ef4444; margin-right: 6px;"></span>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #f59e0b; margin-right: 6px;"></span>
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #10b981;"></span>
                  </td>
                  <td align="right" valign="middle" style="font-size: 11px; font-weight: 600; letter-spacing: 0.08em; color: #94a3b8; text-transform: uppercase;">
                    Shrawan OS // Contact Terminal
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Banner / Greeting -->
          <tr>
            <td style="padding: 32px 28px 20px 28px;">
              <div style="font-size: 12px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px;">
                Status: Transmission Received & Logged
              </div>
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
                Hi ${safeName},
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Thank you for reaching out through my Portfolio OS! Your message has been received and delivered directly to my personal inbox. I typically review and respond to new messages within 24 hours.
              </p>
            </td>
          </tr>

          <!-- Echoed Message Box -->
          <tr>
            <td style="padding: 0 28px 20px 28px;">
              <div style="background-color: #0a0f1d; border: 1px solid #1e293b; border-left: 3px solid #3b82f6; border-radius: 8px; padding: 16px 18px;">
                <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 8px;">
                  Echoed Message Content
                </div>
                <div style="font-size: 13px; line-height: 1.6; color: #e2e8f0; font-family: 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                  ${safeMessage}
                </div>
              </div>
            </td>
          </tr>

          <!-- Communication Note -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #94a3b8;">
                If your project is time-sensitive or includes additional files/specifications, simply reply directly to this email thread anytime.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 28px;">
              <div style="height: 1px; background-color: #1e293b; width: 100%;"></div>
            </td>
          </tr>

          <!-- Signature & Footer -->
          <tr>
            <td style="padding: 24px 28px 28px 28px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 14px; font-weight: 700; color: #ffffff;">Shrawan Karki</div>
                    <div style="font-size: 12px; color: #38bdf8; margin-top: 2px;">Frontend Developer &amp; UI/UX Designer</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 12px;">
                      <a href="https://shrawankarki.com.np" target="_blank" style="color: #38bdf8; text-decoration: none; font-weight: 500;">shrawankarki.com.np</a> &bull;
                      <a href="https://github.com/frontend-fuchhey" target="_blank" style="color: #94a3b8; text-decoration: none; margin-left: 6px;">GitHub</a> &bull;
                      <a href="https://www.linkedin.com/in/shrawan-karki-187706428/" target="_blank" style="color: #94a3b8; text-decoration: none; margin-left: 6px;">LinkedIn</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Micro Footer -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin-top: 16px;">
          <tr>
            <td align="center" style="font-size: 11px; color: #475569;">
              Sent automatically from Shrawan Portfolio OS &bull; Morang, Nepal
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
      subject: `[Portfolio Contact - Fallback] Message from ${name}`,
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
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">New Contact Message from Portfolio OS</h2>
        <p><strong>Sender:</strong> ${escapeHtml(trimmedName)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(trimmedEmail)}">${escapeHtml(trimmedEmail)}</a></p>
        <p><strong>Date:</strong> ${new Date().toUTCString()}</p>
        <div style="margin-top: 16px; padding: 16px; background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px;">
          <h4 style="margin: 0 0 8px 0; color: #475569; font-size: 12px; text-transform: uppercase;">Message Content:</h4>
          <div style="white-space: pre-wrap; color: #0f172a;">${escapeHtml(trimmedMessage)}</div>
        </div>
      </div>
    `;

    const notificationPromise = transporter.sendMail({
      from: `"Shrawan OS Portfolio" <${gmailUser}>`,
      to: RECIPIENT_EMAIL,
      replyTo: trimmedEmail,
      subject: `[Portfolio Contact] Message from ${trimmedName}`,
      text: `Sender: ${trimmedName}\nEmail: ${trimmedEmail}\n\nMessage:\n${trimmedMessage}`,
      html: notificationHtml,
    });

    // 2. High-end Auto-Reply Email to Visitor
    const autoReplyHtml = buildAutoReplyHtml(trimmedName, trimmedMessage);
    const autoReplyText = `Hi ${trimmedName},\n\nThank you for reaching out through my Portfolio OS! Your transmission has been received and logged into my inbox. I typically review and respond to new messages within 24 hours.\n\nECHOED MESSAGE CONTENT:\n"${trimmedMessage}"\n\nIf your project is time-sensitive, simply reply directly to this email.\n\nBest,\nShrawan Karki\nFrontend Developer & UI/UX Designer\nhttps://shrawankarki.com.np`;

    const autoReplyPromise = transporter.sendMail({
      from: `"Shrawan Karki" <${gmailUser}>`,
      to: trimmedEmail,
      subject: 'Transmission Received — Shrawan Karki',
      text: autoReplyText,
      html: autoReplyHtml,
    });

    // Dispatch both concurrently
    await Promise.all([notificationPromise, autoReplyPromise]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Message and auto-reply dispatched successfully.' }),
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
