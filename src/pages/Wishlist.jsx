import { useEffect } from "react";

const BASE_URL = "https://m-ecommerce-backend.vercel.app";

function Wishlist({ wishlist, setWishlist, cart, setCart }) {

  useEffect(() => {
    fetch(`${BASE_URL}/api/wishlist`)
      .then((res) => res.json())
      .then((data) => setWishlist(data.data.wishlist))
      .catch((err) => console.error(err));
  }, []);

  async function removeFromWishlist(id) {
    try {
      const res = await fetch(`${BASE_URL}/api/wishlist/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setWishlist(data.data.wishlist);
    } catch (err) {
      console.error(err);
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

      const cartData = await res.json();
      setCart(cartData.data.cart);

      await removeFromWishlist(product._id);

    } catch (err) {
      console.error(err);
    }
  }

  if (wishlist.length === 0) {
    return (
      <div className="container py-5">
        <h2 className="mb-4">Your Wishlist</h2>

        <div className="card shadow-sm p-5 text-center">
          <h5 className="mb-0">Your wishlist is empty</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Your Wishlist</h2>

      {wishlist.map((item) => (
        <div key={item._id} className="card mb-3">
          <div className="card-body">
            <h5>{item.title}</h5>
            <p>₹ {item.price}</p>

            <button
              className="btn btn-primary btn-sm me-2"
              onClick={() => moveToCart(item)}
            >
              Move to Cart
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeFromWishlist(item._id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Wishlist;