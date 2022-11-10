import nodemailer from "nodemailer";
import { htmlToText } from "nodemailer-html-to-text";

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
transporter.use("compile", htmlToText());

export async function sendEmail({ from, to, subject, html }) {
  await transporter.sendMail({ from, to, subject, html });
}
