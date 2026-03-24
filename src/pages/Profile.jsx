import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Profile() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("profile");
    return saved
      ? JSON.parse(saved)
      : { name: "", email: "", phone: "" };
  });

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);

  const onSave = (e) => {
    e.preventDefault();
    toast.success("Profile updated");
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
            <button className="btn btn-primary">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;