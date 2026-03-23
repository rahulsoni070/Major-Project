import { Link } from "react-router-dom";

function ProductCard({ product, setCart, setWishlist }) {
  const productId = product._id || product.id;

  function addToCart() {
    setCart((prev) => {
      const existing = prev.find((p) => (p._id || p.id) === productId);
      if (existing) {
        return prev.map((p) =>
          (p._id || p.id) === productId
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function addToWishlist() {
    setWishlist((prev) => {
      const exists = prev.some((p) => (p._id || p.id) === productId);
      return exists ? prev : [...prev, product];
    });
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