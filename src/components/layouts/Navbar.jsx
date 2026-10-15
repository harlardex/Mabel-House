import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import ProfileButton from "../ui/ProfileButton";



function Navbar() {

    const { pathname } = useLocation();
    const { user } = useAuth();
    const isHomePage = pathname === "/";
    const { cartCount, setIsCartOpen } = useCart();

    return(
        <nav className={`top-0 w-full backdrop-blur-lg z-10 flex justify-end items-center gap-20 p-4 px-15 *:text-lg ${isHomePage ? "fixed" : "sticky"}`}>
            <div className=" absolute left-1/2 -translate-x-1/2 flex gap-10 ">
                <Link to="/">Home</Link>
                <Link to="/shop">Shop</Link>
                {/* <Link to="/about">About</Link> */}
                <Link to="/contact">Contact</Link>
            </div>
            <div className=" flex gap-8 *:cursor-pointer">
                <ProfileButton />
                <Search />
                <Heart />
                <div className="relative">
                    <ShoppingCart onClick={() => setIsCartOpen(true)} />
                    { cartCount > 0 && (
                        <span className="absolute text-sm -top-2 -right-2 text-white flex items-center justify-center h-4 w-4 bg-red-400 rounded-full">
                            {cartCount}
                        </span>
                    ) }
                </div>
            </div>
            {user?.role === "ADMIN" && (
                <Link to="/admin" className="absolute left-4 border p-1 rounded-md cursor-pointer">
                    Admin Dashboard
                </Link>
            )}
        </nav>
    )
}

export default Navbar;