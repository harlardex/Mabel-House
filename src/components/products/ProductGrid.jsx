
import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  return (
    <div className="grid gap-8 justify-around grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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