import {
  createClient,
  createSession,
  publishClient,
} from "../../libs/hygraphClient";
import { randomBytes } from "node:crypto";
import { baseUrl, emailFrom } from "../../config";
import { sendEmail } from "../../libs/email";
import { responseStatus } from "../../lang";
import { setSessionCookie } from "../../libs/cookies";

async function initializeClientCreation(req, res) {
  const email = req.body.email.trim();
  const emailRegExp = /.+@.+\..+/;
  if (!emailRegExp.test(email)) {
    res.status(400).json({ error: responseStatus.invalidEmail });
  }

  const confirmToken = randomBytes(100).toString("hex");

  try {
    await createClient({ email, confirmToken });

    await sendEmail({
      from: emailFrom,
      to: email,
      subject: "Aktywacja konta",
      html: `<a href="${baseUrl}/aktywacja-uzytkownika?token=${confirmToken}">Aktywuj konto</a>`,
    });

    return res.status(200).json({ success: responseStatus.userCreated });
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
          html: `<a href="${baseUrl}/potwierdzenie-logowania?token=${sessionToken}">Potwierdź logowanie</a>`,
        });

        return res
          .status(200)
          .json({ success: responseStatus.userLoggingInit });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "500 Internal error" });
      }
    } else {
      throw error;
    }
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case "POST": {
      try {
        await initializeClientCreation(req, res);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "500 Internal error" });
      }
    }
    case "PATCH": {
      try {
        const { token } = req.body;

        const data = await publishClient(token);
        const client = data.publishClient;

        const sessionToken = randomBytes(100).toString("hex");
        setSessionCookie({ req, res, sessionToken });

        await createSession({
          email: client.email,
          token: sessionToken,
        });

        return res
          .status(200)
          .json({ success: responseStatus.userActivatedAndLoggedIn });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "500 Internal error" });
      }
    }
    default: {
      return res.status(405).json({ error: "405 Method Not Allowed" });
    }
  }
}
