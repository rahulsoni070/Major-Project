import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/api";
import { getStableImage } from "../utils/productImages";
import { toast } from "react-toastify";

function Home({ setCart, setWishlist }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        // Fallback handled gracefully
      }
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
    toast.success(`Added ${product.title} to cart`);
  };

  const addToWishlist = (product) => {
    const id = product._id || product.id;
    setWishlist((prev) => {
      const exists = prev.some((w) => (w._id || w.id) === id);
      if (exists) {
        toast.info("Item already in wishlist");
        return prev;
      }
      toast.success(`Added ${product.title} to wishlist`);
      return [...prev, product];
    });
  };

  return (
    <div className="container py-4">
      {/* Simple Hero Banner */}
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-white">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-7">
            <h1 className="fw-bold mb-2">Welcome to ShopEasy</h1>
            <p className="text-muted mb-4 lead fs-6">
              Shop fashion and electronics with a smooth, fast, and secure experience.
            </p>
            <div className="d-flex gap-2 flex-wrap">
              <Link to="/products" className="btn btn-primary px-4 py-2 rounded-3">
                Explore Products
              </Link>
              <Link to="/cart" className="btn btn-outline-secondary px-4 py-2 rounded-3">
                Go to Cart
              </Link>
            </div>
          </div>
          <div className="col-12 col-md-5 text-center">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200"
              alt="ShopEasy Hero"
              className="w-100 rounded-3 shadow-sm"
              style={{ maxHeight: 240, objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      {/* Simple Categories Strip */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6">
          <Link to="/products?category=electronics" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-3 bg-white hover-lift">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Electronics</h6>
                  <small className="text-muted">Headphones, smart accessories & more</small>
                </div>
                <span className="text-primary fw-semibold small">Browse →</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-12 col-sm-6">
          <Link to="/products?category=fashion" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-3 bg-white hover-lift">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Fashion</h6>
                  <small className="text-muted">Jackets, shirts, dresses & footwear</small>
                </div>
                <span className="text-primary fw-semibold small">Browse →</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Featured Products</h4>
        <Link to="/products" className="text-primary text-decoration-none small fw-semibold">
          View All Products →
        </Link>
      </div>

      <div className="row g-4">
        {featured.map((p) => {
          const id = p._id || p.id;
          return (
            <div key={id} className="col-12 col-sm-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <Link to={`/products/${id}`} className="text-decoration-none text-dark">
                  <img
                    src={getStableImage(p)}
                    alt={p.title}
                    className="w-100"
                    style={{ height: 200, objectFit: "cover" }}
                  />
                </Link>
                <div className="card-body d-flex flex-column">
                  <h6 className="text-truncate fw-semibold mb-1" title={p.title}>
                    {p.title}
                  </h6>
                  <p className="fw-bold text-primary mb-1">₹ {p.price}</p>
                  <small className="text-muted mb-3">⭐ {p.rating}</small>
                  <div className="mt-auto d-grid gap-2">
                    <button
                      className="btn btn-primary btn-sm rounded-2"
                      onClick={() => addToCart(p)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm rounded-2"
                      onClick={() => addToWishlist(p)}
                    >
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;