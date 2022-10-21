import Product from "../components/Product";
import hygraphClient from "../libs/hygraphClient";

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

  return {
    props: { products }, // will be passed to the page component as props
  };
}
