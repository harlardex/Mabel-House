import { useMemo, useState, useCallback, useEffect } from "react";
import { BASE_URL } from "../../services/api";
import {
  Search,
  RefreshCw,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import Loader from "../../components/ui/Loader";


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
  if (!date) return "—";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
};

const getStatus = (order) =>
  String(order.orderStatus || "PENDING").toUpperCase();

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [updateError, setUpdateError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      setLoading(true);
      setError("");

      const res = await fetch(`${BASE_URL}/orders/admin/all`, {
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

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      setUpdateError("");

      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `${BASE_URL}/orders/admin/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderStatus: newStatus }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to update order status");
      }

      await getOrders();
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        status === "ALL" || getStatus(order) === status;

      const query = search.trim().toLowerCase();

      const matchesSearch = [
        order.orderNumber,
        order.customerId,
        order.id,
        order.salesChannel,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, status]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-6">
        <p className="mb-4 text-red-600">{error}</p>
        <button
          onClick={getOrders}
          className="rounded-lg bg-primary px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const pending = orders.filter(
    (order) => getStatus(order) === "PENDING"
  ).length;

  const delivered = orders.filter(
    (order) => getStatus(order) === "DELIVERED"
  ).length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer orders and track deliveries.
          </p>
        </div>

        <button
          onClick={getOrders}
          className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm hover:bg-gray-100"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Orders", value: orders.length },
          { label: "Pending Orders", value: pending },
          { label: "Delivered Orders", value: delivered },
          {
            label: "Order Value",
            value: formatCurrency(totalRevenue),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>
      {updateError && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {updateError}
        </p>
      )}

      {/* Orders table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order number or customer ID..."
              className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer ID</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Order status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                    {order.orderNumber}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    <span className="block max-w-40 truncate">
                      {order.customerId}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    {(order.items || []).reduce(
                      (sum, item) => sum + (Number(item.quantity) || 0),
                      0
                    )}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-medium">
                    {formatCurrency(order.total, order.currency)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.paymentStatus] ||
                        "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[getStatus(order)] ||
                        "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {getStatus(order)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      disabled={updatingOrderId === order.id}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm
                      outline-none focus:border-black
                      disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>

                    {updatingOrderId === order.id && (
                      <span className="ml-2 text-xs text-gray-500">
                        Saving...
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <ShoppingBag
                      size={32}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="font-medium text-gray-700">
                      No orders found
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Try a different search or status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivery address information */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredOrders.slice(0, 2).map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-100 bg-white p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-gray-500" />
                <h3 className="font-semibold text-gray-900">
                  {order.orderNumber} — Delivery address
                </h3>
              </div>

              <p className="text-sm text-gray-600">
                {[
                  order.shippingAddress?.street,
                  order.shippingAddress?.city,
                  order.shippingAddress?.state,
                  order.shippingAddress?.zipCode,
                  order.shippingAddress?.country,
                ]
                  .filter(Boolean)
                  .join(", ") || "No delivery address provided"}
              </p>

              <p className="mt-3 text-xs text-gray-500">
                Delivery: {order.deliveryStatus || "Not specified"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
