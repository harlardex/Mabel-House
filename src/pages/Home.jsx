import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import Loader from "../components/ui/Loader";
import ProductGrid from "../components/products/ProductGrid";
import instagramBg from "../assets/instagram-bg.png";

function Home() {
    const { products, loading, error, newestProduct } = useProducts();
    // const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 4);

    if (loading) {
        return <div><Loader /></div>;
    }

    if (error) {
        return <div><Loader message={error} /></div>;
    }

    return (

        <>
            {/* Hero Section */}
            <header className="flex flex-col md:flex-row bg-secondary justify-center items-center min-h-screen px-5 sm:px-8 md:px-10 lg:px-15 py-10 md:py-0 gap-6 md:gap-4">
                <div className="w-full md:flex-1 translate-y-0 translate-x-0 md:translate-y-10 md:translate-x-5 lg:translate-x-10 text-center md:text-left">
                    <h2 className="text-3xl sm:text-4xl lg:text-6xl mb-6 md:mb-8">
                        {products[0]?.name}
                    </h2>
                    <button>
                        <Link to="/shop" className="border-b text-lg sm:text-xl">
                            Shop Now
                        </Link>
                    </button>
                </div>

                <div className="w-full md:flex-1">
                    <img
                        src={products[0]?.images?.[0]}
                        alt={products[0]?.name}
                        className="w-full h-64 sm:h-80 md:h-96 lg:h-120 object-contain"
                    />
                </div>
            </header>

            {/* Featured Products */}
            <section className="grid grid-cols-2 justify-center items-start p-3 sm:p-6 md:p-10 lg:p-15 gap-3 sm:gap-6 md:gap-10 bg-accent">
                <div className="min-w-0">
                    <img
                        src={products[0]?.images?.[0]}
                        alt={products[0]?.name}
                        className="w-full h-36 sm:h-52 md:h-64 lg:h-70 object-contain"
                    />
                    <div className="mt-2 sm:mt-4 md:translate-x-5 lg:translate-x-15">
                        <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-4">
                            {products[0]?.name}
                        </h3>
                        <button>
                            <Link to="/shop" className="border-b text-sm sm:text-base md:text-xl">
                                View More
                            </Link>
                        </button>
                    </div>
                </div>

                <div className="min-w-0">
                    <img
                        src={products[1]?.images?.[0]}
                        alt={products[1]?.name}
                        className="w-full h-36 sm:h-52 md:h-64 lg:h-70 object-contain"
                    />
                    <div className="mt-2 sm:mt-4 md:translate-x-5 lg:translate-x-15">
                        <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-4">
                            {products[1]?.name}
                        </h3>
                        <button>
                            <Link to="/shop" className="border-b text-sm sm:text-base md:text-xl">
                                View More
                            </Link>
                        </button>
                    </div>
                </div>
            </section>

            {/* Top Picks */}
            <section className="flex flex-col items-center px-4 py-10 sm:p-8 md:p-10 lg:p-15">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    Top Picks For You
                </h2>
                <p className="text-secondary-text text-sm sm:text-base">
                    Find a bright ideal to suit your taste with our great selection of suspension, floor, and table lights.
                </p>

                <div className="my-8">
                    <ProductGrid products={products.slice(0, 4)} />
                </div>

                <button>
                    <Link to="/shop" className="border-b text-xl sm:text-2xl pb-2">
                        View More
                    </Link>
                </button>
            </section>

            {/* New Arrivals */}
            {newestProduct && (
                <div className="flex flex-col md:flex-row justify-center items-center px-5 py-10 sm:p-8 md:p-10 lg:p-15 min-h-125 md:min-h-150 lg:h-180 bg-[#fff9e5] gap-6 md:gap-4">
                    <div className="w-full md:flex-2 pointer-events-none">
                        <img
                            src={newestProduct.images?.[1]}
                            alt={newestProduct.name}
                            className="w-full h-64 sm:h-80 md:h-96 lg:h-100 object-contain md:-translate-y-5 lg:-translate-y-15"
                        />
                    </div>

                    <div className="w-full md:flex-1 text-center">
                        <p className="text-lg sm:text-xl font-medium">
                            New Arrivals
                        </p>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold my-5">
                            {newestProduct.name}
                        </h2>
                        <button className="mt-5 relative z-10">
                            <Link
                                to="/shop"
                                className="border text-lg sm:text-xl px-6 sm:px-10 py-3 inline-block"
                            >
                                Order Now
                            </Link>
                        </button>
                    </div>
                </div>
            )}

            {/* Blogs */}
            <section className="px-4 py-10 sm:p-8 md:p-10 lg:p-15 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    Our Blogs
                </h2>
                <p className="text-secondary-text text-sm sm:text-base mb-5">
                    Find a bright idea to suit your taste ithe our great selection
                </p>

                <button>
                    <Link to="/blog" className="border-b text-xl sm:text-2xl pb-2">
                        View All Post
                    </Link>
                </button>
            </section>

            {/* Instagram */}
            <section
                className="flex flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-20 min-h-70 sm:min-h-87.5 md:min-h-110 text-center bg-cover bg-center"
                style={{ backgroundImage: `url(${instagramBg})` }}
            >
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                    Our Instagram
                </h3>
                <p className="text-base sm:text-lg my-5">
                    Follow our store on instagram
                </p>

                <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button className="text-lg sm:text-2xl w-48 sm:w-60 p-3 shadow-lg hover:shadow-xl rounded-full bg-primary">
                        Follow Us
                    </button>
                </a>
            </section>
        </>

    )
}

export default Home;