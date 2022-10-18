export default function Product({ product: { title, price, image } }) {
  return (
    <>
      <div class="bg-gray-100 rounded-md overflow-hidden p-4 group">
        <div class="w-full aspect-square overflow-hidden rounded-sm flex justify-center items-center bg-white">
          <img src={image} alt={title} />
        </div>

        <div class="mt-4">
          <p class="whitespace-nowrap text-ellipsis overflow-hidden text-lg font-semibold">
            {title}
          </p>

          <div class="flex justify-between mt-2">
            <p class="text-lg">{price} zł</p>
            <button class="text-gray-800 bg-gray-200 hover:bg-gray-300 font-semibold rounded-sm py-1 px-2.5">
              Do koszyka
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
