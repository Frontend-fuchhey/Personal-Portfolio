import nodemailer from 'nodemailer';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { payload } = JSON.parse(event.body || '{}');
    const { name, email, message } = payload?.data || {};

    if (!email) {
      console.warn('Submission received without an email address.');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Recipient email is required.' }),
      };
    }

    const userName = name || 'there';
    const userMessage = message || '';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_GMAIL_ADDRESS,
        pass: process.env.MY_GMAIL_APP_PASSWORD,
      },
    });

    const htmlBody = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333333; line-height: 1.6; max-width: 600px; padding: 10px;">
  <p>Hey <strong>${userName}</strong>,</p>
  
  <p>Packet received. Thanks for connecting via <a href="https://shrawankarki.com.np" style="color: #e53e3e; text-decoration: none;">shrawankarki.com.np</a>. I’ve logged your message and will review it shortly.</p>
  
  <div style="margin: 20px 0; padding: 16px; background-color: #f8f9fa; border-left: 3px solid #e53e3e; font-family: monospace;">
    <div style="font-size: 11px; color: #718096; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">ECHOED PAYLOAD</div>
    <div style="font-style: italic; color: #2d3748; font-size: 14px;">“${userMessage}”</div>
  </div>
  
  <p>If anything changes or requires priority attention, just reply directly to this thread.</p>
  
  <p style="margin-top: 30px;">
    Best,<br>
    <strong>Shrawan Karki</strong>
  </p>
</div>`;

    const textBody = `Hey ${userName},

Packet received. Thanks for connecting via shrawankarki.com.np (https://shrawankarki.com.np). I’ve logged your message and will review it shortly.

ECHOED PAYLOAD
“${userMessage}”

If anything changes or requires priority attention, just reply directly to this thread.

Best,
Shrawan Karki`;

    await transporter.sendMail({
      from: `"Shrawan Karki" <${process.env.MY_GMAIL_ADDRESS}>`,
      to: email,
      subject: 'Packet received — Shrawan Karki',
      text: textBody,
      html: htmlBody,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Auto-reply sent successfully.' }),
    };
  } catch (error) {
    console.error('Error handling submission auto-responder:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};
