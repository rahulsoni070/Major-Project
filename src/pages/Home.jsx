import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/api";
import { getStableImage } from "../utils/productImages";

function Home({ setCart, setWishlist }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    })();
  }, []);

  const featured = useMemo(() => products.slice(0, 4), [products]);

  const addToCart = (product) => {
    const id = product._id || product.id;
    setCart((prev) => {
      const existing = prev.find((p) => (p._id || p.id) === id);
      if (existing) {
        return prev.map((p) =>
          (p._id || p.id) === id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const addToWishlist = (product) => {
    const id = product._id || product.id;
    setWishlist((prev) => {
      const exists = prev.some((w) => (w._id || w.id) === id);
      return exists ? prev : [...prev, product];
    });
  };

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-7">
            <h1 className="fw-bold mb-2">Welcome to ShopEasy</h1>
            <p className="text-muted mb-3">Shop fashion and electronics with a smooth and fast experience.</p>
            <div className="d-flex gap-2">
              <Link to="/products" className="btn btn-primary">Explore Products</Link>
              <Link to="/cart" className="btn btn-outline-secondary">Go to Cart</Link>
            </div>
          </div>
          <div className="col-md-5">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200"
              alt="Hero"
              className="w-100 rounded-3"
              style={{ height: 240, objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      <h4 className="fw-bold mb-3">Featured Products</h4>
      <div className="row g-4">
        {featured.map((p) => (
          <div key={p._id || p.id} className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <Link to={`/products/${p._id || p.id}`} className="text-decoration-none text-dark">
                <img src={getStableImage(p)} alt={p.title} style={{ height: 200, objectFit: "cover", width: "100%" }} />
              </Link>
              <div className="card-body">
                <h6>{p.title}</h6>
                <p className="fw-bold text-primary mb-1">₹ {p.price}</p>
                <small className="text-muted">⭐ {p.rating}</small>
                <button className="btn btn-primary w-100 mt-2" onClick={() => addToCart(p)}>Add to Cart</button>
                <button className="btn btn-outline-danger w-100 mt-2" onClick={() => addToWishlist(p)}>Add to Wishlist</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;