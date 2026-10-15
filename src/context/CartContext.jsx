import { createContext, useEffect, useState } from "react";
import { BASE_URL } from "../services/api"
import notify from "../components/ui/notify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    id: null,
    items: [],
  });
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const token = localStorage.getItem("refreshToken");

  // Get cart from back
  const getCart = async () => {
    try {
        setLoading(true);

        const response = await fetch(`${BASE_URL}/cart`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        if(!response.ok) {
            throw new Error("Failed to get cart");
        }

        const data = await response.json();
        setCart(data.cart);
        
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  }

  // Add product to cart
  const addToCart = async (productId, quantity = 1, variant = null) => {
    try {
        const response = await fetch(`${BASE_URL}/cart/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                productId,
                quantity,
                ...(variant && { variantId: variant.id }),
            }),

        });

        if(!response.ok) {
            notify.error("Failed to add product")
            throw new Error("Failed to add product");
        }

        
        const data = await response.json();

        notify.success("Product added to cart")
        setCart(data.cart);
        return data;

    } catch (error) {
        console.error(error);
    }
  }

  // Update quantity
  const updateCartQuantity = async (index, quantity) => {
    try {
        const response = await fetch(`${BASE_URL}/cart/items/${index}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                quantity,
            }),
        });
        if(!response.ok) {
            notify.error("Failed to update cart")
            throw new Error("Failed to update cart");
        }
        const data = await response.json();

        notify.info("Cart updated")
        setCart(data.cart);

    } catch (error) {
        console.error(error);
    }
  }

  // Delete an item
  const removeFromCart = async (index) => {
    try {
        const response = await fetch(`${BASE_URL}/cart/items/${index}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if(!response.ok) {
            notify.error("Failed to delete item")
            throw new Error("Failed to remove item");
        }

        const data = await response.json();

        notify.info("Item removed")
        setCart(data.cart);

    } catch (error) {
        console.error(error);
    }
  }

  // Get total number of items
    const cartCount = cart.items.reduce(
        (total, item) => total + item.quantity, 0
    );

    // Get total price 
    const cartTotal = cart.items.reduce(
        (total, item) => total + item.unitPrice * item.quantity, 0
    )

    useEffect(() => {
        getCart();
    }, []);

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            isCartOpen,
            cartCount,
            cartTotal,
            setIsCartOpen,
            addToCart,
            removeFromCart,
            updateCartQuantity,
        }}>
            {children}
        </CartContext.Provider>
    );
};
