import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../utils/api";

function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [productsMap, setProductsMap] = useState({});

  const getCart = (d) => d?.data?.cart || d?.cart || [];

  async function loadProducts() {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    const map = {};
    arr.forEach((p) => (map[String(p._id)] = p));
    setProductsMap(map);
  }

  async function loadCart() {
    const res = await fetch(`${BASE_URL}/api/cart`);
    const data = await res.json();
    setCart(getCart(data));
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await Promise.all([loadProducts(), loadCart()]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const viewCart = cart.map((item) => {
    const pid = String(item.productId || item._id || item.id || "");
    const p = productsMap[pid] || {};
    return {
      ...item,
      productId: pid,
      title: p.title || item.title || "Untitled Product",
      image: p.image || item.image || "https://via.placeholder.com/200",
      price: Number(p.price ?? item.price ?? 0),
      quantity: Number(item.quantity || 1),
    };
  });

  async function increaseQty(productId) {
    const res = await fetch(`${BASE_URL}/api/cart/${productId}`, { method: "POST" });
    const data = await res.json();
    setCart(getCart(data));
  }

  async function decreaseQty(productId) {
    const res = await fetch(`${BASE_URL}/api/cart/decrease/${productId}`, { method: "POST" });
    const data = await res.json();
    setCart(getCart(data));
  }

  async function removeFromCart(productId) {
    const res = await fetch(`${BASE_URL}/api/cart/${productId}`, { method: "DELETE" });
    const data = await res.json();
    setCart(getCart(data));
  }

  const totalPrice = useMemo(
    () => viewCart.reduce((t, i) => t + i.price * i.quantity, 0),
    [viewCart]
  );

  if (loading) return <div className="container py-5">Loading cart...</div>;
  if (!viewCart.length) return <div className="container py-5">Your cart is empty</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Your Cart</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          {viewCart.map((item) => (
            <div key={item.productId} className="card border-0 shadow-sm rounded-4 mb-3 p-3">
              <div className="d-flex gap-3 align-items-center">
                <img src={item.image} alt={item.title} style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 12 }} />
                <div className="flex-grow-1">
                  <h6>{item.title}</h6>
                  <p className="text-primary fw-semibold">₹ {item.price}</p>
                  <div className="d-flex gap-2 align-items-center">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => decreaseQty(item.productId)}>−</button>
                    <span>{item.quantity}</span>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => increaseQty(item.productId)}>+</button>
                  </div>
                </div>
                <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(item.productId)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 sticky-top" style={{ top: 90 }}>
            <h5>Price Details</h5>
            <p>Total Items: {viewCart.length}</p>
            <h4>Total Price: ₹ {totalPrice}</h4>
            <button className="btn btn-success w-100" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;