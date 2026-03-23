import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/api";

function Wishlist({ wishlist, setWishlist, cart, setCart }) {
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const getWishlist = (d) => d?.data?.wishlist || d?.wishlist || [];
  const getCart = (d) => d?.data?.cart || d?.cart || [];

  async function loadProducts() {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    const map = {};
    arr.forEach((p) => (map[String(p._id)] = p));
    setProductsMap(map);
  }

  async function loadWishlist() {
    const res = await fetch(`${BASE_URL}/api/wishlist`);
    const data = await res.json();
    setWishlist(getWishlist(data));
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Promise.all([loadProducts(), loadWishlist()]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const viewWishlist = wishlist.map((item) => {
    const pid = String(item.productId || item._id || item.id || "");
    const p = productsMap[pid] || {};
    return {
      ...item,
      productId: pid,
      title: p.title || item.title || "Untitled Product",
      image: p.image || item.image || "https://via.placeholder.com/200",
      price: Number(p.price ?? item.price ?? 0),
    };
  });

  async function removeFromWishlist(productId) {
    const res = await fetch(`${BASE_URL}/api/wishlist/${productId}`, { method: "DELETE" });
    const data = await res.json();
    setWishlist(getWishlist(data));
  }

  async function moveToCart(item) {
    const productId = item.productId;
    const cartRes = await fetch(`${BASE_URL}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const cartData = await cartRes.json();
    setCart(getCart(cartData));
    await removeFromWishlist(productId);
  }

  if (loading) return <div className="container py-5">Loading wishlist...</div>;
  if (!viewWishlist.length) return <div className="container py-5">Your wishlist is empty</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Your Wishlist</h2>
      <div className="row g-4">
        {viewWishlist.map((item) => {
          const inCart = cart?.some((c) => String(c.productId || c._id || c.id) === item.productId);
          return (
            <div key={item.productId} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <img src={item.image} alt={item.title} style={{ height: 220, objectFit: "cover" }} />
                <div className="card-body d-flex flex-column">
                  <h6>{item.title}</h6>
                  <p className="fw-semibold text-primary">₹ {item.price}</p>
                  <button className="btn btn-primary mb-2" disabled={inCart} onClick={() => moveToCart(item)}>
                    {inCart ? "Already in Cart" : "Move to Cart"}
                  </button>
                  <button className="btn btn-outline-danger" onClick={() => removeFromWishlist(item.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Wishlist;