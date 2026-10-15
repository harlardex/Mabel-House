import { createContext, useState, useEffect } from "react";
import { BASE_URL } from "../services/api";


export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, categoriesResponse] =
          await Promise.all([
            fetch(`${BASE_URL}/products`),
            fetch(`${BASE_URL}/categories`),
          ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch products or categories");
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData.data);
        setCategories(categoriesData.data);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const newestProduct =
    products.length > 0
      ? [...products].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      )[0]
      : null;

  return (
    <ProductsContext.Provider value={{ products, categories, loading, error, newestProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};
