function Checkout({
  cart,
  setCart,
  addresses,
  setAddresses,
  selectedAddressId,
  setSelectedAddressId
}) {
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>

      <h4 className="mt-4">Delivery Address</h4>

      <button
        className="btn btn-outline-primary mb-3"
        onClick={() =>
          setAddresses([
            ...addresses,
            {
              id: Date.now(),
              name: "Rahul Soni",
              street: "Jaipur, Rajasthan",
              phone: "9999999999"
            }
          ])
        }
      >
        Add Address
      </button>

      {addresses.map(address => (
        <div key={address.id} className="card p-3 mb-2">
          <label>
            <input
              type="radio"
              name="address"
              checked={selectedAddressId === address.id}
              onChange={() => setSelectedAddressId(address.id)}
            />
            <strong className="ms-2">{address.name}</strong>
          </label>
          <p className="mb-0">{address.street}</p>
          <p className="mb-0">{address.phone}</p>
        </div>
      ))}

      <div className="card p-3 mt-4">
        <h4>Order Summary</h4>
        <p>Total Items: {cart.length}</p>
        <h5>Total Amount: ₹ {totalPrice}</h5>

        <button
          className="btn btn-success w-100 mt-3"
          disabled={!selectedAddressId}
          onClick={() => {
            alert("Order Placed Successfully 🎉")
            setCart([])
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  )
}

export default Checkout
