import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../utils/api";

function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  function normalizeCartItems(rawCart, productsMap) {
    return (rawCart || []).map((item) => {
      const id = String(item._id || item.id || item.productId || "");
      const full = productsMap.get(id) || {};
      return {
        ...full,
        ...item,
        _id: item._id || item.id || item.productId || full._id || full.id,
        title: item.title || full.title || "Untitled Product",
        image: item.image || full.image || "https://via.placeholder.com/200x200?text=No+Image",
        price: Number(item.price ?? full.price ?? 0),
        quantity: Number(item.quantity || 1),
      };
    });
  }

  useEffect(() => {
    async function loadCart() {
      try {
        setLoading(true);

        const [cartRes, productsMap] = await Promise.all([
          fetch(`${BASE_URL}/api/cart`),
          loadProductsMap(),
        ]);

        if (!cartRes.ok) throw new Error(`Cart fetch failed: ${cartRes.status}`);
        const cartData = await cartRes.json();
        const rawCart = extractCart(cartData);

        setCart(normalizeCartItems(rawCart, productsMap));
      } catch (err) {
        console.error("Load cart error:", err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, [setCart]);

  async function refreshCartAfterAction(requestPromise) {
    try {
      const [res, productsMap] = await Promise.all([requestPromise, loadProductsMap()]);
      if (!res.ok) throw new Error(`Cart action failed: ${res.status}`);
      const data = await res.json();
      const rawCart = extractCart(data);
      setCart(normalizeCartItems(rawCart, productsMap));
    } catch (err) {
      console.error(err);
    }
  }

  function itemId(item) {
    return item._id || item.id || item.productId;
  }

  async function increaseQty(id) {
    await refreshCartAfterAction(fetch(`${BASE_URL}/api/cart/${id}`, { method: "POST" }));
  }

  async function decreaseQty(id) {
    await refreshCartAfterAction(fetch(`${BASE_URL}/api/cart/decrease/${id}`, { method: "POST" }));
  }

  async function removeFromCart(id) {
    await refreshCartAfterAction(fetch(`${BASE_URL}/api/cart/${id}`, { method: "DELETE" }));
  }

  const totalPrice = useMemo(
    () => cart.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 1), 0),
    [cart]
  );

  if (loading) {
    return <div className="container py-5"><h5>Loading cart...</h5></div>;
  }

  if (!cart?.length) {
    return <div className="container py-5"><h5>Your cart is empty</h5></div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Your Cart</h2>

      <div className="row g-4">
        <div className="col-lg-8">
          {cart.map((item) => {
            const id = itemId(item);
            return (
              <div key={id} className="card border-0 shadow-sm rounded-4 mb-3 p-3">
                <div className="d-flex gap-3 align-items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 12 }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.title}</h6>
                    <p className="mb-2 fw-semibold text-primary">₹ {item.price}</p>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => decreaseQty(id)}>−</button>
                      <span>{item.quantity}</span>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => increaseQty(id)}>+</button>
                    </div>
                  </div>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(id)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 sticky-top" style={{ top: 90 }}>
            <h5>Price Details</h5>
            <p>Total Items: {cart.length}</p>
            <h4>Total Price: ₹ {totalPrice}</h4>
            <button className="btn btn-success w-100 mt-2" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;