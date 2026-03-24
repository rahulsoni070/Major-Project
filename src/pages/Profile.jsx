import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setProfile({
        name: parsed?.name || "",
        email: parsed?.email || "",
        phone: parsed?.phone || ""
      });
    } catch {
      setProfile({ name: "", email: "", phone: "" });
    }
  }, []);

  const onSave = (e) => {
    e.preventDefault();

    if (!profile.name.trim() || !profile.email.trim() || !profile.phone.trim()) {
      toast.error("Please fill all profile fields");
      return;
    }

    localStorage.setItem("profile", JSON.stringify(profile));
    toast.success("Profile saved successfully");
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Profile</h2>
      <div className="card p-4">
        <form onSubmit={onSave} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              className="form-control"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="Enter your phone"
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;