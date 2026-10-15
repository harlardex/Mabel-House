import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  Save,
} from "lucide-react";
import { BASE_URL } from "../../services/api";
import notify from "../../components/ui/notify";

function AdminEditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getCategory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${BASE_URL}/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Failed to fetch category."
        );
      }

      const category = result.data;

      setFormData({
        name: category.name ?? "",
        description: category.description ?? "",
        image: category.image ?? "",
        isActive: category.isActive ?? true,
      });
    } catch (err) {
      console.error("Error fetching category:", err);
      setError(err.message || "Failed to load category.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: formData.image.trim() || null,
        isActive: formData.isActive,
      };

      const response = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Failed to update category."
        );
      }

      notify.success("Category updated successfully!");
      navigate("/admin/categories");
    } catch (err) {
      console.error("Error updating category:", err);
      setError(err.message || "Something went wrong.");
      notify.error(err.message || "Failed to update category.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3">
        <LoaderCircle className="animate-spin" size={28} />
        <span>Loading category...</span>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="p-6">
        <p className="mb-4 text-red-600">{error}</p>

        <button
          type="button"
          onClick={getCategory}
          className="rounded-lg bg-black px-5 py-2 text-white"
        >
          Try Again
        </button>

        <Link
          to="/admin/categories"
          className="ml-4 text-gray-600 hover:text-black"
        >
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <Link
        to="/admin/categories"
        className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-black"
      >
        <ArrowLeft size={18} />
        Back to Categories
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold md:text-3xl">
          Edit Category
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Update the category information below.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 md:p-7"
      >
        {/* Category name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium"
          >
            Category Name *
          </label>

          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Living Room"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Living room furniture"
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="image"
            className="mb-2 flex items-center gap-2 text-sm font-medium"
          >
            <ImagePlus size={18} />
            Category Image URL
          </label>

          <input
            id="image"
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/category.jpg"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />

          {formData.image && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-500">
                Image Preview
              </p>

              <img
                src={formData.image}
                alt="Category preview"
                className="h-40 w-40 rounded-lg border border-gray-200 object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Active status */}
        <div className="rounded-lg border border-gray-200 p-4">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="font-medium">Active Category</p>
              <p className="mt-1 text-sm text-gray-500">
                Allow this category to be available in your store.
              </p>
            </div>

            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-5 w-5 accent-black"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/admin/categories"
            className="rounded-lg border border-gray-300 px-6 py-3 text-center hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}

            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminEditCategory;