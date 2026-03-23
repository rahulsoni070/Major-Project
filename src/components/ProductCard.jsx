import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/api";

function ProductCard({ product, setCart, setWishlist }) {
  const productId = product?._id || product?.id;

  function extractCart(data) {
    return data?.data?.cart || data?.cart || (Array.isArray(data) ? data : []);
  }

  function extractWishlist(data) {
    return data?.data?.wishlist || data?.wishlist || (Array.isArray(data) ? data : []);
  }

  async function addToCart() {
    try {
      const res = await fetch(`${BASE_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const raw = await res.text();
      let data = {};
      try { data = JSON.parse(raw); } catch { data = { message: raw }; }

      if (!res.ok) {
        console.error("Cart API error:", data);
        alert(`Unable to add to cart. ${data?.message || `Status ${res.status}`}`);
        return;
      }

      setCart(extractCart(data));
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Unable to add to cart. Network/server error.");
    }
  }

  async function addToWishlist() {
    try {
      const res = await fetch(`${BASE_URL}/api/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const raw = await res.text();
      let data = {};
      try { data = JSON.parse(raw); } catch { data = { message: raw }; }

      if (!res.ok) {
        console.error("Wishlist API error:", data);
        alert(`Unable to add to wishlist. ${data?.message || `Status ${res.status}`}`);
        return;
      }

      setWishlist(extractWishlist(data));
    } catch (err) {
      console.error("Add to wishlist error:", err);
      alert("Unable to add to wishlist. Network/server error.");
    }
  }

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      <Link to={`/products/${productId}`} className="text-decoration-none text-dark">
        <img
          src={product.image}
          alt={product.title}
          className="card-img-top product-img"
          style={{ height: "220px", objectFit: "cover" }}
        />
      </Link>

      <div className="card-body d-flex flex-column">
        <Link to={`/products/${productId}`} className="text-decoration-none text-dark">
          <h6 className="card-title fw-semibold">{product.title}</h6>
        </Link>

        <p className="fw-bold text-primary mb-1">₹ {product.price}</p>
        <small className="text-muted mb-3">⭐ {product.rating}</small>

        <button className="btn btn-primary mt-auto mb-2 rounded-3" onClick={addToCart}>
          Add to Cart
        </button>

        <button className="btn btn-outline-danger rounded-3" onClick={addToWishlist}>
          Add to Wishlist
        </button>
      </div>
    </div>
  );
}

export default ProductCard;