import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar({ cart = [], wishlist = [], searchTerm = "", setSearchTerm }) {
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = cart.reduce((total, item) => total + Number(item.quantity || 1), 0);
  const wishlistCount = wishlist.length;

  const isProductsPage = location.pathname === "/products";

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!isProductsPage) navigate("/products");
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top border-bottom">
      <div className="container py-2">
        <Link to="/products" className="navbar-brand fw-bold fs-4 text-primary">
          ShopEasy
        </Link>

        <form
          className="d-flex flex-grow-1 mx-lg-4 my-2 my-lg-0"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <div className="input-group">
            <input
              type="text"
              className="form-control rounded-start-pill px-3"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-success rounded-end-pill px-4" type="submit">
              Search
            </button>
          </div>
        </form>

        <div className="d-flex gap-2">
          <Link to="/cart" className="btn btn-outline-primary position-relative rounded-pill px-3">
            Cart
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/wishlist" className="btn btn-outline-danger position-relative rounded-pill px-3">
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