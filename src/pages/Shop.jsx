import { Link } from "react-router-dom";
import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import Loader from "../components/ui/Loader";
import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import ProductGrid from "../components/products/ProductGrid";
import banner from "../assets/banner.png";
import logo from "../assets/logo.png";

function Shop() {
  const { products, categories, loading, error } = useProducts();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  let filteredProduct = [...products];

  // filter by category
  if (selectedCategory !== "all") {
    filteredProduct = filteredProduct.filter(
      (product) => product.categoryId === selectedCategory
    );
  }

  // Search a product
  if (search) {
    filteredProduct = filteredProduct.filter((product) =>
      product.name.toLowerCase().includes(search.toLocaleLowerCase()),
    );
  }

  // Sort by price
  if (sort === "low") {
    filteredProduct = [...filteredProduct].sort((a, b) => a.price - b.price);
  }
  if (sort === "high") {
    filteredProduct = [...filteredProduct].sort((a, b) => b.price - a.price);
  }
  function handleSortChange(e) {
    setSort(e.target.value);
    setCurrentPage(1);
  }

  // Pagnation
  const productPerPage = 16;
  const totalPages = Math.ceil(filteredProduct.length / productPerPage);
  const firstIndex = (currentPage - 1) * productPerPage;
  const currentProduct = filteredProduct.slice(
    firstIndex,
    firstIndex + productPerPage,
  );

  if (loading) {
    return <div><Loader /></div>;
  }

  if (error) {
    return <div><Loader message={error} /></div>;
  }

  return (
    <>
      <header
        className="flex flex-col items-center justify-center bg-cover bg-center h-80"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <img src={logo} alt="Logo" />
        <h2 className="text-3xl sm:text-5xl font-medium -translate-y-2">Shop</h2>
        <p>
          <Link to="/" className="font-medium">
            Home
          </Link>{" "}
          ❯ Shop
        </p>
      </header>

      <section className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-8 py-7 px-4 my-8 bg-primary text-lg">

        <div className="flex-1">
          <input type="text"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border py-1 px-2 rounded-lg w-full"
          />
        </div>

        <div className="flex-2 flex gap-4 lg:gap-8 justify-around items-center">
          
          <div className="flex-1">
            <select
              className="border p-1 w-full rounded"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}

            </select>
          </div>

          <div className="flex-1">
            <select
              className="border p-1 w-full rounded"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="default">Price</option>
              <option value="low">Low to High</option>
              <option value="high">High to low</option>
            </select>
          </div>

          <div className="hidden sm:flex flex-1">
            <p className="whitespace-nowrap w-full">
              Showing {filteredProduct === 0 ? 0 : firstIndex + 1} -{" "}
              {Math.min(firstIndex + productPerPage, filteredProduct.length)} of
              &nbsp;
              {filteredProduct.length} results
            </p>
          </div>
        </div>
      </section>

      <main className="p-10">
        <ProductGrid products={currentProduct} />

        <div className="sm:hidden">
            <p className="whitespace-nowrap w-full">
              Showing {filteredProduct === 0 ? 0 : firstIndex + 1} -{" "}
              {Math.min(firstIndex + productPerPage, filteredProduct.length)} of
              &nbsp;
              {filteredProduct.length} results
            </p>
          </div>

        {filteredProduct.length > 0 && (
          <div className="flex justify-center items-center gap-8 my-5 sm:my-10 sm:text-xl *:py-2 *:px-2 sm:*:py-4 sm:*:px-6 *:bg-[#fff9e5] *:rounded-xl">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`${currentPage === page ? "bg-secondary" : ""}`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}

      </main>
      {filteredProduct.length === 0 && (
        <div className="flex justify-center items-center pb-20">
          <p className="text-xl">No products found</p>
        </div>
      )}
    </>
  );
}

export default Shop;
