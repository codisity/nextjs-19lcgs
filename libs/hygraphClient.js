import { GraphQLClient } from "graphql-request";

const hypgraphApiUrl =
  "https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/cl9h8c4dy07c401uhbm7r8lbm/master";
const hygraphClient = new GraphQLClient(hypgraphApiUrl);

function hygraphClientAuth(hygraphClient) {
  hygraphClient.setHeader(
    "authorization",
    `Bearer ${process.env.HYGRAPH_API_TOKEN}`
  );

  return hygraphClient;
}

const authHygraphClient = hygraphClientAuth(hygraphClient);

export async function getProducts() {
  const { products } = await hygraphClient.request(
    `
      query getProducts {
        products {
          imageUrl
          name
          price
          slug
        }
      }
    `
  );

  return products;
}

export async function publishSession(token) {
  await authHygraphClient.request(
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
}

export async function publishClient(confirmToken) {
  return await authHygraphClient.request(
    `
      mutation PublishClient($confirmToken: String!) {
        publishClient(where: {confirmToken: $confirmToken}) {
            id
            email
        }
      }
    `,
    {
      confirmToken,
    }
  );
}

export async function createSession({ email, token }) {
  await authHygraphClient.request(
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
      email,
      token,
    }
  );
}

export async function createProduct(product) {
  await authHygraphClient.request(
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

export async function createClient({ email, confirmToken }) {
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
}

export default hygraphClient;
