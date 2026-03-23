function Wishlist({ wishlist, setWishlist, cart, setCart }) {
  function removeFromWishlist(id) {
    setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== id));
  }

  function moveToCart(item) {
    const id = item._id || item.id;

    setCart((prev) => {
      const existing = prev.find((p) => (p._id || p.id) === id);
      if (existing) {
        return prev.map((p) =>
          (p._id || p.id) === id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    setWishlist((prev) => prev.filter((w) => (w._id || w.id) !== id));
  }

  if (!wishlist.length) {
    return <div className="container py-5"><h5>Your wishlist is empty</h5></div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Your Wishlist</h2>

      <div className="row g-4">
        {wishlist.map((item) => {
          const id = item._id || item.id;
          const inCart = cart.some((c) => (c._id || c.id) === id);

          return (
            <div key={id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <img src={item.image} alt={item.title} style={{ height: 220, objectFit: "cover" }} />
                <div className="card-body d-flex flex-column">
                  <h6>{item.title}</h6>
                  <p className="fw-semibold text-primary">₹ {item.price}</p>

                  <button
                    className="btn btn-primary mb-2"
                    disabled={inCart}
                    onClick={() => moveToCart(item)}
                  >
                    {inCart ? "Already in Cart" : "Move to Cart"}
                  </button>

                  <button className="btn btn-outline-danger" onClick={() => removeFromWishlist(id)}>
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