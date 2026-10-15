import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import Loader from "../../components/ui/Loader";
import notify from "../../components/ui/notify";
import { BASE_URL } from "../../services/api";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Package,
    Image as ImageIcon,
    Save,
    LoaderCircle,
} from "lucide-react";

const emptyVariant = {
    colour: "",
    size: "",
    material: "",
    sku: "",
    price: "",
    stock: "0",
};

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
    isNew: false,
    status: "ACTIVE",
    isActive: true,
    isPublished: true,
    initialStock: "0",
    variants: [{ ...emptyVariant }],
};

function getStringArray(items, property) {
    if (!Array.isArray(items) || items.length === 0) {
        return [""];
    }

    return items.map((item) => {
        if (typeof item === "string") {
            return item;
        }

        return item?.[property] ?? item?.url ?? item?.imageUrl ?? "";
    });
}

function getProductForm(product) {
    return {
        name: product.name ?? "",
        description: product.description ?? "",
        shortDescription: product.shortDescription ?? "",
        categoryId: product.categoryId,
        price: product.price ?? "",
        compareAtPrice: product.compareAtPrice ?? "",
        costPrice: product.costPrice ?? "",
        sku: product.sku ?? "",
        brand: product.brand ?? "",
        material: product.material ?? "",
        tags: getStringArray(product.tags, "name"),
        images: getStringArray(product.images, "url"),
        featured: Boolean(product.featured),
        isNew: Boolean(product.isNew),
        status: product.status ?? "ACTIVE",
        isActive: product.isActive ?? true,
        isPublished: product.isPublished ?? true,
        initialStock: product.initialStock ?? product.stock ?? "0",
        variants:
            Array.isArray(product.variants) &&
                product.variants.length > 0
                ? product.variants.map((variant) => ({
                    colour: variant.colour ?? "",
                    size: variant.size ?? "",
                    material: variant.material ?? "",
                    sku: variant.sku ?? "",
                    price: variant.price ?? "",
                    stock: variant.stock ?? "0",
                }))
                : [{ ...emptyVariant }],
    };
}

