import nodemailer from "nodemailer";

type SendMailParams = {
  to: string;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendMail({ to, subject, html }: SendMailParams) {
  await transporter.sendMail({
    from: `"Tatilini Devret" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}