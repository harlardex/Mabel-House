import { Link, useLocation, NavLink } from "react-router-dom";
import { Search, ShoppingCart, Home, Store, Phone, ShoppingBag } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.png"
import ProfileButton from "../ui/ProfileButton";



function Navbar() {

    const { user } = useAuth();
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const isAdminPages = location.pathname.startsWith("/admin");
    const { cartCount, setIsCartOpen } = useCart();

    return (
        <>


            {/* Mobile Navbar */}
            <nav className={`sm:hidden ${isAdminPages ? "hidden" : "block"}`}>
                <div className="fixed top-0 left-0 w-full z-55 flex justify-between items-center px-4 py-3 bg-white/80 backdrop-blur-lg">
                    <Link to="/" className="flex items-center">
                        <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
                    </Link>

                    {user?.role === "ADMIN" && (
                        <Link to="/admin" className=" border p-1 rounded-md cursor-pointer">
                            Admin Dashboard
                        </Link>
                    )}

                    <div className="relative cursor-pointer">
                        <ShoppingCart onClick={() => setIsCartOpen(true)} />
                        {cartCount > 0 && (
                            <span className="absolute text-xs -top-2 -right-2 text-white flex items-center justify-center h-4 w-4 bg-red-400 rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 w-full z-55 flex justify-around items-center px-2 py-3 bg-white/90 backdrop-blur-lg border-t shadow-lg">
                    <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-primary-text" : "text-black"}`}>
                        <Home size={22} />
                        <span>Home</span>
                    </NavLink>

                    <NavLink to="/shop" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-primary-text" : "text-black"}`}>
                        <Store size={22} />
                        <span>Shop</span>
                    </NavLink>

                    <NavLink to="/contact" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-primary-text" : "text-black"}`}>
                        <Phone size={22} />
                        <span>Contact</span>
                    </NavLink>

                    <NavLink to="/orders" className={({ isActive }) => `flex flex-col items-center gap-1 text-xs ${isActive ? "text-primary-text" : "text-black"}`}>
                        <ShoppingBag size={22} />
                        <span>Orders</span>
                    </NavLink>

                    <div className="flex flex-col items-center gap-1 text-xs">
                        <ProfileButton />
                        <span>Profile</span>
                    </div>
                </div>
            </nav>



            <nav className={`hidden top-0 w-full backdrop-blur-lg z-10 sm:flex justify-end items-center gap-20 p-4 px-15 *:text-lg ${isHomePage ? "fixed" : "sticky"}`}>
                <div className=" absolute left-4 md:left-1/2 md:-translate-x-1/2 flex gap-10 ">
                    <NavLink className={({ isActive }) => `${isActive ? "text-primary-text" : "text-black"}`} to="/">Home</NavLink>
                    <NavLink className={({ isActive }) => `${isActive ? "text-primary-text" : "text-black"}`} to="/shop">Shop</NavLink>
                    <NavLink className={({ isActive }) => `${isActive ? "text-primary-text" : "text-black"}`} to="/contact">Contact</NavLink>
                </div>
                <div className=" flex gap-8 *:cursor-pointer">
                    <ProfileButton />
                    <Search />
                    <NavLink className={({ isActive }) => `${isActive ? "text-primary-text" : "text-black"}`} to="/orders"><ShoppingBag /></NavLink>
                    <div className="relative">
                        <ShoppingCart onClick={() => setIsCartOpen(true)} />
                        {cartCount > 0 && (
                            <span className="absolute text-sm -top-2 -right-2 text-white flex items-center justify-center h-4 w-4 bg-red-400 rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
                {user?.role === "ADMIN" && (
                    <Link to="/admin" className="absolute top-13 md:top-3 left-4 border p-1 rounded-md cursor-pointer">
                        Admin Dashboard
                    </Link>
                )}
            </nav>
        </>
    )
}

export default Navbar;