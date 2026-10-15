import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { Trash2, Plus, Minus } from "lucide-react";
import banner from "../assets/banner.png";
import logo from "../assets/logo.png";

function Cart() {

    const {
        cart,
        loading,
        updateCartQuantity,
        removeFromCart,
        cartTotal,
    } = useCart();

    if(loading){
        return(
            <div className="flex justify center py-20">
                <p>Loading cart...</p>
            </div>
        );
    }

    if(cartTotal.length === 0) {
        return(
            <div className="text-center py-20">
                <h1 className="text-3xl font-medium">Your cart is empty</h1>
                <p>You haven't added anything to your cart yet.</p>
                <Link to="/shop">Continue Shopping</Link>
            </div>
        )
    }

    return (
        <>
            <header
                className="flex flex-col items-center justify-center bg-cover bg-center h-80"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <img src={logo} alt="Logo" />

                <h2 className="text-5xl font-medium -translate-y-2">
                    Cart
                </h2>

                <p>
                    <Link to="/" className="font-medium">
                        Home
                    </Link>{" "}
                    ❯ Cart
                </p>
            </header>

            <main className="flex p-15 gap-10">
                <aside className="flex-2 overflow-x-auto">

                    <table className="w-full min-w-200">
                        <thead className="bg-secondary">
                            <tr className="*:p-4">
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>SubTotal</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.items.map((item, index) => (
                                <tr key={item.cartItemId}
                                    className="border-b *:pl-4">
                                    <td>
                                        <div className="flex gap-2 items-center">
                                            <div className="h-20 w-20 flex items-center rounded">
                                                <img src={item?.image} alt={item.productName}
                                                className="h-17 w-18 object-cover bg-secondary" />
                                            </div>
                                            <div>
                                                <p>{item.productName} <br />
                                                    {item?.variantLabel && (
                                                        <span>
                                                            ({item.variantLabel.split("/")[0].trim()})
                                                        </span>
                                                    )}
                                                </p>

                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        ${item.unitPrice.toLocaleString()}
                                    </td>

                                    <td className="items-center">
                                        <div className="flex justify-around rounded-lg py-1 border w-[70%] *:cursor-pointer">
                                            <button onClick={() => {
                                                if(item.quantity > 1) {
                                                    updateCartQuantity(index, item.quantity - 1);
                                                }
                                            }}><Minus /></button>

                                            <span>{item.quantity}</span>

                                            <button onClick={() => {
                                                if(item.quantity > 1) {
                                                    updateCartQuantity(index, item.quantity + 1);
                                                }
                                            }}><Plus /></button>
                                        </div>
                                    </td>

                                    <td>
                                        $ {(item.unitPrice * item.quantity).toLocaleString()}
                                    </td>

                                    <td>
                                        <button onClick={() => {
                                            removeFromCart(index)
                                        }} className="cursor-pointer"><Trash2 /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </aside>

                <aside className="flex flex-col justify-around w-[25%] min-h-50 bg-secondary rounded text-center">
                    <h2 className="text-3xl font-medium">Cart Totals</h2>
                    <div className="flex justify-around">
                        <p>Total</p>
                        <span className="text-xl font-medium">$ {cartTotal.toLocaleString()}</span>
                    </div>
                    <button >
                        <Link to="/checkout" className="text-lg border py-2 px-5 rounded-md">Check Out</Link>
                    </button>
                </aside>
            </main>
        </>
    )
}

export default Cart;