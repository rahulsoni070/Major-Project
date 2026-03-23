import { BASE_URL } from "../utils/api";

function ProductCard({ product, setCart, setWishlist }) {
  async function addToCart() {
    try {
      const res = await fetch(`${BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error(`Cart request failed: ${res.status}`);

      const data = await res.json();

      const updatedCart = data?.data?.cart || data?.cart || data;
      if (Array.isArray(updatedCart)) {
        setCart(updatedCart);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  }

  async function addToWishlist() {
    try {
      const res = await fetch(`${BASE_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error(`Wishlist request failed: ${res.status}`);

      const data = await res.json();

      const updatedWishlist = data?.data?.wishlist || data?.wishlist || data;
      if (Array.isArray(updatedWishlist)) {
        setWishlist(updatedWishlist);
      }
    } catch (err) {
      console.error("Add to wishlist error:", err);
    }
  }

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      <img
        src={product.image}
        alt={product.title}
        className="card-img-top product-img"
        style={{ height: "220px", objectFit: "cover" }}
      />

      <div className="card-body d-flex flex-column">
        <h6 className="card-title fw-semibold">{product.title}</h6>

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