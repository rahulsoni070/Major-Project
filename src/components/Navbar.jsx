import { Link } from "react-router-dom";

function Navbar({ cart = [], wishlist = [], searchTerm, setSearchTerm }) {
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const wishlistCount = wishlist.length;

  return (
    <nav className="navbar bg-white shadow-sm sticky-top">
      <div className="container">

        <Link to="/" className="navbar-brand fw-bold">
          ShopEasy
        </Link>

        <div className="flex-grow-1 mx-3 navbar-search d-flex">
          <div className="input-group w-100">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-success">Search</button>
          </div>
        </div>

        <div className="d-flex gap-2">

          <Link
            to="/cart"
            className="btn btn-outline-primary position-relative"
          >
            Cart
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/wishlist"
            className="btn btn-outline-danger position-relative"
          >
            Wishlist
            {wishlistCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {wishlistCount}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;