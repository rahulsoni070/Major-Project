import { useState } from "react";
import { products } from "../services/products";
import ProductCard from "../components/ProductCard";

function Products({ cart, setCart, wishlist, setWishlist, searchTerm }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortByPrice, setSortByPrice] = useState(null);

  let filteredProducts = products
  .filter((product) =>
    selectedCategory === "all"
      ? true
      : product.category === selectedCategory
  )
  .filter((product) => product.rating >= minRating)
  .filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortByPrice === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.price - b.price
    );
  }

  if (sortByPrice === "highToLow") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.price - a.price
    );
  }

  function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function addToWishlist(product) {
    const exists = wishlist.find((item) => item.id === product.id);
    if (!exists) {
      setWishlist([...wishlist, product]);
    }
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Products</h2>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <h5 className="mb-3">Filters</h5>

            <div className="mb-3">
              <h6>Category</h6>

              <div>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === "all"}
                  onChange={() => setSelectedCategory("all")}
                />
                <label className="ms-2">All</label>
              </div>

              <div>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === "Electronics"}
                  onChange={() => setSelectedCategory("Electronics")}
                />
                <label className="ms-2">Electronics</label>
              </div>

              <div>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === "Fashion"}
                  onChange={() => setSelectedCategory("Fashion")}
                />
                <label className="ms-2">Fashion</label>
              </div>
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

              <div>
                <input
                  type="radio"
                  name="price"
                  checked={sortByPrice === "lowToHigh"}
                  onChange={() => setSortByPrice("lowToHigh")}
                />
                <label className="ms-2">Low to High</label>
              </div>

              <div>
                <input
                  type="radio"
                  name="price"
                  checked={sortByPrice === "highToLow"}
                  onChange={() => setSortByPrice("highToLow")}
                />
                <label className="ms-2">High to Low</label>
              </div>
            </div>

            <button
              className="btn btn-secondary w-100"
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
          {filteredProducts.length === 0 ? (
            <div className="card shadow-sm p-5 text-center">
              <h5 className="mb-2">No products found</h5>
              <p className="text-muted mb-0">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-6 col-lg-4">
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