import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../utils/api";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${BASE_URL}/api/products`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);

        const data = await res.json();
        const products = Array.isArray(data) ? data : data?.data?.products || [];
        const found = products.find((p) => (p._id || p.id) === id);

        if (!found) {
          setError("Product not found");
        } else {
          setProduct(found);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load product details");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) return <div className="container py-5"><h5>Loading product...</h5></div>;
  if (error) return <div className="container py-5"><h5 className="text-danger">{error}</h5></div>;

  return (
    <div className="container py-4">
      <Link to="/products" className="btn btn-outline-secondary mb-3">← Back to Products</Link>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-5">
            <img
              src={product.image}
              alt={product.title}
              className="w-100 h-100"
              style={{ objectFit: "cover", minHeight: "360px" }}
            />
          </div>
          <div className="col-md-7">
            <div className="card-body p-4">
              <h3 className="fw-bold">{product.title}</h3>
              <p className="text-muted mb-2">Category: {product.category}</p>
              <h4 className="text-primary mb-3">₹ {product.price}</h4>
              <p className="mb-3">⭐ {product.rating}</p>
              <p className="mb-0">
                Premium quality product for your daily use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;