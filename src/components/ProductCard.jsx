import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/api";

function ProductCard({ product, setCart, setWishlist }) {
  const productId = String(product?._id || product?.id || "");

  async function addToCart() {
    try {
      const res = await fetch(`${BASE_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      setCart(data?.data?.cart || data?.cart || []);
    } catch (e) {
      console.error("addToCart", e);
    }
  }

  async function addToWishlist() {
    try {
      const res = await fetch(`${BASE_URL}/api/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      setWishlist(data?.data?.wishlist || data?.wishlist || []);
    } catch (e) {
      console.error("addToWishlist", e);
    }
  }

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      <Link to={`/products/${productId}`} className="text-decoration-none text-dark">
        <img src={product.image} alt={product.title} className="card-img-top product-img" />
      </Link>
      <div className="card-body d-flex flex-column">
        <Link to={`/products/${productId}`} className="text-decoration-none text-dark">
          <h6 className="card-title fw-semibold">{product.title}</h6>
        </Link>
        <p className="fw-bold text-primary mb-1">₹ {product.price}</p>
        <small className="text-muted mb-3">⭐ {product.rating}</small>
        <button className="btn btn-primary mt-auto mb-2 rounded-3" onClick={addToCart}>Add to Cart</button>
        <button className="btn btn-outline-danger rounded-3" onClick={addToWishlist}>Add to Wishlist</button>
      </div>
    </div>
  );
}

export default ProductCard;