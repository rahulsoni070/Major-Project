import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const BASE_URL = "https://m-ecommerce-backend.vercel.app";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data.product);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid"
          />
        </div>

        <div className="col-md-6">
          <h2>{product.title}</h2>
          <p>Price: ₹ {product.price}</p>
          <p>Rating: ⭐ {product.rating}</p>
          <p>Category: {product.category}</p>

          <button className="btn btn-primary me-2">
            Add to Cart
          </button>
          <button className="btn btn-outline-secondary">
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;