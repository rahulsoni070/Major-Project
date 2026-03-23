import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/api";
import { getStableImage } from "../utils/productImages";

function ProductDetails({ cart, setCart, wishlist, setWishlist }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setProduct(list.find((p) => String(p._id || p.id) === String(id)));
    })();
  }, [id]);

  if (!product) return <div className="container py-5">Loading product...</div>;

  const pid = product._id || product.id;
  const inCart = cart.some((i) => (i._id || i.id) === pid);
  const inWishlist = wishlist.some((i) => (i._id || i.id) === pid);

  function addToCart() {
    setCart((prev) => {
      const existing = prev.find((p) => (p._id || p.id) === pid);
      if (existing) return prev.map((p) => ((p._id || p.id) === pid ? { ...p, quantity: (p.quantity || 1) + 1 } : p));
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function addToWishlist() {
    setWishlist((prev) => (prev.some((p) => (p._id || p.id) === pid) ? prev : [...prev, product]));
  }

  return (
    <div className="container py-4">
      <Link to="/products" className="btn btn-outline-secondary mb-3">← Back to Products</Link>
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-4">
            <img src={getStableImage(product)} alt={product.title} className="w-100 h-100" style={{ objectFit: "cover", minHeight: 380 }} />
          </div>
          <div className="col-md-8">
            <div className="card-body p-4">
              <h2 className="fw-bold">{product.title}</h2>
              <p className="text-muted mb-2">Category: {product.category}</p>
              <h3 className="text-primary">₹ {product.price}</h3>
              <p>⭐ {product.rating}</p>
              <p>Premium quality product for your daily use.</p>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={addToCart} disabled={inCart}>{inCart ? "Already in Cart" : "Add to Cart"}</button>
                <button className="btn btn-outline-danger" onClick={addToWishlist} disabled={inWishlist}>{inWishlist ? "In Wishlist" : "Add to Wishlist"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;