import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`}>
      <div className="flex flex-col gap-5 h-full w-fit rounded-lg p-4 transition-transform duration-300 hover:scale-105">
        <div className="overflow-hidden rounded-lg">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="h-64 object-contain"
          />
        </div>

        <div className="mt-auto text-left">
          <p className="text-md">{product.name}</p>
        </div>

        <h3 className="mt-auto text-xl font-semibold">
          ${product.price}
        </h3>
      </div>
    </Link>
  )
};

export default ProductCard;