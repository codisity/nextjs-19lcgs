import hygraphClient from "../../libs/hygraphClient";
import { randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { htmlToText } from "nodemailer-html-to-text";

hygraphClient.setHeader(
  "authorization",
  `Bearer ${process.env.HYGRAPH_API_TOKEN}`
);

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1cb7699eb06394",
    pass: "3f785f032cad08",
  },
});
transporter.use("compile", htmlToText());

const baseUrl = "https://2ieeou-3000.preview.csb.app";
const emailFrom = '"Fred Foo 👻" <foo@example.com>';
const sessionCookieName = "loginToken";

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
    const notUniqueErrorMsg = 'value is not unique for the field "email"';
    if (error.response.errors[0].message === notUniqueErrorMsg) {
      const sessionToken = randomBytes(100).toString("hex");

      try {
        await hygraphClient.request(
          `
        mutation CreateSession($email: String!, $token: String!) {
          createSession(data: {token: $token, client: {connect: {email: $email}}}) {
            id
          }
        }
      `,
          {
            email,
            token: sessionToken,
          }
        );

        await transporter.sendMail({
          from: emailFrom,
          to: email,
          subject: "Logowanie",
          html: `<a href="${baseUrl}/api/activate-session?token=${sessionToken}">Potwierdź logowanie</a>`,
        });

        return res.status(200).json({ success: "User logging in initiated" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "500 Internal error" });
      }
    } else {
      throw error;
    }
  }

  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: "Aktywacja konta",
    html: `<a href="${baseUrl}/api/activate-user?token=${confirmToken}">Aktywuj konto</a>`,
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await createClient(req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "500 Internal error" });
    }
  }

  return res.status(200).json({ success: "User created" });
}
