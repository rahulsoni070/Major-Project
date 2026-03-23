import { getStableImage } from "../utils/productImages";

function Wishlist({ wishlist, setWishlist, cart, setCart }) {
  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== id));
  };

  const moveToCart = (item) => {
    const id = item._id || item.id;

    setCart((prev) => {
      const existing = prev.find((p) => (p._id || p.id) === id);
      if (existing) {
        return prev.map((p) =>
          (p._id || p.id) === id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    removeFromWishlist(id);
  };

  if (!wishlist.length) {
    return (
      <div className="container py-5">
        <h3 className="fw-bold text-center mb-4">My Wishlist</h3>
        <div className="card p-5 text-center border-0 shadow-sm rounded-4">
          Your wishlist is empty
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h4 className="fw-bold text-center mb-4">My Wishlist</h4>

      <div className="row g-4">
        {wishlist.map((item) => {
          const id = item._id || item.id;
          const inCart = cart.some((c) => (c._id || c.id) === id);

          return (
            <div key={id} className="col-6 col-md-4 col-lg-3">
              <div className="card border-0 shadow-sm rounded-3 h-100 overflow-hidden position-relative">
                <button
                  className="btn btn-sm position-absolute top-0 end-0 m-2 bg-white rounded-circle border"
                  onClick={() => removeFromWishlist(id)}
                  title="Remove"
                >
                  ❤️
                </button>

                <img
                  src={getStableImage(item)}
                  alt={item.title}
                  style={{ height: 190, objectFit: "cover" }}
                />

                <div className="card-body text-center">
                  <p className="small mb-1">{item.title}</p>
                  <p className="fw-bold mb-2">₹{item.price}</p>

                  <button
                    className="btn btn-secondary btn-sm w-100"
                    disabled={inCart}
                    onClick={() => moveToCart(item)}
                  >
                    {inCart ? "Already in Cart" : "Move to Cart"}
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