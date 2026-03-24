import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Checkout({
  cart,
  setCart,
  addresses,
  setAddresses,
  selectedAddressId,
  setSelectedAddressId,
  orders,
  setOrders
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", name: "", city: "", state: "", pincode: "", phone: "" });
  const [editingId, setEditingId] = useState(null);

  const totalItems = cart.reduce((s, i) => s + Number(i.quantity || 1), 0);
  const subtotal = cart.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 1), 0);
  const totalAmount = subtotal + (subtotal > 0 ? 99 : 0);

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId) || null,
    [addresses, selectedAddressId]
  );

  const resetForm = () => {
    setForm({ id: "", name: "", city: "", state: "", pincode: "", phone: "" });
    setEditingId(null);
  };

  const onSaveAddress = () => {
    if (!form.name || !form.city || !form.state || !form.pincode || !form.phone) {
      toast.error("Please fill all address fields");
      return;
    }
    if (editingId) {
      setAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...form, id: editingId } : a)));
      toast.success("Address updated");
    } else {
      const id = crypto.randomUUID();
      const next = { ...form, id };
      setAddresses((prev) => [...prev, next]);
      setSelectedAddressId(id);
      toast.success("Address added");
    }
    resetForm();
  };

  const onEditAddress = (address) => {
    setEditingId(address.id);
    setForm(address);
  };

  const onDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddressId === id) setSelectedAddressId(null);
    toast.info("Address deleted");
    if (editingId === id) resetForm();
  };

  const onPlaceOrder = () => {
    if (!cart.length) {
      toast.error("Cart is empty");
      return;
    }
    if (!selectedAddress) {
      toast.error("Select a delivery address");
      return;
    }

    const newOrder = {
      id: crypto.randomUUID(),
      items: cart,
      totalItems,
      totalAmount,
      address: selectedAddress,
      createdAt: new Date().toISOString()
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    toast.success("Order placed successfully");
    navigate("/orders");
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Checkout</h2>

      <div className="card p-3 mb-4">
        <h4>Delivery Address</h4>
        <div className="row g-2 mb-3">
          <div className="col-md-4"><input className="form-control" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="col-md-4 d-grid">
            <button className="btn btn-primary" onClick={onSaveAddress}>{editingId ? "Update Address" : "Add Address"}</button>
          </div>
        </div>

        <div className="row g-3">
          {addresses.map((a) => (
            <div key={a.id} className="col-md-6">
              <div className={`card p-3 ${selectedAddressId === a.id ? "border-primary" : ""}`}>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" checked={selectedAddressId === a.id} onChange={() => setSelectedAddressId(a.id)} />
                  <label className="form-check-label fw-semibold">{a.name}</label>
                </div>
                <div>{a.city}, {a.state}</div>
                <div>{a.pincode}</div>
                <div>{a.phone}</div>
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => onEditAddress(a)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDeleteAddress(a.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-3">
        <h4>Order Summary</h4>
        <p>Total Items: {totalItems}</p>
        <h3>Total Amount: ₹ {totalAmount}</h3>
        <button className="btn btn-success mt-2" onClick={onPlaceOrder}>Place Order</button>
      </div>
    </div>
  );
}

export default Checkout;