import { useNavigate } from "react-router-dom";
import { getStableImage } from "../utils/productImages";

function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const inc = (id) => setCart((prev) => prev.map((i) => ((i._id || i.id) === id ? { ...i, quantity: i.quantity + 1 } : i)));
  const dec = (id) =>
    setCart((prev) =>
      prev
        .map((i) => ((i._id || i.id) === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  const remove = (id) => setCart((prev) => prev.filter((i) => (i._id || i.id) !== id));

  const total = cart.reduce((t, i) => t + Number(i.price) * Number(i.quantity), 0);

  if (!cart.length) return <div className="container py-5"><h5>Your cart is empty</h5></div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Your Cart</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          {cart.map((item) => {
            const id = item._id || item.id;
            return (
              <div key={id} className="card p-3 mb-3">
                <div className="d-flex align-items-center gap-3">
                  <img src={getStableImage(item)} alt={item.title} style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10 }} />
                  <div className="flex-grow-1">
                    <h6>{item.title}</h6>
                    <p className="text-primary fw-bold mb-2">₹ {item.price}</p>
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => dec(id)}>−</button>
                    <span>{item.quantity}</span>
                    <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => inc(id)}>+</button>
                  </div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(id)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-lg-4">
          <div className="card p-3 sticky-top" style={{ top: 90 }}>
            <h5>Price Details</h5>
            <p>Total Items: {cart.length}</p>
            <h4>Total Price: ₹ {total}</h4>
            <button className="btn btn-success w-100" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;