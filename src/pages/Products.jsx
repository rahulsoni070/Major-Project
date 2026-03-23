import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { BASE_URL } from "../utils/api";

function Products({ cart, setCart, wishlist, setWishlist, searchTerm = "" }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortByPrice, setSortByPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${BASE_URL}/api/products`);
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

        const data = await res.json();

        // Backend response is an array
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  let filteredProducts = products
    .filter((product) =>
      selectedCategory === "all" ? true : product.category === selectedCategory
    )
    .filter((product) => Number(product.rating) >= minRating)
    .filter((product) =>
      (product.title || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    );

  if (sortByPrice === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (sortByPrice === "highToLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => Number(b.price) - Number(a.price));
  }

  function addToCart(product) {
    const id = product._id || product.id;
    const existingItem = cart.find((item) => (item._id || item.id) === id);

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        (item._id || item.id) === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function addToWishlist(product) {
    const id = product._id || product.id;
    const exists = wishlist.find((item) => (item._id || item.id) === id);
    if (!exists) setWishlist([...wishlist, product]);
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Products</h2>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card shadow-sm p-3 border-0 rounded-4">
            <h5 className="mb-3">Filters</h5>

            <div className="mb-3">
              <h6>Category</h6>
              {["all", "Electronics", "Fashion"].map((cat) => (
                <div key={cat} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    id={`cat-${cat}`}
                  />
                  <label className="form-check-label" htmlFor={`cat-${cat}`}>
                    {cat === "all" ? "All" : cat}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-3">
              <h6>Rating</h6>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="form-range"
              />
              <small>Minimum Rating: {minRating}</small>
            </div>

            <div className="mb-3">
              <h6>Sort by Price</h6>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="price"
                  checked={sortByPrice === "lowToHigh"}
                  onChange={() => setSortByPrice("lowToHigh")}
                  id="lowToHigh"
                />
                <label className="form-check-label" htmlFor="lowToHigh">Low to High</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="price"
                  checked={sortByPrice === "highToLow"}
                  onChange={() => setSortByPrice("highToLow")}
                  id="highToLow"
                />
                <label className="form-check-label" htmlFor="highToLow">High to Low</label>
              </div>
            </div>

            <button
              className="btn btn-outline-secondary w-100 rounded-3"
              onClick={() => {
                setSelectedCategory("all");
                setMinRating(0);
                setSortByPrice(null);
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="col-md-9">
          {loading ? (
            <div className="card shadow-sm p-5 text-center border-0 rounded-4">
              <h5 className="mb-0">Loading products...</h5>
            </div>
          ) : error ? (
            <div className="card shadow-sm p-5 text-center border-0 rounded-4">
              <h5 className="text-danger mb-2">{error}</h5>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="card shadow-sm p-5 text-center border-0 rounded-4">
              <h5 className="mb-2">No products found</h5>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product._id || product.id} className="col-12 col-sm-6 col-lg-4">
                  <ProductCard
                    product={product}
                    addToCart={addToCart}
                    addToWishlist={addToWishlist}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;