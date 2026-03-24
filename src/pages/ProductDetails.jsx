import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/api";
import { getStableImage } from "../utils/productImages";

function ProductDetails({ cart, setCart, wishlist, setWishlist }) {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("M");

  useEffect(() => {
    (async () => {
      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setProducts(list);
      setProduct(list.find((p) => String(p._id || p.id) === String(id)));
    })();
  }, [id]);

  const pid = product?._id || product?.id;
  const inCart = cart.some((i) => (i._id || i.id) === pid);
  const inWishlist = wishlist.some((i) => (i._id || i.id) === pid);

  const originalPrice = useMemo(() => {
    if (!product) return 0;
    return Math.round(Number(product.price) * 1.5);
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => (p._id || p.id) !== pid)
      .filter((p) => p.category === product.category)
      .slice(0, 4);
  }, [products, product, pid]);

  function addToCart() {
    if (!product) return;
    setCart((prev) => {
      const existing = prev.find((p) => (p._id || p.id) === pid);
      if (existing) {
        return prev.map((p) =>
          (p._id || p.id) === pid
            ? { ...p, quantity: (p.quantity || 1) + qty, size }
            : p
        );
      }
      return [...prev, { ...product, quantity: qty, size }];
    });
  }

  function addToWishlist() {
    if (!product) return;
    setWishlist((prev) =>
      prev.some((p) => (p._id || p.id) === pid) ? prev : [...prev, product]
    );
  }

  if (!product) return <div className="container py-5">Loading product...</div>;

  return (
    <div className="container py-4">
      <Link to="/products" className="btn btn-outline-secondary mb-3">
        ← Back to Products
      </Link>

      <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="border rounded-3 p-2 bg-light">
              <img
                src={getStableImage(product)}
                alt={product.title}
                className="w-100 rounded-3"
                style={{ height: 360, objectFit: "cover" }}
              />
            </div>

            <div className="d-grid gap-2 mt-3">
              <button className="btn btn-primary" onClick={addToCart}>
                {inCart ? "Add More to Cart" : "Add to Cart"}
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={addToWishlist}
                disabled={inWishlist}
              >
                {inWishlist ? "In Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>

          <div className="col-md-8">
            <h3 className="fw-bold mb-2">{product.title}</h3>
            <p className="text-muted mb-1">Category: {product.category}</p>
            <div className="mb-2">⭐ {product.rating}</div>

            <div className="d-flex align-items-center gap-2 mb-1">
              <h3 className="text-dark mb-0">₹{product.price}</h3>
              <small className="text-muted text-decoration-line-through">
                ₹{originalPrice}
              </small>
            </div>
            <small className="text-success fw-semibold">50% off</small>

            {/* Quantity */}
            <div className="mt-3 d-flex align-items-center gap-2">
              <span className="fw-semibold">Quantity:</span>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span>{qty}</span>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>

            {/* Size */}
            <div className="mt-3 d-flex align-items-center gap-2 flex-wrap">
              <span className="fw-semibold me-1">Size:</span>
              {["S", "M", "L", "XL"].map((s) => (
                <button
                  key={s}
                  className={`btn btn-sm ${
                    size === s ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="row g-2 mt-3">
              <div className="col-6 col-md-3">
                <div className="border rounded-3 p-2 text-center small">🚚 Fast Delivery</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="border rounded-3 p-2 text-center small">💸 Pay on Delivery</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="border rounded-3 p-2 text-center small">🔁 Easy Return</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="border rounded-3 p-2 text-center small">🔒 Secure Payment</div>
              </div>
            </div>

            <hr className="my-4" />
            <h6 className="fw-bold">Description</h6>
            <ul className="small text-muted ps-3 mb-0">
              <li>Premium quality fabric with long-lasting durability.</li>
              <li>Comfort fit for daily wear and all-day use.</li>
              <li>Perfect for casual outings and semi-formal looks.</li>
              <li>Easy care material and excellent finish.</li>
            </ul>
          </div>
        </div>
        
        {related.length > 0 && (
          <>
            <hr className="my-4" />
            <h6 className="fw-bold mb-3">More items you may like</h6>
            <div className="row g-3">
              {related.map((item) => (
                <div key={item._id || item.id} className="col-6 col-md-3">
                  <Link
                    to={`/products/${item._id || item.id}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="card h-100 border-0 shadow-sm">
                      <img
                        src={getStableImage(item)}
                        alt={item.title}
                        style={{ height: 160, objectFit: "cover" }}
                      />
                      <div className="card-body p-2">
                        <p className="small mb-1">{item.title}</p>
                        <p className="fw-bold mb-0">₹{item.price}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;