import { Link, useLocation } from "react-router-dom";

function Footer() {
    const location = useLocation();
    const isAdminPages = location.pathname.startsWith("/admin");

    return (

        <div className={`${isAdminPages ? "hidden" : "block"}`}>
            {/* Services Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 px-5 sm:px-8 md:px-10 lg:px-15 py-8 bg-primary">
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                        Free Delivery
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg text-secondary-text">
                        For all orders over $50, consectetur adipiscing elit.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                        90 Days Returns
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg text-secondary-text">
                        If goods have problems, consectetur adipiscing elit.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                        Secure Payment
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg text-secondary-text">
                        100% secure payment processing, consectetur adipiscing elit.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-5 sm:px-8 md:px-10 lg:px-15">
                <div className="flex flex-col gap-8 md:gap-10 py-10">
                    <div className="text-secondary-text">
                        <h3>
                            400 University Drive Suite 200 Coral Gables,
                            <br />
                            FL 33134 USA
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 lg:gap-10">
                        <div>
                            <h3 className="mb-5 sm:mb-8 text-secondary-text">
                                Links
                            </h3>

                            <ul className="flex flex-col gap-4 md:gap-8">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/shop">Shop</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="mb-5 sm:mb-8 text-secondary-text">
                                Help
                            </h3>

                            <ul className="flex flex-col gap-4 md:gap-8">
                                <li>Payment Options</li>
                                <li>Shipping & Delivery</li>
                                <li>Returns & Exchanges</li>
                                <li>FAQ</li>
                            </ul>
                        </div>

                        <div className="col-span-2 sm:col-span-1 min-w-0">
                            <h3 className="mb-5 sm:mb-8 text-secondary-text">
                                Newsletter
                            </h3>

                            <form className="flex flex-wrap sm:flex-nowrap gap-3 *:border-b text-sm *:p-2 w-full">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="min-w-0 flex-1"
                                />

                                <button
                                    className="cursor-pointer shrink-0"
                                    type="submit"
                                >
                                    SUBSCRIBE
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <hr className="opacity-30" />

                <div>
                    <p className="py-5 text-sm sm:text-base">
                        &copy; 2022 Meubel House. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>

    );
}

export default Footer;