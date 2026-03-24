import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { BASE_URL } from "../utils/api";

function Products({ setCart, setWishlist, searchTerm = "" }) {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortByPrice, setSortByPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeCategory = (cat = "") => {
    const c = cat.toLowerCase();
    if (["men", "women", "fashion", "footwear", "clothing", "apparel"].includes(c)) return "fashion";
    if (["electronics", "electronic"].includes(c)) return "electronics";
    return c;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]
    );
  };

  const list = useMemo(() => {
    let filtered = products
      .filter((p) => {
        if (!selectedCategories.length) return true;
        return selectedCategories.includes(normalizeCategory(p.category));
      })
      .filter((p) => Number(p.rating || 0) >= minRating)
      .filter((p) => (p.title || "").toLowerCase().includes(searchTerm.toLowerCase()));

    if (sortByPrice === "lowToHigh") filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
    if (sortByPrice === "highToLow") filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));

    return filtered;
  }, [products, selectedCategories, minRating, sortByPrice, searchTerm]);

  if (loading) return <div className="container py-5">Loading products...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Products</h2>
      <div className="row g-4">
        <div className="col-12 col-lg-3">
          <div className="card p-3">
            <h5>Filters</h5>
            <h6 className="mt-3">Category</h6>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectedCategories.includes("electronics")}
                onChange={() => toggleCategory("electronics")}
              />
              <label className="form-check-label">Electronics</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectedCategories.includes("fashion")}
                onChange={() => toggleCategory("fashion")}
              />
              <label className="form-check-label">Fashion</label>
            </div>

            <h6 className="mt-3">Rating</h6>
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

            <h6 className="mt-3">Sort by Price</h6>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="price"
                checked={sortByPrice === "lowToHigh"}
                onChange={() => setSortByPrice("lowToHigh")}
              />
              <label className="form-check-label">Low to High</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="price"
                checked={sortByPrice === "highToLow"}
                onChange={() => setSortByPrice("highToLow")}
              />
              <label className="form-check-label">High to Low</label>
            </div>

            <button
              className="btn btn-outline-secondary mt-3"
              onClick={() => {
                setSelectedCategories([]);
                setMinRating(0);
                setSortByPrice(null);
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="col-12 col-lg-9">
          {list.length === 0 ? (
            <div className="card p-5 text-center">No products found</div>
          ) : (
            <div className="row g-4">
              {list.map((p) => (
                <div key={p._id || p.id} className="col-12 col-sm-6 col-xl-4">
                  <ProductCard product={p} setCart={setCart} setWishlist={setWishlist} />
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