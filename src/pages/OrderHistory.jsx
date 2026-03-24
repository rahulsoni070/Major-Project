function OrderHistory({ orders = [] }) {
  return (
    <div className="container py-4">
      <h2 className="mb-4">Order History</h2>

      {orders.length === 0 ? (
        <div className="card p-4">No orders yet.</div>
      ) : (
        <div className="d-grid gap-3">
          {orders.map((order) => (
            <div key={order.id} className="card p-3">
              <div className="d-flex justify-content-between flex-wrap">
                <div>
                  <div className="fw-bold">Order ID: {order.id.slice(0, 8).toUpperCase()}</div>
                  <div className="text-muted">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="fw-bold">₹ {order.totalAmount}</div>
              </div>
              <hr />
              <div className="small mb-2">
                Deliver to: {order.address?.name}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
              </div>
              <ul className="mb-0">
                {order.items.map((item, idx) => (
                  <li key={`${item._id || item.id}-${item.size || "M"}-${idx}`}>
                    {item.title} | Qty: {item.quantity || 1} | Size: {item.size || "M"} | ₹ {item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;