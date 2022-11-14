import { getClientBySession, publishSession } from "../../libs/hygraphClient";
import { getSessionCookie, setSessionCookie } from "../../libs/cookies";
import { responseStatus } from "../../lang";

export default async function handler(req, res) {
  switch (req.method) {
    case "PATCH": {
      const { token } = req.body;

      try {
        await publishSession(token);
        setSessionCookie({ req, res, sessionToken: token });

        return res.status(200).json({ success: responseStatus.userLoggedIn });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "500 Internal error" });
      }
    }
    case "GET": {
      const sessionToken = getSessionCookie({ req, res });

      try {
        const user = await getClientBySession(sessionToken);

        if (user) {
          return res.status(200).json({ success: responseStatus.userLoggedIn });
        } else {
          return res.status(500).json({ error: "400 Not logged in" });
        }
      } catch (error) {
        console.error(error);

        return res.status(500).json({ error: "400 Not logged in" });
      }
    }
    default: {
      return res.status(405).json({ error: "405 Method Not Allowed" });
    }
  }
}
