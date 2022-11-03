import hygraphClient from "../../libs/hygraphClient";
import { randomBytes } from "node:crypto";

hygraphClient.setHeader(
  "authorization",
  `Bearer ${process.env.HYGRAPH_API_TOKEN}`
);

function createClient(req, res) {
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
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    createClient(req, res);
  }

  res.status(200).json({ success: "User created" });
}
