import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import Loader from "../components/ui/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import RatingStars from "../components/ui/Stars";
import ProductGrid from "../components/products/ProductGrid";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const product = products.find((product) => product.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantError, setVariantError] = useState("");
  const variants = product?.variants ?? [];
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const displayPrice = selectedVariant
    ? selectedVariant?.price
    : product?.price;
  const allRelatedProducts = products.filter(
    (p) => p.category === product?.category && p.id !== product?.id,
  );

  const relatedProducts = allRelatedProducts.sort(
    () => 0.5 - Math.random()
  ).slice(0, 4);

  const handleAddToCart = async () => {
    if (variants.length > 0 && !selectedVariant) {
      setVariantError("Please select a variant before adding to cart.");
      return;
    }
    await addToCart(product.id, quantity, selectedVariant)
  }

  if (loading) {
    return <div><Loader /></div>;
  }

  if (!product) {
    return <div><Loader message={error} /></div>;
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
                className={`w-20 h-20 border sm:flex mr-2 sm:mb-5 bg-secondary rounded cursor-pointer ${selectedImage === index ? "border-black" : "border-gray-200"
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
          <h2 className="text-2xl sm:text-4xl font-semibold">{product.name}</h2>
          <div className="flex gap-4 items-end">
            {product?.compareAtPrice != null && (
              <span className="text-gray-500 line-through">
                ${Number(product.compareAtPrice).toFixed(2)}
              </span>
            )}
            <h3 className="text-2xl text-primary-text font-medium">${Number(displayPrice).toFixed(2)}</h3>
          </div>
          <div className="flex gap-5 items-center">
            <div>
              <RatingStars rating={product.rating} />
            </div>
            {/* <p className="border-l pl-5 text-secondary-text">
              {product?.reviews.length} Customer Reviews
            </p> */}
          </div>
          <p>{product.description}</p>

          {variants.length > 0 && (
            <div>
              <p>Choose a variant:</p>

              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setVariantError("");
                  }}
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
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-2 text-xl"
              >
                −
              </button>

              <span className="px-4 py-2">{quantity}</span>

              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-3 py-2 text-xl"
              >
                +
              </button>
            </div>
            <button className="border border-gray-300 px-4 py-2 text-lg rounded-lg cursor-pointer hover:bg-gray-100 transition"
              onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

          <hr />

          <div className="text-secondary-text">
            <div className="flex gap-3 mb-2">
              <p className="w-20">SKU</p> <span>: {product.sku}</span>
            </div>
            <div className="flex gap-3 mb-2">
              <p className="w-20">Category</p> <span>: {product.category.description}</span>
            </div>
            <div className="flex gap-3 mb-2">
              <p className="w-20">Tags</p>{" "}
              <span>: {product.tags.join(", ")}</span>
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

      {/* <section className="p-10 w-[75%] mx-auto">
            <div className="flex gap-10 justify-center items-center mb-8 *:text-lg">
                <button
                    onClick={() => setActiveTab("description")}
                    className={activeTab === "description" ? "border-b" : "text-secondary-text"}
                >
                    Description
                </button>
                <button
                    onClick={() => setActiveTab("additional-info")}
                    className={activeTab === "additional-info" ? "border-b" : "text-secondary-text"}
                >
                    Additional Information
                </button>
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={activeTab === "reviews" ? "border-b" : "text-secondary-text"}
                >
                    Reviews [{product.reviews.length}]
                </button>
            </div>
            {activeTab === "description" && <p>{product.description}</p>}
            {activeTab === "additional-info" && <p>{product.additionalInfo}</p>}
            {activeTab === "reviews" && (
                <div>
                    {product.reviews.map((review) => (
                        <div key={review.id} className="border-b py-4">
                            <RatingStars rating={review.rating} />
                            <p>{review.comment}</p>
                            <p className="text-sm mt-2 text-secondary-text">
                                {new Date(review.date).toLocaleDateString()} by {review.reviewerName}
                            </p>
                        </div>
                    ))}
                </div>
            )}
      </section> */}

      <section className="p-15 text-center">
        <h2 className="text-3xl font-semibold mb-4">Related Products</h2>
        <div className="my-8">
          <ProductGrid products={relatedProducts} />
        </div>
        <button><Link to="/shop" className="border-b text-2xl pb-2">View More</Link></button>
      </section>
    </>
  );
}

export default ProductDetails;
