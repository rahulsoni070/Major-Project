import { Link, useNavigate } from "react-router-dom";

function Navbar({ cart = [], wishlist = [], searchTerm, setSearchTerm }) {
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  const wishlistCount = wishlist.length;

  const onSearch = (e) => {
    e.preventDefault();
    navigate("/products");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary fs-2" to="/">
          ShopEasy
        </Link>

        <form className="d-flex flex-grow-1 mx-lg-4 my-2 my-lg-0" onSubmit={onSearch}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-success" type="submit">
            Search
          </button>
        </form>

        <div className="d-flex gap-2">
          <Link to="/cart" className="btn btn-outline-primary position-relative">
            Cart
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/wishlist" className="btn btn-outline-danger">
            Wishlist
            {wishlistCount > 0 && <span className="ms-1">({wishlistCount})</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;