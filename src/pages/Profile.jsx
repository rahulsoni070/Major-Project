import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Profile() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [savedProfile, setSavedProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.name || parsed?.email || parsed?.phone) {
          setSavedProfile(parsed);
        }
      } catch {}
    }

    const savedAddresses = localStorage.getItem("addresses");
    if (savedAddresses) {
      try {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses(Array.isArray(parsedAddresses) ? parsedAddresses : []);
      } catch {
        setAddresses([]);
      }
    }
  }, []);

  const onSave = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim()
    };

    if (!payload.name || !payload.email || !payload.phone) {
      toast.error("Please fill all profile fields");
      return;
    }

    localStorage.setItem("profile", JSON.stringify(payload));
    setSavedProfile(payload);
    setForm({ name: "", email: "", phone: "" });
    toast.success("Profile saved successfully");
  };

  const onEdit = () => {
    setForm({
      name: savedProfile?.name || "",
      email: savedProfile?.email || "",
      phone: savedProfile?.phone || ""
    });
    setSavedProfile(null);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Profile</h2>

      {savedProfile ? (
        <div className="card p-4 mb-4">
          <h5 className="mb-3">Saved Profile</h5>
          <div className="mb-2"><strong>Name:</strong> {savedProfile.name}</div>
          <div className="mb-2"><strong>Email:</strong> {savedProfile.email}</div>
          <div className="mb-3"><strong>Phone:</strong> {savedProfile.phone}</div>
          <button className="btn btn-outline-primary" onClick={onEdit}>
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="card p-4 mb-4">
          <form onSubmit={onSave} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Enter your phone"
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-4">
        <h5 className="mb-3">Saved Addresses</h5>
        {addresses.length === 0 ? (
          <p className="text-muted mb-0">No saved addresses yet.</p>
        ) : (
          <div className="row g-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="col-12 col-md-6">
                <div className="border rounded-3 p-3 h-100">
                  <div className="fw-semibold">{addr.name}</div>
                  <div>{addr.city}, {addr.state}</div>
                  <div>{addr.pincode}</div>
                  <div>{addr.phone}</div>
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