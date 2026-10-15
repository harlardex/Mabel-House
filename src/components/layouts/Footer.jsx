import { Link, useLocation } from "react-router-dom";

function Footer() {
    const location = useLocation();
    const isAdminPages = location.pathname.startsWith("/admin");

    return (
        <div className={`${isAdminPages ? "hidden" : "block"}`}>
            <section className="flex justify-around items-center gap-15 px-15 py-8 bg-primary">
                <div>
                    <h2 className="text-3xl font-semibold">
                        Free Delivery
                    </h2>

                    <p className="text-xl text-secondary-text">
                        For all orders over $50, consectetur adipiscing elit.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-semibold">
                        90 Days Returns
                    </h2>

                    <p className="text-xl text-secondary-text">
                        If goods have problems, consectetur adipiscing elit.
                    </p>
                </div>

                <div>
                    <h2 className="text-3xl font-semibold">
                        Secure Payment
                    </h2>

                    <p className="text-xl text-secondary-text">
                        100% secure payment processing, consectetur adipiscing elit.
                    </p>
                </div>
            </section>
            <footer className={`px-18 pt-10 ${isAdminPages ? "hidden" : "block"}`}>
                <div className="flex justify-between items-start py-10">
                    <div className="h-full my-auto text-secondary-text">
                        <h3>400 University Drive Suite 200 Coral Gables,<br /> FL 33134 USA</h3>
                    </div>
                    <div>
                        <h3 className="mb-8 text-secondary-text">Links</h3>
                        <ul className="flex flex-col gap-8">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-8 text-secondary-text">Help</h3>
                        <ul className="flex flex-col gap-8">
                            <li>Payment Options</li>
                            <li>Shipping & Delivery</li>
                            <li>Returns & Exchanges</li>
                            <li>FAQ</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-8 text-secondary-text">Newsletter</h3>
                        <form className="flex gap-3 *:border-b text-sm *:p-2">
                            <input type="email" placeholder="Enter your email" />
                            <button className="cursor-pointer" type="submit">SUBSCRIBE</button>
                        </form>
                    </div>
                </div>
                <hr className="opacity-30" />
                <div>
                    <p className="py-5">&copy; 2022 Meubel House. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Footer;