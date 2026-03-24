import { useNavigate } from "react-router-dom";
import { getStableImage } from "../utils/productImages";

function Cart({ cart, setCart, setWishlist }) {
  const navigate = useNavigate();

  const increaseQty = (id, size) => {
    setCart((prev) =>
      prev.map((item) =>
        (item._id || item.id) === id && (item.size || "M") === (size || "M")
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id, size) => {
    setCart((prev) =>
      prev
        .map((item) =>
          (item._id || item.id) === id && (item.size || "M") === (size || "M")
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity || 1) > 0)
    );
  };

  const removeFromCart = (id, size) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !((item._id || item.id) === id && (item.size || "M") === (size || "M"))
      )
    );
  };

  const moveToWishlist = (item) => {
    const id = item._id || item.id;
    setWishlist((prev) => {
      const exists = prev.some((w) => (w._id || w.id) === id);
      return exists ? prev : [...prev, { ...item }];
    });
    removeFromCart(id, item.size || "M");
  };

  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  const discount = Math.round(subtotal * 0.1);
  const delivery = subtotal > 0 ? 99 : 0;
  const totalAmount = subtotal - discount + delivery;

  if (!cart.length) {
    return (
      <div className="container py-5">
        <h3 className="fw-bold mb-3">MY CART (0)</h3>
        <div className="card p-5 text-center border-0 shadow-sm rounded-4">Your cart is empty</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h4 className="fw-bold text-center mb-4">MY CART ({totalItems})</h4>
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          {cart.map((item) => {
            const id = item._id || item.id;
            const size = item.size || "M";
            const price = Number(item.price || 0);
            const original = Math.round(price * 1.5);

            return (
              <div key={`${id}-${size}`} className="card border-0 shadow-sm rounded-3 p-3 mb-3">
                <div className="row g-3 align-items-center">
                  <div className="col-4 col-md-3">
                    <img src={getStableImage(item)} alt={item.title} className="w-100 rounded-2" style={{ height: 140, objectFit: "cover" }} />
                  </div>
                  <div className="col-8 col-md-9">
                    <h6 className="mb-1">{item.title}</h6>
                    <small className="d-block text-muted mb-1">Size: {size}</small>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold fs-5">₹{price}</span>
                      <small className="text-muted text-decoration-line-through">₹{original}</small>
                    </div>
                    <small className="text-success">50% off</small>

                    <div className="d-flex align-items-center gap-2 mt-2 mb-3">
                      <small className="fw-semibold">Quantity:</small>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => decreaseQty(id, size)}>−</button>
                      <span>{item.quantity || 1}</span>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => increaseQty(id, size)}>+</button>
                    </div>

                    <div className="d-grid gap-2 d-md-flex">
                      <button className="btn btn-outline-dark btn-sm" onClick={() => removeFromCart(id, size)}>Remove from Cart</button>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => moveToWishlist(item)}>Move to Wishlist</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 p-3 sticky-top" style={{ top: 90 }}>
            <h6 className="fw-bold mb-3">PRICE DETAILS</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>Price ({totalItems} item)</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Discount</span>
              <span className="text-success">− ₹{discount}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span>Delivery Charges</span>
              <span>₹{delivery}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold mb-2">
              <span>TOTAL AMOUNT</span>
              <span>₹{totalAmount}</span>
            </div>
            <small className="text-success d-block mb-3">You will save ₹{discount} on this order</small>
            <button className="btn btn-primary w-100" onClick={() => navigate("/checkout")}>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;