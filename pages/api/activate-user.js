import { randomBytes } from "node:crypto";
import { createSession, publishClient } from "../../libs/hygraphClient";
import { setSessionCookie } from "../../libs/cookies";

export default async function handler(req, res) {
  const { token } = req.query;
  let client;

  try {
    const data = await publishClient(token);
    client = data.publishClient;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "500 Internal error" });
  }

  const sessionToken = randomBytes(100).toString("hex");
  setSessionCookie({ req, res, sessionToken });

  try {
    await createSession({
      email: client.email,
      token: sessionToken,
    });

    return res.status(200).json({ success: "User activated and logged in" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "500 Internal error" });
  }
}
