import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const BASE_URL = "https://m-ecommerce-backend.vercel.app";

function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/cart`)
      .then((res) => res.json())
      .then((data) => setCart(data.data.cart))
      .catch((err) => console.error(err));
  }, []);

  async function increaseQty(id) {
    try {
      const res = await fetch(`${BASE_URL}/api/cart/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      setCart(data.data.cart);
    } catch (err) {
      console.error(err);
    }
  }

  async function decreaseQty(id) {
    try {
      const res = await fetch(`${BASE_URL}/api/cart/decrease/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      setCart(data.data.cart);
    } catch (err) {
      console.error(err);
    }
  }

  async function removeFromCart(id) {
    try {
      const res = await fetch(`${BASE_URL}/api/cart/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setCart(data.data.cart);
    } catch (err) {
      console.error(err);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <h2 className="mb-4">Your Cart</h2>
        <div className="card shadow-sm p-5 text-center">
          <h5 className="mb-0">Your cart is empty</h5>
        </div>
      </div>
    );
  }

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>

      {cart.map((item) => (
        <div key={item._id} className="card mb-3 p-3">
          <h5>{item.title}</h5>
          <p>Price: ₹ {item.price}</p>

          <div className="d-flex align-items-center mb-2">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => decreaseQty(item._id)}
            >
              −
            </button>

            <span className="mx-3">{item.quantity}</span>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => increaseQty(item._id)}
            >
              +
            </button>
          </div>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => removeFromCart(item._id)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="card p-3 mt-4">
        <h4>Price Details</h4>
        <p>Total Items: {cart.length}</p>
        <h5>Total Price: ₹ {totalPrice}</h5>

        <button
          className="btn btn-success w-100 mt-2"
          onClick={() => navigate("/checkout")}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;