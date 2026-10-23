import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { BASE_URL } from "../services/api";
import { Link } from "react-router-dom";
import {
    Package,
    RefreshCw,
    ShoppingBag,
    MapPin,
} from "lucide-react";
import Loader from "../components/ui/Loader";
import notify from "../components/ui/notify";


const statusStyles = {
    PENDING: "bg-amber-100 text-amber-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    CONFIRMED: "bg-indigo-100 text-indigo-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    PAID: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    REFUNDED: "bg-gray-100 text-gray-700",
};

const formatCurrency = (amount, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
        ? "Date unavailable"
        : parsed.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
};

export default function Orders() {

    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("accessToken");

    const getOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`${BASE_URL}/orders`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || `Server error: ${res.status}`
                );
            }

            const list = data.data;
            setOrders(list);

        } catch (error) {
            setError(error.message || "Failed to fetch orders");
            console.error(error)
        } finally {
            setLoading(false);
        }
    }, []);

    if(user) {
        useEffect(() => {
            getOrders();
        }, [getOrders]);
    }

    // Delete product
    const handleCancel = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        try {
            const response = await fetch(`${BASE_URL}/orders/${id}/cancel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to cancel order");
            }
            notify.info("Order cancelled")
        } catch (error) {
            console.error(error);
        }



        if (!confirmed) {
            getOrders
        };

    };

    const filteredOrders =
        selectedStatus === "ALL"
            ? orders
            : orders.filter(
                (order) => order.orderStatus === selectedStatus
            );

    if (!user) return <Loader message="Login to see orders" />

    if (loading) return <Loader />;


    if (error) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-12 text-center">
                <p className="mb-4 text-red-600">{error}</p>
                <button
                    onClick={getOrders}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-white"
                >
                    <RefreshCw size={16} />
                    Try again
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 mt-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            My Orders
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Track your purchases and delivery status.
                        </p>
                    </div>

                    <button
                        onClick={getOrders}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm hover:bg-gray-100"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                    {[
                        "ALL",
                        "PENDING",
                        "PROCESSING",
                        "CONFIRMED",
                        "SHIPPED",
                        "DELIVERED",
                        "CANCELLED",
                    ].map((item) => (
                        <button
                            key={item}
                            onClick={() => setSelectedStatus(item)}
                            className={`rounded-full px-4 py-2 text-xs font-medium transition cursor-pointer ${selectedStatus === item
                                ? "bg-secondary"
                                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {item === "ALL"
                                ? "All Orders"
                                : item.charAt(0) + item.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="rounded-xl border border-gray-100 bg-white px-6 py-16 text-center">
                        <ShoppingBag
                            size={42}
                            className="mx-auto mb-4 text-gray-300"
                        />

                        <h2 className="text-lg font-semibold text-gray-800">
                            {orders.length === 0
                                ? "You haven't placed any orders yet"
                                : "No orders with this status"}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {orders.length === 0
                                ? "Your purchases will appear here."
                                : "Choose another status to see your orders."}
                        </p>

                        {orders.length === 0 && (
                            <Link
                                to="/shop"
                                className="mt-6 inline-block rounded-lg bg-secondary px-5 py-3 text-sm font-medium"
                            >
                                Explore products
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-5">
                        {filteredOrders.map((order) => (
                            <article
                                key={order.id}
                                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
                            >
                                {/* Order header */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5">
                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Order number
                                        </p>

                                        <h2 className="mt-1 font-semibold text-gray-900">
                                            {order.orderNumber}
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Placed on {formatDate(order.createdAt)}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-start gap-2 sm:items-end">
                                        <div>
                                            <span
                                                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[order.orderStatus] ||
                                                    "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {order.orderStatus}
                                            </span>
                                            {order.orderStatus !== "CANCELLED" && (
                                                <button className="rounded-full ml-2 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer bg-red-400"
                                                    onClick={() => handleCancel(order.id)}>Cancel</button>
                                            )}
                                        </div>



                                        {order.orderStatus !== "CANCELLED" && (
                                            <span className="text-xs text-gray-500">
                                                Payment: {order.paymentStatus}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Ordered products */}
                                <div className="space-y-4 p-5">
                                    {(order.items || []).map((item, index) => (
                                        <div
                                            key={`${order.id}-${item.productId}-${item.variantId ?? index}`}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.productName}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Package
                                                        size={24}
                                                        className="text-gray-400"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-medium text-gray-900">
                                                    {item.productName}
                                                </h3>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    SKU: {item.sku}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Quantity: {item.quantity}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Unit price:{" "}
                                                    {formatCurrency(
                                                        item.unitPrice,
                                                        order.currency
                                                    )}
                                                </p>
                                            </div>

                                            <p className="shrink-0 text-sm font-medium text-gray-800">
                                                {formatCurrency(
                                                    item.subtotal,
                                                    order.currency
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Delivery details */}
                                <div className="border-t border-gray-100 px-5 py-4">
                                    <div className="flex items-start gap-2">
                                        <MapPin
                                            size={17}
                                            className="mt-0.5 shrink-0 text-gray-400"
                                        />

                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                Delivery address
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {[
                                                    order.shippingAddress?.street,
                                                    order.shippingAddress?.city,
                                                    order.shippingAddress?.state,
                                                    order.shippingAddress?.zipCode,
                                                    order.shippingAddress?.country,
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ") || "No address provided"}
                                            </p>

                                            <p className="mt-2 text-xs text-gray-500">
                                                Delivery status:{" "}
                                                {order.deliveryStatus || "Not specified"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order total */}
                                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 bg-gray-50 px-5 py-4">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            {order.items?.reduce(
                                                (sum, item) =>
                                                    sum + (Number(item.quantity) || 0),
                                                0
                                            )}{" "}
                                            item(s)
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Delivery:{" "}
                                            {formatCurrency(
                                                order.deliveryFee,
                                                order.currency
                                            )}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            Order total
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-gray-900">
                                            {formatCurrency(order.total, order.currency)}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
