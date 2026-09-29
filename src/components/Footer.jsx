import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer mt-auto py-3 border-top bg-white">
      <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small text-muted">
        <span>© {new Date().getFullYear()} <strong>ShopEasy</strong>. All rights reserved.</span>
        <div className="d-flex gap-3">
          <Link to="/products" className="text-muted text-decoration-none">
            Products
          </Link>
          <Link to="/cart" className="text-muted text-decoration-none">
            Cart
          </Link>
          <Link to="/wishlist" className="text-muted text-decoration-none">
            Wishlist
          </Link>
          <Link to="/profile" className="text-muted text-decoration-none">
            Profile
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;