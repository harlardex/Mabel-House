import { useEffect, useState, useMemo, useCallback } from "react";
import { BASE_URL } from "../../services/api";
import notify from "../../components/ui/notify";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  ImageOff,
  X,
} from "lucide-react";

const PAGE_SIZE = 10;


const AdminCategories = () => {


  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });


  const token = localStorage.getItem("accessToken");

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${BASE_URL}/categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      const list = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.data?.data)
          ? data.data.data
          : Array.isArray(data.categories)
            ? result.categories
            : [];

      const pageInfo = data.pagination ?? data.data?.pagination ?? {};

      setCategories(list)
      setPagination({
        page: Number(pageInfo.page ?? page),
        limit: Number(pageInfo.limit ?? PAGE_SIZE),
        total: Number(pageInfo.total ?? list.length),
        totalPages: Math.max(
          1,
          Number(
            pageInfo.totalPages ??
            Math.ceil(
              Number(pageInfo.total ?? list.length) / PAGE_SIZE
            )
          )
        ),
        hasNext: Boolean(
          pageInfo.hasNext ??
          page < Number(pageInfo.totalPages ?? 1)
        ),
        hasPrev: Boolean(pageInfo.hasPrev ?? page > 1),
      });

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        [category.name, category.slug, category.description]
          .some((value) =>
            String(value ?? "").toLowerCase().includes(query)
          );

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && category.isActive) ||
        (statusFilter === "inactive" && !category.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const activeCount = categories.filter(
    (category) => category.isActive
  ).length;

  const inactiveCount = categories.filter(
    (category) => !category.isActive
  ).length;

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `${BASE_URL}/categories/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        notify.error("Failed to delete category.")
        throw new Error(
          result.message ||
          result.error ||
          "Failed to delete category."
        );
      }

      setDeleteTarget(null);

      await getCategories();
    } catch (err) {
      setError(err.message || "Could not delete category.");
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(date) {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Categories
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your store's product categories.
            </p>
          </div>

          <Link
            to="/admin/categories/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <Plus size={18} />
            Add Category
          </Link>
        </div>

        {/* Summary cards */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Categories on this page"
            value={pagination.total}
            icon={<FolderOpen size={21} />}
          />

          <SummaryCard
            title="Active on this page"
            value={activeCount}
            icon={<FolderOpen size={21} />}
          />

          <SummaryCard
            title="Inactive on this page"
            value={inactiveCount}
            icon={<FolderOpen size={21} />}
          />
        </div>

        {/* Search and filters */}
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, slug or description..."
              className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-black"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            type="button"
            onClick={getCategories}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Category table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                All Categories
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {pagination.total} total categories
              </p>
            </div>

            {loading && (
              <LoaderCircle
                size={20}
                className="animate-spin text-gray-500"
              />
            )}
          </div>

          {loading ? (
            <div className="flex min-h-60 items-center justify-center gap-3 text-sm text-gray-500">
              <LoaderCircle className="animate-spin" size={22} />
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex min-h-60 flex-col items-center justify-center px-5 text-center">
              <FolderOpen size={36} className="mb-3 text-gray-300" />
              <h3 className="font-medium text-gray-800">
                No categories found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-225 text-left">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-medium">
                        Category
                      </th>
                      <th className="px-5 py-4 font-medium">
                        Slug
                      </th>
                      <th className="px-5 py-4 font-medium">
                        Description
                      </th>
                      <th className="px-5 py-4 font-medium">
                        Status
                      </th>
                      <th className="px-5 py-4 font-medium">
                        Created
                      </th>
                      <th className="px-5 py-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredCategories.map((category) => (
                      <tr
                        key={category.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name || "Category"}
                                className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                                <ImageOff size={20} />
                              </div>
                            )}

                            <div>
                              <p className="font-medium text-gray-900">
                                {category.name || "Unnamed category"}
                              </p>
                              <p className="mt-1 max-w-44 truncate text-xs text-gray-400">
                                {category.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {category.slug || "—"}
                        </td>

                        <td className="max-w-56 px-5 py-4 text-sm text-gray-500">
                          <p className="line-clamp-2">
                            {category.description || "No description"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${category.isActive
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                          {formatDate(category.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/categories/edit/${category.id}`}
                              title="Edit category"
                              aria-label={`Edit ${category.name}`}
                              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black"
                            >
                              <Pencil size={16} />
                            </Link>

                            <button
                              type="button"
                              title="Delete category"
                              aria-label={`Delete ${category.name}`}
                              onClick={() => setDeleteTarget(category)}
                              className="rounded-lg border border-gray-200 p-2 text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages}
                  {" · "}
                  {pagination.total} categories
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!pagination.hasPrev || loading}
                    onClick={() => setPage((current) => current - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={!pagination.hasNext || loading}
                    onClick={() => setPage((current) => current + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="delete-category-title"
                className="text-lg font-semibold"
              >
                Delete category?
              </h2>

              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                aria-label="Close dialog"
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {deleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <span className="rounded-lg bg-gray-100 p-2 text-gray-700">
          {icon}
        </span>
      </div>

      <p className="text-2xl font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

export default AdminCategories;