import hygraphClient from "../../libs/hygraphClient";

hygraphClient.setHeader(
  "authorization",
  `Bearer ${process.env.HYGRAPH_API_TOKEN}`
);

export default async function handler(req, res) {
  const { token } = req.query;

  try {
    await hygraphClient.request(
      `
        mutation PublishClient($confirmToken: String!) {
            publishClient(where: {confirmToken: $confirmToken}) {
                id
            }
        }
      `,
      {
        confirmToken: token,
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "500 Internal error" });
  }

  res.status(200).json({ success: "User activated" });
}
