import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/api";

function Wishlist({ wishlist, setWishlist, cart, setCart }) {
  const [loading, setLoading] = useState(true);

  function extractWishlist(data) {
    return data?.data?.wishlist || data?.wishlist || (Array.isArray(data) ? data : []);
  }

  function extractCart(data) {
    return data?.data?.cart || data?.cart || (Array.isArray(data) ? data : []);
  }

  async function loadProductsMap() {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.data?.products || [];
    const map = new Map();
    list.forEach((p) => map.set(String(p._id || p.id), p));
    return map;
  }

  function normalizeItems(rawItems, productsMap) {
    return (rawItems || []).map((item) => {
      const id = String(item._id || item.id || item.productId || "");
      const full = productsMap.get(id) || {};
      return {
        ...full,
        ...item,
        _id: item._id || item.id || item.productId || full._id || full.id,
        title: item.title || full.title || "Untitled Product",
        image: item.image || full.image || "https://via.placeholder.com/200x200?text=No+Image",
        price: Number(item.price ?? full.price ?? 0),
      };
    });
  }

  useEffect(() => {
    async function loadWishlist() {
      try {
        setLoading(true);
        const [wRes, productsMap] = await Promise.all([
          fetch(`${BASE_URL}/api/wishlist`),
          loadProductsMap(),
        ]);
        const wData = await wRes.json();
        setWishlist(normalizeItems(extractWishlist(wData), productsMap));
      } catch (err) {
        console.error(err);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, [setWishlist]);

  async function removeFromWishlist(id) {
    try {
      const [res, productsMap] = await Promise.all([
        fetch(`${BASE_URL}/api/wishlist/${id}`, { method: "DELETE" }),
        loadProductsMap(),
      ]);
      const data = await res.json();
      setWishlist(normalizeItems(extractWishlist(data), productsMap));
    } catch (err) {
      console.error(err);
    }
  }

  async function moveToCart(product) {
    try {
      const id = product._id || product.id || product.productId;
      const [cartRes, productsMap] = await Promise.all([
        fetch(`${BASE_URL}/api/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        }),
        loadProductsMap(),
      ]);
      const cartData = await cartRes.json();
      setCart(normalizeItems(extractCart(cartData), productsMap).map((x) => ({ ...x, quantity: x.quantity || 1 })));
      await removeFromWishlist(id);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="container py-5"><h5>Loading wishlist...</h5></div>;
  if (!wishlist?.length) return <div className="container py-5"><h5>Your wishlist is empty</h5></div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Your Wishlist</h2>
      <div className="row g-4">
        {wishlist.map((item) => {
          const itemId = item._id || item.id || item.productId;
          const inCart = cart?.some((c) => String(c._id || c.id || c.productId) === String(itemId));
          return (
            <div key={itemId} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <img src={item.image} alt={item.title} style={{ height: 220, objectFit: "cover" }} />
                <div className="card-body d-flex flex-column">
                  <h6>{item.title}</h6>
                  <p className="fw-semibold text-primary">₹ {item.price}</p>
                  <button className="btn btn-primary mb-2" onClick={() => moveToCart(item)} disabled={inCart}>
                    {inCart ? "Already in Cart" : "Move to Cart"}
                  </button>
                  <button className="btn btn-outline-danger" onClick={() => removeFromWishlist(itemId)}>
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