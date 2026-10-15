import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ImagePlus, LoaderCircle } from "lucide-react";
import { BASE_URL } from "../../services/api";
import notify from "../../components/ui/notify";

const AdminCreateCategory = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Failed to create category."
        );
      }

      notify.success("Category created successfully!");
      navigate("/admin/categories");
    } catch (err) {
      console.error("Create category error:", err);
      setError(err.message || "Something went wrong.");
      notify.error(err.message || "Failed to create category.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/admin/categories"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to categories
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Add Category
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Create a new category for your store.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-8"
        >
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Category name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Living Room"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this category..."
                rows={4}
                className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category Image URL
              </label>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                  <ImagePlus size={22} />
                </div>

                <input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  placeholder="https://example.com/image.jpg"
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {formData.image && (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-gray-500">
                    Image preview
                  </p>

                  <img
                    src={formData.image}
                    alt="Category preview"
                    className="h-40 w-40 rounded-lg border border-gray-200 object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    onLoad={(event) => {
                      event.currentTarget.style.display = "block";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Active status */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Active Category
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Allow this category to be available in your store.
                </p>
              </div>

              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5 cursor-pointer accent-black"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <Link
              to="/admin/categories"
              className="rounded-lg border border-gray-200 px-5 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <LoaderCircle size={17} className="animate-spin" />
              )}

              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateCategory;