
import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 gap-8 justify-around sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}

export default ProductGrid;