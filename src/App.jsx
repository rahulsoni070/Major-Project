import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  return (
    <>
      <Navbar
      cart={cart}
      wishlist={wishlist}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />

      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />

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

        <Route path="/products/:id" element={<ProductDetails />} />

        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />

        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              setWishlist={setWishlist}
              cart={cart}
              setCart={setCart}
            />
          }
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
            />
          }
        />

        <Route path="*" element={<Navigate to="/products" />} />
      </Routes>
    </>
  );
}

export default App;