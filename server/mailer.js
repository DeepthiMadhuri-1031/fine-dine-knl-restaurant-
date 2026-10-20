import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || '"FINE DINE KNL RESTAURANT" <noreply@finedineknl.com>';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4173';

let transporter = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

/**
 * Send Password Reset Email
 */
export async function sendPasswordResetEmail(email, resetToken, userName = 'Valued Customer') {
  const resetUrl = `${CLIENT_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;

  const subject = 'Password Reset Request — FINE DINE KNL RESTAURANT';
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; background-color: #171717; color: #F7F3EB; border-radius: 16px; border: 1px solid #B99558; overflow: hidden;">
      <div style="padding: 28px; text-align: center; background: linear-gradient(180deg, #222222 0%, #171717 100%); border-bottom: 1px solid #333333;">
        <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; border-radius: 50%; border: 1px solid #B99558; color: #B99558; font-family: serif; font-size: 18px; font-weight: bold; margin-bottom: 8px;">KNL</div>
        <h1 style="margin: 0; font-family: serif; font-size: 24px; color: #F7F3EB; letter-spacing: 1px;">FINE DINE KNL RESTAURANT</h1>
        <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #B99558;">Security & Operations · Kurnool</p>
      </div>
      <div style="padding: 32px 28px;">
        <h2 style="margin: 0 0 16px 0; font-family: serif; font-size: 20px; color: #F7F3EB;">Password Reset Request</h2>
        <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #D1D5DB;">Hello ${userName},</p>
        <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #D1D5DB;">
          We received a request to reset the password for your FINE DINE KNL account. Click the button below to choose a new password. This link is single-use and will expire in <strong>1 hour</strong>.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background-color: #B99558; color: #171717; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
            Reset Account Password
          </a>
        </div>
        <p style="margin: 0 0 12px 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
          If the button above does not work, copy and paste this URL into your browser:
        </p>
        <p style="margin: 0 0 24px 0; font-size: 11px; color: #B99558; word-break: break-all; background: #222222; padding: 10px; border-radius: 8px;">
          ${resetUrl}
        </p>
        <p style="margin: 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
          If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
      </div>
      <div style="padding: 20px 28px; background-color: #111111; border-top: 1px solid #282828; text-align: center; font-size: 11px; color: #6B7280;">
        FINE DINE KNL RESTAURANT · Near Collector Office Road, Kurnool, Andhra Pradesh · +91 94900 12345
      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject,
        html,
      });
      return { sent: true, mode: 'smtp' };
    } catch (err) {
      console.error('SMTP email dispatch error:', err.message);
      // Fallback
    }
  }

  // Local / Staging fallback when SMTP credentials are not configured in environment
  console.log(`\n======================================================`);
  console.log(`✉️  [PASSWORD RESET EMAIL SIMULATION / LOG]`);
  console.log(`To: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Reset Link: ${resetUrl}`);
  console.log(`======================================================\n`);

  return {
    sent: false,
    mode: 'local-log',
    resetUrl,
    note: 'SMTP credentials not configured in environment. Reset link logged to server console.',
  };
}
