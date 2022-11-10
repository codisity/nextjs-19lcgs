import { createClient, createSession } from "../../libs/hygraphClient";
import { randomBytes } from "node:crypto";
import { baseUrl, emailFrom } from "../../config";
import { sendEmail } from "../../libs/email";

async function initializeClientCreation(req, res) {
  const email = req.body.email.trim();
  const emailRegExp = /.+@.+\..+/;
  if (!emailRegExp.test(email)) {
    res.status(400).json({ error: "Invalid email address" });
  }

  const confirmToken = randomBytes(100).toString("hex");

  try {
    await createClient({ email, confirmToken });
  } catch (error) {
    const notUniqueErrorMsg = 'value is not unique for the field "email"';
    if (error.response.errors[0].message === notUniqueErrorMsg) {
      const sessionToken = randomBytes(100).toString("hex");

      try {
        await createSession({
          email,
          token: sessionToken,
        });

        await sendEmail({
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

  await sendEmail({
    from: emailFrom,
    to: email,
    subject: "Aktywacja konta",
    html: `<a href="${baseUrl}/api/activate-user?token=${confirmToken}">Aktywuj konto</a>`,
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await initializeClientCreation(req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "500 Internal error" });
    }
  }

  return res.status(200).json({ success: "User created" });
}
