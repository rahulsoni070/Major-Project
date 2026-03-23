const BASE_URL = "https://m-ecommerce-backend.vercel.app";

function ProductCard({ product, setCart, setWishlist }) {

  async function addToCart() {
    try {
      const res = await fetch(`${BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();
      setCart(data.data.cart); // backend updated cart
    } catch (err) {
      console.error(err);
    }
  }

  async function addToWishlist() {
    try {
      const res = await fetch(`${BASE_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();
      setWishlist(data.data.wishlist); // backend updated wishlist
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={product.image}
        alt={product.title}
        className="card-img-top product-img"
      />

      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{product.title}</h6>

        <p className="fw-bold text-primary mb-1">
          ₹ {product.price}
        </p>

        <small className="text-muted mb-2">
          ⭐ {product.rating}
        </small>

        <button
          className="btn btn-primary mt-auto mb-2"
          onClick={addToCart}
        >
          Add to Cart
        </button>

        <button
          className="btn btn-outline-danger"
          onClick={addToWishlist}
        >
          Add to Wishlist
        </button>
      </div>
    </div>
  );
}

export default ProductCard;