import nodemailer from "nodemailer";
import siteConfig from "../config/site";

export async function sendResetEmail(email, resetLink) {
  const host = process.env.MAIL_HOST || "smtp.gmail.com";
  const user = process.env.MAIL_AUTH;
  const pass = process.env.MAIL_PASS;

  if (!user || !pass) {
    console.warn("[nodemailpass] Mail credentials missing. Reset link is:", resetLink);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.MAIL_PORT || "587", 10),
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user,
      pass,
    },
  });

  const fromAddress = process.env.MAIL_FROM || `"${siteConfig.brandName}" <${user}>`;

  await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: `${siteConfig.brandName} - Password Reset Request`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0284c7; text-align: center;">${siteConfig.brandName}</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetLink}" style="background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 13px;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} ${siteConfig.brandName}. All rights reserved.</p>
      </div>
    `,
  });
}

export default sendResetEmail;
