import hygraphClient from "../../libs/hygraphClient";
import { setCookie } from "cookies-next";

hygraphClient.setHeader(
  "authorization",
  `Bearer ${process.env.HYGRAPH_API_TOKEN}`
);
const sessionCookieName = "loginToken";

export default async function handler(req, res) {
  const { token } = req.query;

  try {
    await hygraphClient.request(
      `
        mutation CreateSession($token: String!) {
          publishSession(where: {token: $token}) {
            id
          }
        }
      `,
      {
        token,
      }
    );

    setCookie(sessionCookieName, token, {
      req,
      res,
      maxAge: 60 * 60 * 24 * 7,
    });

    return res.status(200).json({ success: "User logged in" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "500 Internal error" });
  }
}
