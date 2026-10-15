import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { BASE_URL } from "../../services/api";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


const ITEMS_PER_PAGE = 5;

const AdminProducts = () => {
  const { products } = useProducts()
  const [allProducts, setAllProducts] = useState(products);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("refreshToken");

  // Search and filter
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = [
      product.name,
      product.brand,
      product.id,
    ].some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    );

    const matchesCategory =
      category === "All" || product.category.name === category;

    const matchesStatus =
      status === "All" || product.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const resetPage = () => setCurrentPage(1);

  // Delete product
  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    try {
        const response = await fetch(`${BASE_URL}/products/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if(!response.ok) {
            throw new Error("Failed to remove item");
        }
        console.log(response)
    } catch (error) {
        console.error(error);
    }



    if (!confirmed) return;

    const updatedProducts = allProducts.filter(
      (product) => product.id !== id
    );

    setAllProducts(updatedProducts);

    const remainingCount = updatedProducts.filter((product) => {
      const matchesSearch = [
        product.name,
        product.brand,
        product.id,
      ].some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      );

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesStatus =
        status === "All" || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    }).length;

    const lastPage = Math.max(
      1,
      Math.ceil(remainingCount / ITEMS_PER_PAGE)
    );

    setCurrentPage((page) => Math.min(page, lastPage));
  };

  return (
    <section className="min-h-screen flex-1 bg-gray-50 p-5 md:p-5">
      {/* Heading */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your store products
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#c89b3c] px-5 py-3 font-medium text-white transition hover:bg-[#ad812b]"
        >
          <Plus size={20} />
          Add New Product
        </Link>
      </div>

      {/* Product card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Search and filters */}
        <div className="grid grid-cols-1 gap-3 border-b border-gray-200 p-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative md:col-span-2 xl:col-span-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder="Search by name, brand or ID..."
              className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#c89b3c] focus:ring-1 focus:ring-[#c89b3c]"
            />
          </div>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              resetPage();
            }}
            className="rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-[#c89b3c]"
          >
            <option value="All">All Categories</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Living Room">Living Room</option>
            <option value="Dining">Dining</option>
            <option value="Lighting">Lighting</option>
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              resetPage();
            }}
            className="rounded-lg border border-gray-200 px-3 py-3 outline-none focus:border-[#c89b3c]"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="px-5 py-4 font-semibold">
                  Product
                </th>
                <th className="px-4 py-4 font-semibold">
                  Brand
                </th>
                <th className="px-4 py-4 font-semibold">
                  Category
                </th>
                <th className="px-4 py-4 font-semibold">
                  Price
                </th>
                <th className="px-4 py-4 font-semibold">
                  Stock
                </th>
                <th className="px-4 py-4 font-semibold">
                  Status
                </th>
                <th className="px-4 py-4 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {displayedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="transition hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="h-14 w-14 rounded-lg bg-gray-100 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.visibility = "hidden";
                        }}
                      />

                      <div>
                        <p className="font-semibold text-gray-800">
                          {product.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {product.brand}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {product.category.name}
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-800">
                    ${product.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                        product.stock === 0
                          ? "bg-red-100 text-red-600"
                          : product.stock <= 3
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {product.inventory[0].availableQuantity === 0
                        ? "Out of stock"
                        : `${product.inventory[0].availableQuantity} in stock`}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        name="Edit product"
                        aria-label={`Edit ${product.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition hover:bg-[#c89b3c] hover:text-white"
                      >
                        <Pencil size={16} />
                      </Link>

                      <button
                        type="button"
                        name="Delete product"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => handleDelete(product.id)}
                        className="flex h-9 w-9 items-center justify-center cursor-pointer rounded-lg bg-gray-100 text-red-500 transition hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {displayedProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Showing{" "}
            {filteredProducts.length === 0 ? 0 : startIndex + 1}
            {" - "}
            {Math.min(
              startIndex + ITEMS_PER_PAGE,
              filteredProducts.length
            )}{" "}
            of {filteredProducts.length} products
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                type="button"
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 min-w-9 rounded-lg border px-3 ${
                  currentPage === page
                    ? "border-[#c89b3c] bg-[#c89b3c] text-white"
                    : "border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={
                totalPages === 0 || currentPage >= totalPages
              }
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProducts;