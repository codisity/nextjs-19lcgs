import Product from "../components/Product";

export default function Home({ products }) {
  return (
    <>
      <div class="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <Product key={index} product={product} />
        ))}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch(`https://fakestoreapi.com/products/`);
  const products = await res.json();

  return {
    props: { products }, // will be passed to the page component as props
  };
}
