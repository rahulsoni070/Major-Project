import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("wishlist") || "[]"));
  const [addresses, setAddresses] = useState(() => JSON.parse(localStorage.getItem("addresses") || "[]"));
  const [selectedAddressId, setSelectedAddressId] = useState(() => localStorage.getItem("selectedAddressId") || null);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("orders") || "[]"));

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("addresses", JSON.stringify(addresses)), [addresses]);
  useEffect(() => localStorage.setItem("orders", JSON.stringify(orders)), [orders]);
  useEffect(() => {
    if (selectedAddressId) localStorage.setItem("selectedAddressId", selectedAddressId);
  }, [selectedAddressId]);

  return (
    <div className="app-shell">
      <Navbar
        cart={cart}
        wishlist={wishlist}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="main-content pb-5">
        <Routes>
          <Route path="/" element={<Home setCart={setCart} setWishlist={setWishlist} />} />
          <Route
            path="/products"
            element={
              <Products
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
                searchTerm={searchTerm}
              />
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProductDetails
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
              />
            }
          />
          <Route
            path="/cart"
            element={<Cart cart={cart} setCart={setCart} setWishlist={setWishlist} />}
          />
          <Route
            path="/wishlist"
            element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} cart={cart} setCart={setCart} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                setCart={setCart}
                addresses={addresses}
                setAddresses={setAddresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                orders={orders}
                setOrders={setOrders}
              />
            }
          />
          <Route path="/orders" element={<OrderHistory orders={orders} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={1800} theme="colored" />
    </div>
  );
}

export default App;