import nodemailer from "nodemailer";

export const sendAmcEnquiryEmail = async (mailOptions) => {
  const host = process.env.MAIL_HOST || "smtp.gmail.com";
  const user = process.env.MAIL_AUTH;
  const pass = process.env.MAIL_PASS;

  if (!user || !pass) {
    console.warn("[newmailer] Mail credentials missing. AMC Enquiry payload:", mailOptions);
    return { accepted: [mailOptions.to] };
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

  return transporter.sendMail(mailOptions);
};

export default sendAmcEnquiryEmail;