import { addCartItem, getClientBySession } from "../../libs/hygraphClient";
import { getSessionCookie } from "../../libs/cookies";
import { responseStatus } from "../../lang";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST": {
      const { slug } = req.body;

      try {
        const sessionToken = getSessionCookie({ req, res });
        const { email } = await getClientBySession(sessionToken);

        await addCartItem({ email, slug });

        return res.status(200).json({ success: responseStatus.itemAddedToCart });
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
