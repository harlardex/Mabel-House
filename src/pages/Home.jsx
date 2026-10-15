import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import Loader from "../components/ui/Loader";
import ProductGrid from "../components/products/ProductGrid";
import instagramBg from "../assets/instagram-bg.png";

function Home() {
    const { products, loading, error, newestProduct } = useProducts();
    // const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 4);

    if(loading) {
        return <div><Loader /></div>;
    }

    if(error) {
        return <div><Loader message={error} /></div>;
    }

    return (
        <>
        
            <header className="flex bg-secondary justify-center items-center h-screen">
                <div className="w-120 translate-y-20 translate-x-20">
                    <h2 className="text-6xl mb-8">{products[0]?.name}</h2> 
                    <button><Link to="/shop" className="border-b text-xl">Shop Now</Link></button>
                </div>
                <div className="">
                    <img src={products[0]?.images?.[0]} alt={products[0]?.name} className="w-180 h-120 object-contain" />
                </div>
            </header>

            <section className="flex justify-center items-center p-15 gap-10 bg-accent">
                <div>
                    <img src={products[0]?.images?.[0]} alt={products[0]?.name} className="w-130 h-70 object-contain" />
                    <div className="translate-x-15 transtlate-y-15">
                        <h3 className="text-2xl font-bold mb-4">{products[0]?.name}</h3>
                        <button><Link to="/shop" className="border-b text-xl">View More</Link></button>
                    </div>
                </div>
                <div>
                    <img src={products[1]?.images?.[0]} alt={products[1]?.name} className="w-130 h-70 object-contain" />
                    <div className="translate-x-15 transtlate-y-15">
                        <h3 className="text-2xl font-bold mb-4">{products[1]?.name}</h3>
                        <button><Link to="/shop" className="border-b text-xl">View More</Link></button>
                    </div>
                </div>
            </section>

            <section className="p-15 text-center">
                <h2 className="text-3xl font-bold mb-4">Top Picks For You</h2>
                <p className="text-secondary-text text-md">Find a bright ideal to suit your taste with our great selection of suspension, floor, and table lights.</p>
                <div className="my-8">
                    <ProductGrid products={products.slice(0, 4)} />
                </div>
                <button><Link to="/shop" className="border-b text-2xl pb-2">View More</Link></button>
            </section>

            {newestProduct && (
                        <div className="flex justify-center items-center p-10 h-180 bg-[#fff9e5]">
                            <div className="flex-2 pointer-events-none">
                                <img src={newestProduct.images?.[1]} alt={newestProduct.name} className="w-full h-100 object-contain -translate-y-15" />
                            </div>
                            <div className="flex-1 text-center">
                                <p className="text-xl font-medium ">New Arrivals</p>
                                <h2 className="text-4xl font-bold my-5">{newestProduct.name}</h2>
                                <button className="mt-5 relative z-10"><Link to="/shop" className="border text-xl px-10 py-3">Order Now</Link></button>
                            </div>
                        </div>
            )}

            <section className="p-15 text-center">
                <h2 className="text-3xl font-bold mb-4">Our Blogs</h2>
                <p className="text-secondary-text text-md">Find a bright idea to suit your taste ithe our great selection</p>

                <button><Link to="/blog" className="border-b text-2xl pb-2">View All Post</Link></button>
            </section>

            <section className="flex flex-col items-center justify-center p-15 h-110 text-center bg-cover" style={{ backgroundImage: `url(${instagramBg})` }}>
                <h3 className="text-6xl font-bold">Our Instagram</h3>
                <p className="text-lg my-5">Follow our store on instagram</p>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                    <button className="text-2xl w-60 p-3 shadow-lg hover:shadow-xl rounded-full bg-primary">Follow Us</button>
                </a>
            </section>

        </>
    )
}

export default Home;