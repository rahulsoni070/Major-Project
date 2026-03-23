import { Link, useNavigate } from "react-router-dom";

function Navbar({ cart = [], wishlist = [], searchTerm = "", setSearchTerm }) {
  const navigate = useNavigate();
  const cartCount = cart.reduce((t, i) => t + Number(i.quantity || 1), 0);
  const wishlistCount = wishlist.length;

  const onSubmit = (e) => {
    e.preventDefault();
    navigate("/products");
  };

  return (
    <nav className="navbar bg-white shadow-sm sticky-top">
      <div className="container py-2">
        <Link to="/products" className="navbar-brand fw-bold fs-3 text-primary">ShopEasy</Link>

        <form className="d-flex flex-grow-1 mx-4" onSubmit={onSubmit}>
          <div className="input-group">
            <input
              className="form-control rounded-start-pill"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-success rounded-end-pill px-4" type="submit">Search</button>
          </div>
        </form>

        <div className="d-flex gap-2">
          <Link to="/cart" className="btn btn-outline-primary position-relative rounded-pill px-3">
            Cart
            {cartCount > 0 && <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">{cartCount}</span>}
          </Link>
          <Link to="/wishlist" className="btn btn-outline-danger position-relative rounded-pill px-3">
            Wishlist
            {wishlistCount > 0 && <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">{wishlistCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;