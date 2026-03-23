import { useNavigate } from "react-router-dom";

function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  function increaseQty(id) {
    setCart((prev) =>
      prev.map((item) =>
        (item._id || item.id) === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  }

  function decreaseQty(id) {
    setCart((prev) =>
      prev
        .map((item) =>
          (item._id || item.id) === id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== id));
  }

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  if (!cart.length) {
    return <div className="container py-5"><h5>Your cart is empty</h5></div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Your Cart</h2>

      <div className="row g-4">
        <div className="col-lg-8">
          {cart.map((item) => {
            const id = item._id || item.id;
            return (
              <div key={id} className="card border-0 shadow-sm rounded-4 mb-3 p-3">
                <div className="d-flex gap-3 align-items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 12 }}
                  />
                  <div className="flex-grow-1">
                    <h6>{item.title}</h6>
                    <p className="fw-semibold text-primary mb-2">₹ {item.price}</p>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => decreaseQty(id)}>−</button>
                      <span>{item.quantity}</span>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => increaseQty(id)}>+</button>
                    </div>
                  </div>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(id)}>
                    Remove
                  </button>
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