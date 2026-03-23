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

  useEffect(() => {
    async function loadWishlist() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/wishlist`);
        if (!res.ok) throw new Error(`Wishlist fetch failed: ${res.status}`);
        const data = await res.json();
        setWishlist(extractWishlist(data));
      } catch (err) {
        console.error("Load wishlist error:", err);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    }

    loadWishlist();
  }, [setWishlist]);

  async function removeFromWishlist(id) {
    try {
      const res = await fetch(`${BASE_URL}/api/wishlist/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Remove wishlist failed: ${res.status}`);
      const data = await res.json();
      setWishlist(extractWishlist(data));
    } catch (err) {
      console.error("Remove from wishlist error:", err);
    }
  }

  async function moveToCart(product) {
    try {
      const res = await fetch(`${BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error(`Move to cart failed: ${res.status}`);

      const cartData = await res.json();
      setCart(extractCart(cartData));

      await removeFromWishlist(product._id || product.id);
    } catch (err) {
      console.error("Move to cart error:", err);
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <h2 className="mb-4 fw-bold">Your Wishlist</h2>
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
          <h5 className="mb-0">Loading wishlist...</h5>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container py-5">
        <h2 className="mb-4 fw-bold">Your Wishlist</h2>
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
          <h5 className="mb-0">Your wishlist is empty</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Your Wishlist</h2>

      <div className="row g-4">
        {wishlist.map((item) => {
          const itemId = item._id || item.id;
          const inCart = cart?.some((c) => (c._id || c.id) === itemId);

          return (
            <div key={itemId} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="mb-1">{item.title}</h6>
                  <p className="fw-semibold text-primary mb-3">₹ {item.price}</p>

                  <button
                    className="btn btn-primary rounded-3 mb-2"
                    onClick={() => moveToCart(item)}
                    disabled={inCart}
                  >
                    {inCart ? "Already in Cart" : "Move to Cart"}
                  </button>

                  <button
                    className="btn btn-outline-danger rounded-3"
                    onClick={() => removeFromWishlist(itemId)}
                  >
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