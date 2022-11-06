import hygraphClient from "../../libs/hygraphClient";
import { randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { htmlToText } from "nodemailer-html-to-text";

hygraphClient.setHeader(
  "authorization",
  `Bearer ${process.env.HYGRAPH_API_TOKEN}`
);
const baseUrl = "https://2ieeou-3000.preview.csb.app";

async function createClient(req, res) {
  const email = req.body.email.trim();
  const emailRegExp = /.+@.+\..+/;
  if (!emailRegExp.test(email)) {
    res.status(400).json({ error: "Invalid email address" });
  }

  const confirmToken = randomBytes(100).toString("hex");

  try {
    await hygraphClient.request(
      `
        mutation CreateClient($email: String!, $confirmToken: String!) {
            createClient(data: {email: $email, confirmToken: $confirmToken}) {
                id
            }
        }
      `,
      {
        email,
        confirmToken,
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "500 Internal error" });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1cb7699eb06394",
      pass: "3f785f032cad08",
    },
  });
  transporter.use("compile", htmlToText());

  await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Aktywacja konta", // Subject line
    html: `<a href="${baseUrl}/api/activate-user?token=${confirmToken}">Aktywuj konto</a>`, // html body
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    await createClient(req, res);
  }

  res.status(200).json({ success: "User created" });
}
