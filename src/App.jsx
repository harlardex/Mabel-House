import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop"
import ProductDetails from "./pages/ProductDetails";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import CartModal from "./components/ui/CartModal";
import AdminRoute from "./components/routes/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCreateProduct from "./pages/admin/AdminCreateProduct";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCreateCategory from "./pages/admin/AdminCreateCategory";
import AdminEditCategory from "./pages/admin/AdminEditCategory";

function App() {

  return (
    <>
        <BrowserRouter>
          <Navbar />
          <CartModal />
          <ToastContainer position="top-center" autoClose={3000} theme="colored" newestOnTop/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetails />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/new" element={<AdminCreateProduct />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/categories/new" element={<AdminCreateCategory />} />
                <Route path="/admin/categories/edit/:id" element={<AdminEditCategory />} />
              </Route>
            </Route>
          </Routes>
          <Footer />
        </BrowserRouter>
    </>
  )
}

export default App;
