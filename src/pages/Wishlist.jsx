function Wishlist({ wishlist, setWishlist, cart, setCart }) {

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

  function removeFromWishlist(id) {
    const updatedWishlist = wishlist.filter(item => item.id !== id)
    setWishlist(updatedWishlist)
  }

  function moveToCart(product) {
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      setCart(updatedCart)
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }

    removeFromWishlist(product.id)
  }

  return (
    <div className="container mt-4">
      <h2>Your Wishlist</h2>

      {wishlist.map(item => (
        <div key={item.id} className="card mb-3">
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
              onClick={() => removeFromWishlist(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Wishlist
