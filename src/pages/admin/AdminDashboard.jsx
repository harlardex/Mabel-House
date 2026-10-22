import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import Loader from "../../components/ui/Loader";
import {
  Package,
  Layers,
  CheckCircle,
  XCircle,
  Plus,
  ArrowUpRight,
} from "lucide-react";

const recentOrders = [
  // Keep your existing recentOrders array here
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

export default function AdminDashboard() {
  const { products, categories, loading, error } = useProducts();

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load dashboard data.
      </div>
    );
  }

  const productList = products ?? [];
  const categoryList = categories ?? [];

  const activeProducts = productList.filter(
    (product) =>
      product.isActive === true || product.status === "ACTIVE"
  ).length;

  const inactiveProducts = productList.length - activeProducts;

  const stats = [
    {
      title: "Total Products",
      value: productList.length,
      icon: Package,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Categories",
      value: categoryList.length,
      icon: Layers,
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Active Products",
      value: activeProducts,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Inactive Products",
      value: inactiveProducts,
      icon: XCircle,
      color: "bg-red-100 text-red-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's an overview of your store.
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <Icon size={21} />
                </div>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Product overview */}
      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Product Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Products currently available.
            </p>
          </div>

          <Link
            to="/admin/products"
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-black"
          >
            View all <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="flex h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="bg-green-500 transition-all"
            style={{
              width: `${
                productList.length
                  ? (activeProducts / productList.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap justify-between gap-3 text-sm">
          <span className="text-gray-600">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" />
            Active: {activeProducts}
          </span>

          <span className="text-gray-600">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500" />
            Inactive: {inactiveProducts}
          </span>
        </div>
      </div>

      {/* Recent Orders: keep your existing orders table here */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Orders
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your latest customer orders.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="flex items-center gap-1 text-sm font-semibold text-gray-700"
          >
            View all <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Insert your existing recent orders table here */}
      </div>
    </div>
  );
}