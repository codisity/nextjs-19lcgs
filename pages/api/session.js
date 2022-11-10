import { publishSession } from "../../libs/hygraphClient";
import { setSessionCookie } from "../../libs/cookies";

export default async function handler(req, res) {
  switch (req.method) {
    case "PATCH": {
      const { token } = req.body;

      try {
        await publishSession(token);
        setSessionCookie({ req, res, token });

        return res.status(200).json({ success: "User logged in" });
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
