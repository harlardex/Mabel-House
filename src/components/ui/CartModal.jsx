import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { Trash2 } from "lucide-react";

const CartModal = () => {
    const {
        cart,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
    } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-200 bg-black/40"
              onClick={() => setIsCartOpen(false)} >
            <div className="absolute right-0 top-0 h-3/4 w-full max-w-md bg-white p-6"
                 onClick={(e) => e.stopPropagation()}>

                <div className="flex items-center justify-between border-b">
                    <h2 className="text-2xl font-semibold mb-4">
                        Shopping Cart
                    </h2>

                    <button onClick={() => setIsCartOpen(false)}
                            className="cursor-pointer text-lg">
                        ✕
                    </button>
                </div>

                {cart.length === 0 ? (
                    <p className="mt-10 text-center">
                        Your cart is empty
                    </p>
                ) : (
                    <div className="mt-3 overflow-y-auto space-y-1">

                        {cart.items.map((item, index) => (
                            <div
                                key={item.cartItemId}
                                className="flex gap-4 border-b pb-4"
                            >
                                <img
                                    src={item?.image}
                                    alt={item.productName}
                                    className="h-20 w-20 object-cover bg-secondary"
                                />

                                <div className="flex-1 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">
                                            {item.productName}
                                        </h3>
                                        <div>
                                        <p className="flex gap-3 item-center"><span>{item.quantity} </span>x <span className="text-primary-text font-medium">${item.unitPrice}</span></p>
                                        </div>

                                    </div>

                                    <button
                                        onClick={() => removeFromCart(index)}
                                        className="mt-2 text-sm text-red-500 cursor-pointer"
                                    >
                                        <Trash2 />
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                )}

                <div className="absolute bottom-0 left-0 w-full bg-white">
                    <div className="mb-4 flex justify-between border-b border-gray-400 p-3">
                        <span>SubTotal</span>

                        <span className="text-primary-text font-medium text-xl">
                            ${cartTotal}
                        </span>
                    </div>

                    <div className="flex justify-around m-3 *:border *:py-1 *:px-3 *:rounded-full">
                        <Link onClick={() => setIsCartOpen(false)} to="/cart">View Cart</Link>
                        <Link onClick={() => setIsCartOpen(false)} to="/checkout">Checkout</Link>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default CartModal;