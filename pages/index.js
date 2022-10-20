import Product from "../components/Product";
import { GraphQLClient } from "graphql-request";

export default function Home({ products }) {
  return (
    <>
      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <Product key={index} product={product} />
        ))}
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const hygraph = new GraphQLClient(
    "https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/cl9h8c4dy07c401uhbm7r8lbm/master"
  );

  const { products } = await hygraph.request(
    `
      query getProducts {
        products {
          name
          price
          slug
        }
      }
    `
  );

  return {
    props: { products }, // will be passed to the page component as props
  };
}
