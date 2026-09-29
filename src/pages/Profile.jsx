import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  Package,
  LogOut,
  Edit2,
  CheckCircle,
  Plus,
  Trash2
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile, loginDemoUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const [addresses, setAddresses] = useState([]);
  const [newAddr, setNewAddr] = useState({
    name: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  });
  const [showAddAddr, setShowAddAddr] = useState(false);

  // Quick stats from localStorage
  const [stats, setStats] = useState({ cartCount: 0, wishlistCount: 0, orderCount: 0 });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      });
    }

    try {
      const c = JSON.parse(localStorage.getItem("cart") || "[]");
      const w = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const o = JSON.parse(localStorage.getItem("orders") || "[]");
      const a = JSON.parse(localStorage.getItem("addresses") || "[]");

      setStats({
        cartCount: c.reduce((s, i) => s + Number(i.quantity || 1), 0),
        wishlistCount: w.length,
        orderCount: o.length
      });
      setAddresses(a);
    } catch {
      // fallback
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    await updateProfile({
      name: form.name.trim(),
      phone: form.phone.trim()
    });
    setIsEditing(false);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.city || !newAddr.state || !newAddr.pincode || !newAddr.phone) {
      toast.error("Please fill in all address fields");
      return;
    }

    const updated = [...addresses, { ...newAddr, id: crypto.randomUUID() }];
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    setNewAddr({ name: "", city: "", state: "", pincode: "", phone: "" });
    setShowAddAddr(false);
    toast.success("Delivery address added!");
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
    toast.info("Address deleted");
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 text-center">
            <div className="card border-0 shadow-sm rounded-4 p-5 bg-white">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mx-auto mb-3 text-white"
                style={{
                  width: 72,
                  height: 72,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)"
                }}
              >
                <User size={36} />
              </div>
              <h3 className="fw-bold mb-2">Sign in to View Your Profile</h3>
              <p className="text-muted mb-4">
                Access your orders, saved addresses, personal details, and exclusive membership perks.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-3">
                <Link to="/login" className="btn btn-primary px-4 py-2 rounded-pill fw-semibold">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold">
                  Create Account
                </Link>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-link text-muted small text-decoration-none"
                  onClick={() => {
                    loginDemoUser();
                  }}
                >
                  ⚡ Or login with Instant Demo Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Profile Header Card */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-3 shadow-sm"
              style={{
                width: 70,
                height: 70,
                background: "linear-gradient(135deg, #2563eb, #7c3aed)"
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h3 className="fw-bold mb-0">{user?.name}</h3>
                <span className="badge bg-success-subtle text-success border border-success border-opacity-25 rounded-pill px-2 py-1 small d-flex align-items-center gap-1">
                  <CheckCircle size={12} /> Verified Member
                </span>
              </div>
              <p className="text-muted small mb-0">{user?.email}</p>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-1 px-3"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              <Edit2 size={16} />
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>
            <button
              className="btn btn-outline-danger rounded-pill d-flex align-items-center gap-1 px-3"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="row g-3 mt-3 pt-3 border-top">
          <div className="col-4">
            <Link to="/orders" className="text-decoration-none">
              <div className="p-3 bg-light rounded-3 text-center transition-hover">
                <Package size={22} className="text-primary mb-1" />
                <div className="fs-5 fw-bold text-dark">{stats.orderCount}</div>
                <div className="small text-muted">Orders Placed</div>
              </div>
            </Link>
          </div>
          <div className="col-4">
            <Link to="/wishlist" className="text-decoration-none">
              <div className="p-3 bg-light rounded-3 text-center transition-hover">
                <Heart size={22} className="text-danger mb-1" />
                <div className="fs-5 fw-bold text-dark">{stats.wishlistCount}</div>
                <div className="small text-muted">Wishlist Items</div>
              </div>
            </Link>
          </div>
          <div className="col-4">
            <Link to="/cart" className="text-decoration-none">
              <div className="p-3 bg-light rounded-3 text-center transition-hover">
                <ShoppingBag size={22} className="text-success mb-1" />
                <div className="fs-5 fw-bold text-dark">{stats.cartCount}</div>
                <div className="small text-muted">Cart Items</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Edit or Details Card */}
      {isEditing ? (
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <h5 className="fw-bold mb-3">Edit Personal Details</h5>
          <form onSubmit={handleSaveProfile} className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="form-control bg-light"
                  value={form.email}
                  disabled
                  title="Email cannot be changed"
                />
              </div>
              <small className="text-muted">Email is linked to your account.</small>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  className="form-control"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="col-12 mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary rounded-pill px-4">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <h5 className="fw-bold mb-3">Account Information</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <span className="text-muted small d-block">Full Name</span>
              <span className="fw-semibold">{user?.name || "Not specified"}</span>
            </div>
            <div className="col-md-4">
              <span className="text-muted small d-block">Email Address</span>
              <span className="fw-semibold">{user?.email || "Not specified"}</span>
            </div>
            <div className="col-md-4">
              <span className="text-muted small d-block">Phone</span>
              <span className="fw-semibold">{user?.phone || "Not added yet"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Saved Addresses Section */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <MapPin size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">Delivery Addresses</h5>
          </div>
          <button
            className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center gap-1"
            onClick={() => setShowAddAddr((prev) => !prev)}
          >
            <Plus size={16} />
            <span>{showAddAddr ? "Cancel" : "Add New Address"}</span>
          </button>
        </div>

        {showAddAddr && (
          <form onSubmit={handleAddAddress} className="border rounded-3 p-3 mb-4 bg-light">
            <h6 className="fw-bold mb-3">New Delivery Address</h6>
            <div className="row g-2">
              <div className="col-md-4">
                <input
                  className="form-control form-control-sm"
                  placeholder="Recipient Name"
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  className="form-control form-control-sm"
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  className="form-control form-control-sm"
                  placeholder="State"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  className="form-control form-control-sm"
                  placeholder="PIN Code"
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  className="form-control form-control-sm"
                  placeholder="Phone Number"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4 d-grid">
                <button type="submit" className="btn btn-primary btn-sm rounded-3">
                  Save Address
                </button>
              </div>
            </div>
          </form>
        )}

        {addresses.length === 0 ? (
          <p className="text-muted mb-0 small">No addresses saved yet. Add your address for faster checkout.</p>
        ) : (
          <div className="row g-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="col-12 col-md-6">
                <div className="border rounded-3 p-3 h-100 position-relative bg-light">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="fw-semibold text-dark">{addr.name}</div>
                    <button
                      className="btn btn-link text-danger p-0 border-0"
                      onClick={() => handleDeleteAddress(addr.id)}
                      title="Delete Address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="text-secondary small mt-1">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </div>
                  <div className="text-secondary small">Phone: {addr.phone}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;