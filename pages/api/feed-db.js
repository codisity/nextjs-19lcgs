import { faker } from "@faker-js/faker";
import slugify from "slugify";
import { createProduct } from "../../libs/hygraphClient";

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

  await createProduct(product);
}
