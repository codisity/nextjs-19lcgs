export default function Product({ product: { title, price, image } }) {
  return (
    <>
      <div className="bg-gray-100 rounded-md overflow-hidden p-4 group">
        <div className="w-full aspect-square overflow-hidden rounded-sm flex justify-center items-center bg-white">
          <img src={image} alt={title} />
        </div>

        <div className="mt-4">
          <p className="whitespace-nowrap text-ellipsis overflow-hidden text-lg font-semibold">
            {title}
          </p>

          <div className="flex justify-between mt-2">
            <p className="text-lg">{price} zł</p>
            <button className="text-gray-800 bg-gray-200 hover:bg-gray-300 font-semibold rounded-sm py-1 px-2.5">
              Do koszyka
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
