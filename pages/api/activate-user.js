import { setCookie } from "cookies-next";
import { randomBytes } from "node:crypto";
import hygraphClient from "../../libs/hygraphClient";

hygraphClient.setHeader(
  "authorization",
  `Bearer ${process.env.HYGRAPH_API_TOKEN}`
);
const sessionCookieName = "loginToken";

export default async function handler(req, res) {
  const { token } = req.query;
  let client;

  try {
    const data = await hygraphClient.request(
      `
        mutation PublishClient($confirmToken: String!) {
            publishClient(where: {confirmToken: $confirmToken}) {
                id
                email
            }
        }
      `,
      {
        confirmToken: token,
      }
    );

    client = data.publishClient;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "500 Internal error" });
  }

  const sessionToken = randomBytes(100).toString("hex");
  setCookie(sessionCookieName, sessionToken, {
    req,
    res,
    maxAge: 60 * 60 * 24 * 7,
  });

  try {
    await hygraphClient.request(
      `
        mutation CreateSession($email: String!, $token: String!) {
          createSession(data: {token: $token, client: {connect: {email: $email}}}) {
            id
          }
          publishSession(where: {token: $token}) {
            id
          }
        }
      `,
      {
        email: client.email,
        token: sessionToken,
      }
    );

    return res.status(200).json({ success: "User activated and logged in" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "500 Internal error" });
  }
}
