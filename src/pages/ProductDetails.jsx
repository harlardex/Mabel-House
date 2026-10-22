
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import Loader from "../components/ui/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import RatingStars from "../components/ui/Stars";
import ProductGrid from "../components/products/ProductGrid";

function ProductDetails() {
  const { id } = useParams();
  const { cart, addToCart, removeFromCart } = useCart();
  const { products, loading, error } = useProducts();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantError, setVariantError] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);

  const product = products.find((item) => item.id === id);

  const variants = product?.variants ?? [];
  const hasVariants = variants.length > 0;

  const inventoryItem = product?.inventory?.find((item) =>
    hasVariants
      ? item.variantId === selectedVariant?.id
      : item.variantId === null || item.variantId == null
  );

  const availableQuantity = inventoryItem?.availableQuantity ?? 0;

  const displayPrice = selectedVariant?.price ?? product?.price;

  const isInCart = product
    ? hasVariants
      ? Boolean(
        selectedVariant &&
        (cart?.items ?? []).some(
          (item) =>
            item.productId === product.id &&
            item.variantId === selectedVariant.id
        )
      )
      : (cart?.items ?? []).some(
        (item) =>
          item.productId === product.id &&
          item.variantId == null
      )
    : false;

  const allRelatedProducts = product
    ? products.filter(
      (item) =>
        item.category?.id === product.category?.id &&
        item.id !== product.id
    )
    : [];

  const relatedProducts = allRelatedProducts
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
    setVariantError("");
  };

  const handleAddToCart = async () => {
    if (hasVariants && !selectedVariant) {
      setVariantError("Please select a variant before adding to cart.");
      return;
    }

    if (isInCart) {
      const cartItemIndex = (cart?.items ?? []).findIndex(
        (item) =>
          item.productId === product.id &&
          (item.variantId ?? null) ===
          (hasVariants ? selectedVariant?.id : null)
      );

      if (cartItemIndex !== -1) {
        await removeFromCart(cartItemIndex);
      }

      return;
    }

    if (availableQuantity <= 0) {
      setVariantError("This item is currently out of stock.");
      return;
    }

    if (quantity > availableQuantity) {
      setVariantError(
        `Only ${availableQuantity} item(s) are available.`
      );
      return;
    }

    setVariantError("");
    await addToCart(product.id, quantity, selectedVariant);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="p-8 text-red-600">Failed to load products.</p>;
  }

  if (!product) {
    return <p className="p-8">Product not found.</p>;
  }

  return (
    <>
      <nav className="flex mt-10 gap-5 p-8">
        <Link to="/" className="text-secondary-text">
          Home
        </Link>
        ❯
        <Link to="/shop" className="text-secondary-text">
          Shop
        </Link>
        <p className="border-l pl-3">{product.name}</p>
      </nav>

      <main className="flex flex-col sm:flex-row gap-10 p-5 sm:p-10 border-b pb-8">
        <aside className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-5 sm:w-[50%]">
          <div>
            {product.images?.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 border sm:flex mr-2 sm:mb-5 bg-secondary rounded cursor-pointer ${selectedImage === index
                  ? "border-black"
                  : "border-gray-200"
                  }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div>
            <img
              src={product.images?.[selectedImage]}
              alt={product.name}
              className="w-150 object-contain bg-secondary rounded"
            />
          </div>
        </aside>

        <aside className="sm:w-[35%] flex flex-col gap-5">
          <h2 className="text-2xl sm:text-4xl font-semibold">
            {product.name}
          </h2>

          <div className="flex gap-4 items-end">
            {product.compareAtPrice != null && (
              <span className="text-gray-500 line-through">
                ${Number(product.compareAtPrice).toFixed(2)}
              </span>
            )}

            <h3 className="text-2xl text-primary-text font-medium">
              ${Number(displayPrice ?? 0).toFixed(2)}
            </h3>
          </div>

          <div className="flex gap-5 items-center">
            <RatingStars rating={product.rating} />
          </div>

          <p>{product.description}</p>

          <div className="mt-3 text-sm">
            {hasVariants && !selectedVariant ? (
              <p className="text-gray-500">
                Select a variant to see available quantity
              </p>
            ) : (
              <>
                <span className="font-medium text-lg mr-3">
                  {availableQuantity}
                </span>

                <span
                  className={
                    availableQuantity > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {availableQuantity > 0 ? "In stock" : "Out of stock"}
                </span>
              </>
            )}
          </div>

          {hasVariants && (
            <div>
              <p>Choose a variant:</p>

              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantChange(variant)}
                  className={`border rounded px-4 py-2 mr-2 cursor-pointer ${selectedVariant?.id === variant.id
                    ? "border-black bg-gray-200"
                    : "border-gray-300"
                    }`}
                >
                  {variant.colour}
                </button>
              ))}
            </div>
          )}

          {variantError && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {variantError}
            </p>
          )}

          <div className="flex gap-5 items-center">
            <div className="flex items-center border border-gray-300 w-fit rounded-lg">
              <button
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
                disabled={quantity <= 1}
                className="px-3 py-2 text-xl disabled:opacity-40"
              >
                −
              </button>

              <span className="px-4 py-2">{quantity}</span>

              <button
                onClick={() => {
                  if (quantity < availableQuantity) {
                    setQuantity((prev) => prev + 1);
                  }
                }}
                disabled={
                  (hasVariants && !selectedVariant) ||
                  quantity >= availableQuantity
                }
                className="px-3 py-2 text-xl disabled:opacity-40"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!isInCart && availableQuantity <= 0}
              className="border border-gray-300 px-4 py-2 text-lg rounded-lg cursor-pointer hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInCart ? "Remove from Cart" : "Add to Cart"}
            </button>
          </div>

          <hr />

          <div className="text-secondary-text">
            <div className="flex gap-3 mb-2">
              <p className="w-20">SKU</p>
              <span>: {product.sku}</span>
            </div>

            <div className="flex gap-3 mb-2">
              <p className="w-20">Category</p>
              <span>: {product.category?.description ?? product.category?.name ?? "N/A"}</span>
            </div>

            <div className="flex gap-3 mb-2">
              <p className="w-20">Tags</p>
              <span>: {(product.tags ?? []).join(", ")}</span>
            </div>

            <div className="flex gap-3 mb-2">
              <p className="w-20">Share</p>
              <span>
                : <FontAwesomeIcon icon={faFacebook} />{" "}
                <FontAwesomeIcon icon={faLinkedin} />{" "}
                <FontAwesomeIcon icon={faTwitter} />
              </span>
            </div>
          </div>
        </aside>
      </main>

      <section className="p-15 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Related Products
        </h2>

        <div className="my-8">
          <ProductGrid products={relatedProducts} />
        </div>

        <Link
          to="/shop"
          className="inline-block border-b text-2xl pb-2"
        >
          View More
        </Link>
      </section>
    </>
  );
}

export default ProductDetails;