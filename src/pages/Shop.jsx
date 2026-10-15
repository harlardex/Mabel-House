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
        <h2 className="text-5xl font-medium -translate-y-2">Shop</h2>
        <p>
          <Link to="/" className="font-medium">
            Home
          </Link>{" "}
          ❯ Shop
        </p>
      </header>

      <section className="flex justify-between item-center py-8 px-10 my-8 bg-primary text-lg">
        <div className="flex gap-10 item-center">
          <div className="flex gap-5 items-center">
            <select
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
            {/* <p className="flex gap-3"><SlidersHorizontal />  Filter</p> */}
            {/* <LayoutGrid />
                        <List /> */}
          </div>
          <div className=" flex items-center border-l ">
            <p className="ml-5">
              Showing {filteredProduct === 0 ? 0 : firstIndex + 1} -{" "}
              {Math.min(firstIndex + productPerPage, filteredProduct.length)} of
              &nbsp;
              {filteredProduct.length} results
            </p>
          </div>
        </div>
        <div className="w-[30%]">
          <input type="text"
                 placeholder="Search products"
                 value={search} 
                 onChange={(e) => setSearch(e.target.value)}
                 className="border py-1 px-2 rounded-lg w-full" 
            />
        </div>
        <div className="flex gap-5 items-center">
          <p>Sort By</p>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="default">Default</option>
            <option value="low">Low to High</option>
            <option value="high">High to low</option>
            <option value=""></option>
          </select>
        </div>
      </section>

      <main className="p-10">
        <ProductGrid products={currentProduct} />

        {filteredProduct.length > 0 && (
          <div className="flex justify-center items-center gap-8 my-10 text-xl *:py-4 *:px-6 *:bg-[#fff9e5] *:rounded-xl">
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
