import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Package,
  User,
  Search,
  LogOut,
  ChevronDown,
  Sparkles
} from "lucide-react";

function Navbar({ cart = [], wishlist = [], searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  const wishlistCount = wishlist.length;

  const onSearch = (e) => {
    e.preventDefault();
    navigate("/products");
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
    navigate("/");
  };

  const isCurrent = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold me-3" to="/">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 text-white"
            style={{
              width: 38,
              height: 38,
              background: "linear-gradient(135deg, #2563eb, #4f46e5)"
            }}
          >
            <ShoppingBag size={20} />
          </div>
          <span
            className="fs-3 fw-bold"
            style={{
              background: "linear-gradient(135deg, #1e40af, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px"
            }}
          >
            ShopEasy
          </span>
        </Link>

        {/* Quick Nav Links */}
        <div className="d-none d-lg-flex align-items-center gap-3 me-3">
          <Link
            to="/"
            className={`text-decoration-none fw-semibold small ${
              isCurrent("/") ? "text-primary" : "text-secondary"
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`text-decoration-none fw-semibold small ${
              isCurrent("/products") ? "text-primary" : "text-secondary"
            }`}
          >
            Explore Store
          </Link>
        </div>

        {/* Search Bar */}
        <form className="d-flex flex-grow-1 mx-lg-3 my-2 my-lg-0" onSubmit={onSearch} style={{ maxWidth: 460 }}>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">
              <Search size={17} />
            </span>
            <input
              className="form-control bg-light border-start-0 ps-0"
              type="search"
              placeholder="Search fashion, electronics, gadgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary px-3 fw-semibold" type="submit">
              Search
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-2 nav-actions ms-auto">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="btn btn-light position-relative d-flex align-items-center gap-1 border-0"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart size={19} className="text-danger" />
            <span className="d-none d-xl-inline small fw-semibold text-secondary">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="btn btn-light position-relative d-flex align-items-center gap-1 border-0"
            aria-label="Cart"
            title="Cart"
          >
            <ShoppingCart size={19} className="text-primary" />
            <span className="d-none d-xl-inline small fw-semibold text-secondary">Cart</span>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Orders */}
          <Link
            to="/orders"
            className="btn btn-light d-flex align-items-center gap-1 border-0"
            aria-label="My Orders"
            title="Orders"
          >
            <Package size={19} className="text-secondary" />
            <span className="d-none d-xl-inline small fw-semibold text-secondary">Orders</span>
          </Link>

          {/* Authentication Dropdown / Buttons */}
          {isAuthenticated ? (
            <div className="position-relative ms-1">
              <button
                type="button"
                className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-2 py-1 px-2 px-md-3"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                aria-expanded={userDropdownOpen}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold small"
                  style={{
                    width: 28,
                    height: 28,
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    fontSize: "0.8rem"
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="d-none d-md-inline fw-semibold small text-truncate" style={{ maxWidth: 100 }}>
                  {user?.name?.split(" ")[0] || "Account"}
                </span>
                <ChevronDown size={14} className="text-muted" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ zIndex: 1040 }}
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div
                    className="card border-0 shadow-lg position-absolute end-0 mt-2 py-2 rounded-3"
                    style={{ width: 220, zIndex: 1050 }}
                  >
                    <div className="px-3 py-2 border-bottom">
                      <div className="fw-bold small text-truncate">{user?.name || "User"}</div>
                      <div className="text-muted small text-truncate" style={{ fontSize: "0.75rem" }}>
                        {user?.email}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 small"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={16} className="text-primary" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 small"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Package size={16} className="text-primary" />
                      <span>Order History</span>
                    </Link>

                    <div className="dropdown-divider my-1"></div>

                    <button
                      type="button"
                      className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 text-danger small"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2 ms-1">
              <Link
                to="/login"
                className="btn btn-outline-primary d-flex align-items-center gap-1 rounded-pill px-3 py-1 small fw-semibold"
              >
                <User size={16} />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="btn btn-primary d-none d-sm-flex align-items-center gap-1 rounded-pill px-3 py-1 small fw-semibold"
              >
                <Sparkles size={15} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;