const AdminEditProduct = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { products, loading } = useProducts();
    const product = products.find((item) => item.id === id);
    const [form, setForm] = useState(initialForm);
    const [formReady, setFormReady] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (loading) {
            return <Loader />;
        }
        if (product) {
            setForm(getProductForm(product));
            setFormReady(true);
        } else {
            setFormReady(false);
            notify.error("Product not found in the loaded products.")
        }
    }, [product, loading]);

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleArrayChange(field, index, value) {
        setForm((previous) => ({
            ...previous,
            [field]: previous[field].map((item, itemIndex) =>
                itemIndex === index ? value : item
            ),
        }));
    }

    function addArrayItem(field) {
        setForm((previous) => ({
            ...previous,
            [field]: [...previous[field], ""],
        }));
    }

    function removeArrayItem(field, index) {
        setForm((previous) => {
            const updated = previous[field].filter(
                (_, itemIndex) => itemIndex !== index
            );

            return {
                ...previous,
                [field]: updated.length > 0 ? updated : [""],
            };
        });
    }

    function handleVariantChange(index, field, value) {
        setForm((previous) => ({
            ...previous,
            variants: previous.variants.map((variant, variantIndex) =>
                variantIndex === index
                    ? { ...variant, [field]: value }
                    : variant
            ),
        }));
    }

    function addVariant() {
        setForm((previous) => ({
            ...previous,
            variants: [...previous.variants, { ...emptyVariant }],
        }));
    }

    function removeVariant(index) {
        setForm((previous) => {
            const updated = previous.variants.filter(
                (_, variantIndex) => variantIndex !== index
            );

            return {
                ...previous,
                variants:
                    updated.length > 0 ? updated : [{ ...emptyVariant }],
            };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!form.name.trim()) {
            setError("Product name is required.");
            return;
        }

        if (!form.categoryId) {
            setError("Category ID is required.");
            return;
        }

        if (form.price === "" || Number(form.price) < 0) {
            setError("Enter a valid product price.");
            return;
        }

        const token = localStorage.getItem("accessToken");

        if (!token) {
            setError("You must be logged in to edit products.");
            return;
        }

        const payload = {
            name: form.name.trim(),
            description: form.description,
            shortDescription: form.shortDescription,
            categoryId: form.categoryId,
            price: Number(form.price),
            compareAtPrice:
                form.compareAtPrice === ""
                    ? undefined
                    : Number(form.compareAtPrice),
            costPrice:
                form.costPrice === ""
                    ? undefined
                    : Number(form.costPrice),
            sku: form.sku,
            brand: form.brand,
            material: form.material,
            tags: form.tags.map((tag) => tag.trim()).filter(Boolean),
            images: form.images
                .map((image) => image.trim())
                .filter(Boolean),
            featured: form.featured,
            isNew: form.isNew,
            status: form.status,
            isActive: form.isActive,
            isPublished: form.isPublished,
            initialStock: Number(form.initialStock || 0),
            variants: form.variants
                .filter(
                    (variant) =>
                        variant.colour.trim() ||
                        variant.size.trim() ||
                        variant.material.trim() ||
                        variant.sku.trim() ||
                        variant.price !== ""
                )
                .map((variant) => ({
                    colour: variant.colour,
                    size: variant.size,
                    material: variant.material,
                    sku: variant.sku,
                    price:
                        variant.price === ""
                            ? Number(form.price)
                            : Number(variant.price),
                    stock: Number(variant.stock || 0),
                })),
        };

        // Remove optional properties that are undefined.
        Object.keys(payload).forEach((key) => {
            if (payload[key] === undefined) {
                delete payload[key];
            }
        });

        try {
            setSaving(true);

            const response = await fetch(
                `${BASE_URL}/products/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to update product."
                );
            }

            setSuccess("Product updated successfully.");
            notify.success("Product updated successfully.")
            navigate("/admin/products");

        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    if (!product || !formReady) {
        return (
            <div className="p-6">
                <Link
                    to="/admin/products"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                >
                    <ArrowLeft size={18} />
                    Back to products
                </Link>

                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                    {error || "Product not found."}
                    <p className="mt-2 text-sm">
                        Make sure the products list has loaded and that this
                        product exists in your context.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="mx-auto max-w-5xl">
                <Link
                    to="/admin/products"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                >
                    <ArrowLeft size={18} />
                    Back to products
                </Link>

                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Edit Product
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Update the details for {product.name}.
                        </p>
                    </div>

                    <button
                        type="submit"
                        form="edit-product-form"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <LoaderCircle className="animate-spin" size={18} />
                        ) : (
                            <Save size={18} />
                        )}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <form
                    id="edit-product-form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Basic information */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-7">
                        <div className="mb-6 flex items-center gap-3">
                            <Package size={21} />
                            <div>
                                <h2 className="font-semibold">Basic Information</h2>
                                <p className="text-sm text-gray-500">
                                    Product name and descriptions
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Field label="Product Name">
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="Stockholm Sofa"
                                />
                            </Field>

                            <Field label="Category ID">
                                <input
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="Enter category ID"
                                />
                            </Field>

                            <Field label="SKU">
                                <input
                                    name="sku"
                                    value={form.sku}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="SOFA-001"
                                />
                            </Field>

                            <Field label="Brand">
                                <input
                                    name="brand"
                                    value={form.brand}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Brand name"
                                />
                            </Field>

                            <Field label="Material">
                                <input
                                    name="material"
                                    value={form.material}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Fabric, wood, leather..."
                                />
                            </Field>

                            <Field label="Short Description">
                                <input
                                    name="shortDescription"
                                    value={form.shortDescription}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="A brief product summary"
                                />
                            </Field>

                            <div className="md:col-span-2">
                                <Field label="Full Description">
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={5}
                                        className={inputClass}
                                        placeholder="Describe the product..."
                                    />
                                </Field>
                            </div>
                        </div>
                    </section>

                    {/* Pricing and stock */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-7">
                        <h2 className="mb-6 font-semibold">
                            Pricing and Inventory
                        </h2>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <Field label="Price">
                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Compare-at Price">
                                <input
                                    type="number"
                                    name="compareAtPrice"
                                    value={form.compareAtPrice}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Cost Price">
                                <input
                                    type="number"
                                    name="costPrice"
                                    value={form.costPrice}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Initial Stock">
                                <input
                                    type="number"
                                    name="initialStock"
                                    value={form.initialStock}
                                    onChange={handleChange}
                                    min="0"
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                    </section>

                    {/* Images */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-7">
                        <div className="mb-5 flex items-center gap-3">
                            <ImageIcon size={21} />
                            <h2 className="font-semibold">Product Images</h2>
                        </div>

                        <div className="space-y-3">
                            {form.images.map((image, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <input
                                        type="url"
                                        value={image}
                                        onChange={(event) =>
                                            handleArrayChange(
                                                "images",
                                                index,
                                                event.target.value
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="https://example.com/product.jpg"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeArrayItem("images", index)
                                        }
                                        className="rounded-lg border border-gray-200 p-3 text-red-600 hover:bg-red-50"
                                        aria-label="Remove image"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => addArrayItem("images")}
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:text-gray-500"
                        >
                            <Plus size={18} />
                            Add Image URL
                        </button>
                    </section>

                    {/* Tags */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-7">
                        <h2 className="mb-5 font-semibold">Product Tags</h2>

                        <div className="space-y-3">
                            {form.tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <input
                                        value={tag}
                                        onChange={(event) =>
                                            handleArrayChange(
                                                "tags",
                                                index,
                                                event.target.value
                                            )
                                        }
                                        className={inputClass}
                                        placeholder="e.g. furniture"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeArrayItem("tags", index)
                                        }
                                        className="rounded-lg border border-gray-200 p-3 text-red-600 hover:bg-red-50"
                                        aria-label="Remove tag"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => addArrayItem("tags")}
                            className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:text-gray-500"
                        >
                            <Plus size={18} />
                            Add Tag
                        </button>
                    </section>

                    {/* Variants */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-7">
                        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="font-semibold">Product Variants</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Add colours, sizes, and variant stock.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addVariant}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                <Plus size={17} />
                                Add Variant
                            </button>
                        </div>

                        <div className="space-y-5">
                            {form.variants.map((variant, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-gray-200 p-4"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-sm font-medium">
                                            Variant {index + 1}
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            className="text-red-600 hover:text-red-800"
                                            aria-label="Remove variant"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {[
                                            ["colour", "Colour"],
                                            ["size", "Size"],
                                            ["material", "Material"],
                                            ["sku", "Variant SKU"],
                                            ["price", "Variant Price"],
                                            ["stock", "Variant Stock"],
                                        ].map(([field, label]) => (
                                            <Field key={field} label={label}>
                                                <input
                                                    type={
                                                        field === "price" || field === "stock"
                                                            ? "number"
                                                            : "text"
                                                    }
                                                    min={
                                                        field === "price" || field === "stock"
                                                            ? "0"
                                                            : undefined
                                                    }
                                                    step={field === "price" ? "0.01" : undefined}
                                                    value={variant[field]}
                                                    onChange={(event) =>
                                                        handleVariantChange(
                                                            index,
                                                            field,
                                                            event.target.value
                                                        )
                                                    }
                                                    className={inputClass}
                                                    placeholder={label}
                                                />
                                            </Field>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Status and visibility */}
                    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-7">
                        <h2 className="mb-6 font-semibold">
                            Product Status and Visibility
                        </h2>

                        <div className="mb-6 max-w-sm">
                            <Field label="Status">
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                            </Field>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                ["featured", "Featured product"],
                                ["isNew", "New arrival"],
                                ["isActive", "Product is active"],
                                ["isPublished", "Product is published"],
                            ].map(([field, label]) => (
                                <label
                                    key={field}
                                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4"
                                >
                                    <input
                                        type="checkbox"
                                        name={field}
                                        checked={form[field]}
                                        onChange={handleChange}
                                        className="h-4 w-4 accent-black"
                                    />
                                    <span className="text-sm">{label}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Bottom save button */}
                    <div className="flex justify-end gap-3 pb-8">
                        <Link
                            to="/admin/products"
                            className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium hover:bg-gray-100"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                        >
                            {saving ? (
                                <LoaderCircle className="animate-spin" size={18} />
                            ) : (
                                <Save size={18} />
                            )}
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black";

function Field({ label, children }) {
    return (
        <div className="min-w-0">
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>
            {children}
        </div>
    );
}

export default AdminEditProduct;