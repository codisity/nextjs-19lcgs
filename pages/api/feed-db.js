import { faker } from "@faker-js/faker";
import slugify from "slugify";
import hygraphClient from "../../libs/hygraphClient";

export default async function handler(req, res) {
  if (process.env.NODE_ENV !== "development") {
    res.status(500).send({ error: "Not in development mode" });
    return;
  }

  for (let i = 0; i < 10; i++) {
    await createFakeProduct();
  }

  res.status(200).send({ success: "Database feeded" });
}

async function createFakeProduct() {
  const productName = faker.commerce.productName();
  const product = {
    imageUrl: faker.image.abstract(null, null, true),
    name: productName,
    slug: slugify(productName, { lower: true }),
    price: parseFloat(faker.commerce.price()),
  };

  hygraphClient.setHeader(
    "authorization",
    `Bearer ${process.env.HYGRAPH_API_TOKEN}`
  );
  await hygraphClient.request(
    `
      mutation createProduct($imageUrl: String, $name: String!, $slug: String!, $price: Float!) {
        createProduct(
          data: {imageUrl: $imageUrl, name: $name, slug: $slug, price: $price}
        ) {
          id
        }
        publishProduct(where: {slug: $slug}) {
          id
        }
      }    
    `,
    product
  );
}
