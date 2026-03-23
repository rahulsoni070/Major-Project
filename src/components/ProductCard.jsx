import { Link } from "react-router-dom";
import { getStableImage } from "../utils/productImages";

function ProductCard({ product, setCart, setWishlist }) {
  const id = product._id || product.id;

  function addToCart() {
    setCart((prev) => {
      const existing = prev.find((p) => (p._id || p.id) === id);
      if (existing) {
        return prev.map((p) => ((p._id || p.id) === id ? { ...p, quantity: (p.quantity || 1) + 1 } : p));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function addToWishlist() {
    setWishlist((prev) => {
      const exists = prev.some((p) => (p._id || p.id) === id);
      return exists ? prev : [...prev, product];
    });
  }

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
      <Link to={`/products/${id}`} className="text-decoration-none text-dark">
        <img src={getStableImage(product)} alt={product.title} className="card-img-top product-img" />
      </Link>
      <div className="card-body d-flex flex-column">
        <Link to={`/products/${id}`} className="text-decoration-none text-dark">
          <h6 className="fw-semibold">{product.title}</h6>
        </Link>
        <p className="fw-bold text-primary mb-1">₹ {product.price}</p>
        <small className="text-muted mb-3">⭐ {product.rating}</small>
        <button className="btn btn-primary mt-auto mb-2" onClick={addToCart}>Add to Cart</button>
        <button className="btn btn-outline-danger" onClick={addToWishlist}>Add to Wishlist</button>
      </div>
    </div>
  );
}

export default ProductCard;