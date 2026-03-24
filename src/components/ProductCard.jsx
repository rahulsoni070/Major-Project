import { Link } from "react-router-dom";
import { getStableImage } from "../utils/productImages";

function ProductCard({ product, setCart, setWishlist }) {
  const id = product._id || product.id;

  const addToCart = () => {
    setCart((prev) => {
      const existing = prev.find((p) => (p._id || p.id) === id && (p.size || "M") === "M");
      if (existing) {
        return prev.map((p) =>
          (p._id || p.id) === id && (p.size || "M") === "M"
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        );
      }
      return [...prev, { ...product, size: "M", quantity: 1 }];
    });
  };

  const addToWishlist = () => {
    setWishlist((prev) => {
      const exists = prev.some((p) => (p._id || p.id) === id);
      return exists ? prev : [...prev, product];
    });
  };

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
      <Link to={`/products/${id}`} className="text-decoration-none text-dark">
        <img
          src={getStableImage(product)}
          alt={product.title}
          className="w-100 product-img"
        />
      </Link>
      <div className="card-body">
        <h6>{product.title}</h6>
        <p className="fw-bold text-primary mb-1">₹ {product.price}</p>
        <small className="text-muted">⭐ {product.rating}</small>
        <button className="btn btn-primary w-100 mt-2" onClick={addToCart}>
          Add to Cart
        </button>
        <button className="btn btn-outline-danger w-100 mt-2" onClick={addToWishlist}>
          Add to Wishlist
        </button>
      </div>
    </div>
  );
}

export default ProductCard;