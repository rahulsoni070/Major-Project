import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { BASE_URL } from "../utils/api";

function Products({ setCart, setWishlist, searchTerm = "" }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortByPrice, setSortByPrice] = useState(null);
  const [loading, setLoading] = useState(true);

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

  let list = products
    .filter((p) => (selectedCategory === "all" ? true : p.category === selectedCategory))
    .filter((p) => Number(p.rating) >= minRating)
    .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (sortByPrice === "lowToHigh") list = [...list].sort((a, b) => a.price - b.price);
  if (sortByPrice === "highToLow") list = [...list].sort((a, b) => b.price - a.price);

  if (loading) return <div className="container py-5">Loading products...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Products</h2>
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card p-3">
            <h5>Filters</h5>
            <h6 className="mt-3">Category</h6>
            {["all", "Electronics", "Fashion"].map((cat) => (
              <div className="form-check" key={cat}>
                <input className="form-check-input" type="radio" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} />
                <label className="form-check-label">{cat === "all" ? "All" : cat}</label>
              </div>
            ))}
            <h6 className="mt-3">Rating</h6>
            <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="form-range" />
            <small>Minimum Rating: {minRating}</small>
            <h6 className="mt-3">Sort by Price</h6>
            <div className="form-check"><input className="form-check-input" type="radio" name="price" onChange={() => setSortByPrice("lowToHigh")} /><label className="form-check-label">Low to High</label></div>
            <div className="form-check"><input className="form-check-input" type="radio" name="price" onChange={() => setSortByPrice("highToLow")} /><label className="form-check-label">High to Low</label></div>
            <button className="btn btn-outline-secondary mt-3" onClick={() => { setSelectedCategory("all"); setMinRating(0); setSortByPrice(null); }}>Clear Filters</button>
          </div>
        </div>

        <div className="col-md-9">
          <div className="row g-4">
            {list.map((p) => (
              <div key={p._id} className="col-12 col-sm-6 col-lg-4">
                <ProductCard product={p} setCart={setCart} setWishlist={setWishlist} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;