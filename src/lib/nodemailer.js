import nodemailer from "nodemailer";
import siteConfig from "../config/site";

export const sendOTPEmail = async (email, otp) => {
  const host = process.env.MAIL_HOST || "smtp.gmail.com";
  const user = process.env.MAIL_AUTH;
  const pass = process.env.MAIL_PASS;

  if (!user || !pass) {
    console.warn("[nodemailer] Mail credentials missing. OTP code is:", otp);
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
    subject: `${siteConfig.brandName} - Verify your email`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0284c7; text-align: center;">${siteConfig.brandName}</h2>
        <p>Hello,</p>
        <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
          <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #0369a1;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 13px;">This code is valid for 10 minutes. If you did not request this, please disregard this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} ${siteConfig.brandName}. All rights reserved.</p>
      </div>
    `,
  });
};

export default sendOTPEmail;
