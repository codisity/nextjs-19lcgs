import { getCartItems } from "../libs/hygraphClient";
import { getSessionCookie } from "../libs/cookies";
import { getClientBySession } from "../libs/hygraphClient";

export default function CartPage({ cartItems }) {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Koszyk</h1>

      {cartItems.length < 1 && <p>Koszyk jest pusty</p>}

      <ul className="flex flex-col gap-4">
        {cartItems.map((item, index) => {
          const { products } = item;
          const [product] = products;
          const { name, imageUrl, price } = product;
          return (
            <li key={index} className="flex gap-4 items-center">
              <img src={imageUrl} alt="" className="max-h-12" />
              <span>{name}</span>
              <span>{price} zł</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  try {
    const sessionToken = getSessionCookie({ req, res });
    const { email } = await getClientBySession(sessionToken);
    const cartItems = await getCartItems({ email });

    return {
      props: { cartItems },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {},
    };
  }
}
