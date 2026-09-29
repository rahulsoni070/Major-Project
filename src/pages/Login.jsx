import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShoppingBag } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginDemoUser, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const from = location.state?.from?.pathname || "/profile";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg("Please fill in both email and password.");
      return;
    }

    const res = await login(formData.email, formData.password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error || "Invalid email or password");
    }
  };

  const handleDemoLogin = () => {
    loginDemoUser();
    navigate(from, { replace: true });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 p-4 p-sm-5 bg-white">
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: 64,
                  height: 64,
                  background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                  color: "#fff"
                }}
              >
                <ShoppingBag size={32} />
              </div>
              <h2 className="fw-bold mb-1">Welcome Back</h2>
              <p className="text-muted small">
                Sign in to your ShopEasy account to access your cart, wishlist, and orders.
              </p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3" role="alert">
                {errorMsg}
              </div>
            )}

            {/* Quick Demo Login Option */}
            <div className="card bg-light border-primary border-opacity-25 rounded-3 p-3 mb-4 text-center">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <Sparkles size={16} className="text-warning fill-warning" />
                <span className="fw-semibold text-primary small">Instant Demo Evaluation</span>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm rounded-pill fw-semibold w-100"
                onClick={handleDemoLogin}
              >
                ⚡ 1-Click Demo Login
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    className="form-control bg-light border-start-0 ps-0"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-semibold text-secondary mb-0">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className="form-control bg-light border-start-0 border-end-0 ps-0"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light border-start-0 text-muted"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-3 pt-3 border-top">
              <span className="text-muted small">Don't have an account yet? </span>
              <Link to="/register" className="small fw-bold text-primary text-decoration-none">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
