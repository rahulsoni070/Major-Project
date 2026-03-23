import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/api";

function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  function extractCart(data) {
    return data?.data?.cart || data?.cart || (Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    async function loadCart() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/cart`);
        if (!res.ok) throw new Error(`Cart fetch failed: ${res.status}`);
        const data = await res.json();
        setCart(extractCart(data));
      } catch (err) {
        console.error("Load cart error:", err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, [setCart]);

  async function increaseQty(id) {
    try {
      const res = await fetch(`${BASE_URL}/api/cart/${id}`, { method: "POST" });
      if (!res.ok) throw new Error(`Increase qty failed: ${res.status}`);
      const data = await res.json();
      setCart(extractCart(data));
    } catch (err) {
      console.error("Increase qty error:", err);
    }
  }

  async function decreaseQty(id) {
    try {
      const res = await fetch(`${BASE_URL}/api/cart/decrease/${id}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Decrease qty failed: ${res.status}`);
      const data = await res.json();
      setCart(extractCart(data));
    } catch (err) {
      console.error("Decrease qty error:", err);
    }
  }

  async function removeFromCart(id) {
    try {
      const res = await fetch(`${BASE_URL}/api/cart/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Remove failed: ${res.status}`);
      const data = await res.json();
      setCart(extractCart(data));
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <h2 className="mb-4 fw-bold">Your Cart</h2>
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
          <h5 className="mb-0">Loading cart...</h5>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container py-5">
        <h2 className="mb-4 fw-bold">Your Cart</h2>
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
          <h5 className="mb-0">Your cart is empty</h5>
        </div>
      </div>
    );
  }

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity || 1),
    0
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Your Cart</h2>

      <div className="row g-4">
        <div className="col-lg-8">
          {cart.map((item) => {
            const itemId = item._id || item.id;
            return (
              <div key={itemId} className="card border-0 shadow-sm rounded-4 mb-3 p-3">
                <div className="d-flex gap-3 align-items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "12px" }}
                  />

                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.title}</h6>
                    <p className="mb-2 fw-semibold text-primary">₹ {item.price}</p>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => decreaseQty(itemId)}
                      >
                        −
                      </button>

                      <span className="px-2">{item.quantity || 1}</span>

                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => increaseQty(itemId)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromCart(itemId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 sticky-top" style={{ top: "90px" }}>
            <h5 className="mb-3">Price Details</h5>
            <p className="mb-2">Total Items: {cart.length}</p>
            <h5 className="mb-3">Total Price: ₹ {totalPrice}</h5>

            <button
              className="btn btn-success w-100 rounded-3"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;