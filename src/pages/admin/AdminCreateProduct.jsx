
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../services/api";
import { useProducts } from "../../hooks/useProducts";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Package,
  Image as ImageIcon,
  Save,
} from "lucide-react";

const initialForm = {
  name: "",
  description: "",
  shortDescription: "",
  categoryId: "",
  price: "",
  compareAtPrice: "",
  costPrice: "",
  sku: "",
  brand: "",
  material: "",
  tags: [""],
  images: [""],
  featured: false,
  isNew: true,
  status: "ACTIVE",
  isActive: true,
  isPublished: true,
  initialStock: "0",
  variants: [
    {
      colour: "",
      size: "",
      material: "",
      sku: "",
      price: "",
      stock: "0",
    },
  ],
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-100";

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

export default function AdminCreateProduct() {
  const navigate = useNavigate();
  const {categories} = useProducts()
  const token = localStorage.getItem("refreshToken");

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateListItem = (field, index, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: previous[field].map((item, itemIndex) =>
        itemIndex === index ? value : item
      ),
    }));
  };

  const addListItem = (field) => {
    setForm((previous) => ({
      ...previous,
      [field]: [...previous[field], ""],
    }));
  };

  const removeListItem = (field, index) => {
    setForm((previous) => ({
      ...previous,
      [field]: previous[field].filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const updateVariant = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      variants: previous.variants.map((variant, variantIndex) =>
        variantIndex === index
          ? { ...variant, [field]: value }
          : variant
      ),
    }));
  };

  const addVariant = () => {
    setForm((previous) => ({
      ...previous,
      variants: [
        ...previous.variants,
        {
          colour: "",
          size: "",
          material: "",
          sku: "",
          price: "",
          stock: "0",
        },
      ],
    }));
  };

  const removeVariant = (index) => {
    setForm((previous) => ({
      ...previous,
      variants: previous.variants.filter(
        (_, variantIndex) => variantIndex !== index
      ),
    }));
  };

  const buildRequestBody = () => ({
    name: form.name.trim(),
    description: form.description.trim(),
    shortDescription: form.shortDescription.trim(),
    categoryId: form.categoryId.trim(),
    price: Number(form.price),
    compareAtPrice:
      form.compareAtPrice === "" ? 0 : Number(form.compareAtPrice),
    costPrice: form.costPrice === "" ? 0 : Number(form.costPrice),
    sku: form.sku.trim(),
    brand: form.brand.trim(),
    material: form.material.trim(),
    tags: form.tags.map((tag) => tag.trim()).filter(Boolean),
    images: form.images.map((image) => image.trim()).filter(Boolean),
    featured: form.featured,
    isNew: form.isNew,
    status: form.status,
    isActive: form.isActive,
    isPublished: form.isPublished,
    initialStock: Number(form.initialStock),
    variants: form.variants
      .filter(
        (variant) =>
          variant.colour.trim() ||
          variant.size.trim() ||
          variant.material.trim() ||
          variant.sku.trim() ||
          variant.price !== "" ||
          variant.stock !== "0"
      )
      .map((variant) => ({
        colour: variant.colour.trim(),
        size: variant.size.trim(),
        material: variant.material.trim(),
        sku: variant.sku.trim(),
        price: variant.price === "" ? 0 : Number(variant.price),
        stock: variant.stock === "" ? 0 : Number(variant.stock),
      })),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.categoryId.trim()) {
      setError("Category ID is required.");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      setError("Enter a valid product price.");
      return;
    }

    const requestBody = buildRequestBody();

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            `Unable to create product (${response.status}).`
        );
      }

      setSuccess("Product created successfully.");

      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              to="/admin/products"
              className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to products
            </Link>

            <h1 className="text-2xl font-bold text-gray-900">
              Create product
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Add a new product to your store.
            </p>
          </div>

          <button
            type="submit"
            form="create-product-form"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {loading ? "Creating..." : "Create product"}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form
          id="create-product-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Basic information */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2">
                <Package size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  Basic information
                </h2>
                <p className="text-sm text-gray-500">
                  Product name and descriptions
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass}>Product name *</label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Modern wooden dining chair"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Short description</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) =>
                    updateField("shortDescription", e.target.value)
                  }
                  placeholder="A short summary of the product"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Full description *</label>
                <textarea
                  className={inputClass}
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  placeholder="Describe the product, its features and benefits"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Category ID *</label>

                <select name="categoryId"
                        id="categoryId"
                        value={form.categoryId}
                        required
                        className={inputClass}
                        onChange={(e) =>
                          updateField("categoryId", e.target.value)}
                        >
                          <option value="" disabled>Select a category</option>

                          {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                             {category.name}
                          </option>
                          ))}
                        </select>
              </div>

              <div>
                <label className={labelClass}>Brand</label>
                <input
                  className={inputClass}
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  placeholder="Brand name"
                />
              </div>

              <div>
                <label className={labelClass}>Material</label>
                <input
                  className={inputClass}
                  value={form.material}
                  onChange={(e) => updateField("material", e.target.value)}
                  placeholder="e.g. Solid oak"
                />
              </div>

              <div>
                <label className={labelClass}>SKU</label>
                <input
                  className={inputClass}
                  value={form.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                  placeholder="e.g. CHAIR-001"
                />
              </div>
            </div>
          </section>

          {/* Pricing and inventory */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="mb-5 font-semibold text-gray-900">
              Pricing and inventory
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className={labelClass}>Selling price *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Compare-at price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.compareAtPrice}
                  onChange={(e) =>
                    updateField("compareAtPrice", e.target.value)
                  }
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className={labelClass}>Cost price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.costPrice}
                  onChange={(e) => updateField("costPrice", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className={labelClass}>Initial stock</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={inputClass}
                  value={form.initialStock}
                  onChange={(e) =>
                    updateField("initialStock", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Product images</h2>
                  <p className="text-sm text-gray-500">
                    Add image URLs for this product
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => addListItem("images")}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-500"
              >
                <Plus size={16} /> Add image
              </button>
            </div>

            <div className="space-y-3">
              {form.images.map((image, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-1">
                    <label className={labelClass}>
                      Image URL {index + 1}
                    </label>
                    <input
                      type="url"
                      className={inputClass}
                      value={image}
                      onChange={(e) =>
                        updateListItem("images", index, e.target.value)
                      }
                      placeholder="https://example.com/product-image.jpg"
                    />
                  </div>

                  {form.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem("images", index)}
                      aria-label={`Remove image ${index + 1}`}
                      className="mt-7 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Tags */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Product tags</h2>
                <p className="text-sm text-gray-500">
                  Add searchable keywords
                </p>
              </div>

              <button
                type="button"
                onClick={() => addListItem("tags")}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-500"
              >
                <Plus size={16} /> Add tag
              </button>
            </div>

            <div className="space-y-3">
              {form.tags.map((tag, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    className={inputClass}
                    value={tag}
                    onChange={(e) =>
                      updateListItem("tags", index, e.target.value)
                    }
                    placeholder="e.g. furniture"
                  />

                  {form.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeListItem("tags", index)}
                      aria-label={`Remove tag ${index + 1}`}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Variants */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Product variants
                </h2>
                <p className="text-sm text-gray-500">
                  Optional sizes, colours and variant-specific stock
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                <Plus size={16} /> Add variant
              </button>
            </div>

            <div className="space-y-5">
              {form.variants.map((variant, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">
                      Variant {index + 1}
                    </h3>

                    {form.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      ["colour", "Colour", "e.g. Black"],
                      ["size", "Size", "e.g. Large"],
                      ["material", "Material", "e.g. Oak"],
                      ["sku", "Variant SKU", "e.g. CHAIR-BLK-L"],
                    ].map(([field, label, placeholder]) => (
                      <div key={field}>
                        <label className={labelClass}>{label}</label>
                        <input
                          className={inputClass}
                          value={variant[field]}
                          onChange={(e) =>
                            updateVariant(index, field, e.target.value)
                          }
                          placeholder={placeholder}
                        />
                      </div>
                    ))}

                    <div>
                      <label className={labelClass}>Variant price</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={inputClass}
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(index, "price", e.target.value)
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Variant stock</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        className={inputClass}
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(index, "stock", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Publishing settings */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="mb-5 font-semibold text-gray-900">
              Publishing settings
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Product status</label>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="flex flex-col justify-center gap-3 pt-2">
                {[
                  ["featured", "Featured product"],
                  ["isNew", "Mark as new"],
                  ["isActive", "Product is active"],
                  ["isPublished", "Publish product"],
                ].map(([field, label]) => (
                  <label
                    key={field}
                    className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={form[field]}
                      onChange={(e) =>
                        updateField(field, e.target.checked)
                      }
                      className="h-4 w-4 accent-gray-900"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Form actions */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link
              to="/admin/products"
              className="rounded-lg border border-gray-200 bg-white px-5 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-60"
            >
              <Save size={17} />
              {loading ? "Creating product..." : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
