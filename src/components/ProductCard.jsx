function ProductCard({ product, addToCart, addToWishlist }) {
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
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>

        <button
          className="btn btn-outline-danger"
          onClick={() => addToWishlist(product)}
        >
          Add to Wishlist
        </button>
      </div>
    </div>
  );
}

export default ProductCard;