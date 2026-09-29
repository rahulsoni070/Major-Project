import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/api";
import { getStableImage } from "../utils/productImages";
import { toast } from "react-toastify";
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  Heart,
  Copy,
  Check,
  Tag,
  Zap,
  Flame,
  Award,
  Clock
} from "lucide-react";

// Default fallback featured products in case backend is loading or cold
const DEFAULT_PRODUCTS = [
  {
    _id: "prod_1",
    title: "Wireless Headphones",
    price: 1999,
    rating: 4.8,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
  },
  {
    _id: "prod_2",
    title: "Classic White T-Shirt",
    price: 499,
    rating: 4.6,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
  },
  {
    _id: "prod_3",
    title: "Blue Denim Jacket",
    price: 1899,
    rating: 4.9,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"
  },
  {
    _id: "prod_4",
    title: "Running Sneakers",
    price: 2499,
    rating: 4.7,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
  },
  {
    _id: "prod_5",
    title: "Floral Summer Dress",
    price: 1299,
    rating: 4.7,
    category: "fashion",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800"
  },
  {
    _id: "prod_6",
    title: "Smart Fitness Watch",
    price: 2999,
    rating: 4.8,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
  }
];

function LandingPage({ setCart, setWishlist }) {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedCode, setCopiedCode] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch products from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (err) {
        // Keeps DEFAULT_PRODUCTS fallback
      }
    })();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products.slice(0, 8);
    return products
      .filter((p) => (p.category || "").toLowerCase() === activeCategory)
      .slice(0, 8);
  }, [products, activeCategory]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = product._id || product.id;
    setCart((prev) => {
      const existing = prev.find((p) => (p._id || p.id) === id && (p.size || "M") === "M");
      if (existing) {
        return prev.map((p) =>
          (p._id || p.id) === id && (p.size || "M") === "M"
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        );
      }
      return [...prev, { ...product, size: "M", quantity: 1 }];
    });
    toast.success(`Added ${product.title} to cart! 🛍️`);
  };

  const handleAddToWishlist = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = product._id || product.id;
    setWishlist((prev) => {
      const exists = prev.some((w) => (w._id || w.id) === id);
      if (exists) {
        toast.info("Item is already in your wishlist!");
        return prev;
      }
      toast.success(`Saved ${product.title} to wishlist! ❤️`);
      return [...prev, product];
    });
  };

  const copyPromoCode = () => {
    navigator.clipboard.writeText("SHOPEASY20");
    setCopiedCode(true);
    toast.success("Promo code SHOPEASY20 copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("🎉 You're subscribed! Use code WELCOME500 for ₹500 off!");
    setNewsletterEmail("");
  };

  return (
    <div className="landing-page pb-5">
      {/* 1. HERO SECTION */}
      <section className="container pt-3 pt-md-4 mb-5">
        <div className="hero-gradient p-4 p-md-5 position-relative shadow-lg">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7 text-white z-1">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill hero-glow-badge small mb-3 fw-semibold">
                <Sparkles size={16} className="text-warning" />
                <span>SPRING & SUMMER 2026 COLLECTION</span>
              </div>

              <h1 className="display-4 fw-extrabold mb-3 text-white" style={{ letterSpacing: "-1px" }}>
                Next-Gen Tech & Trendsetting Fashion.
              </h1>

              <p className="lead text-white-50 mb-4" style={{ maxWidth: 540 }}>
                Curated collections of premium clothing, sneakers, and cutting-edge electronics. 
                Experience seamless shopping with ultra-fast delivery and uncompromised quality.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link
                  to="/products"
                  className="btn btn-light btn-lg rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow text-primary"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#categories"
                  className="btn btn-outline-light btn-lg rounded-pill px-4 py-3 fw-semibold"
                >
                  Browse Categories
                </a>
              </div>

              {/* Trust Metrics Pill */}
              <div className="d-flex align-items-center gap-4 pt-2 border-top border-white border-opacity-10 text-white-50 small">
                <div>
                  <strong className="text-white d-block fs-5">50k+</strong>
                  <span>Happy Shoppers</span>
                </div>
                <div className="border-start border-white border-opacity-25 ps-4">
                  <strong className="text-white d-block fs-5">4.9 ★</strong>
                  <span>Top Rated</span>
                </div>
                <div className="border-start border-white border-opacity-25 ps-4">
                  <strong className="text-white d-block fs-5">24h</strong>
                  <span>Express Dispatch</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="col-12 col-lg-5 position-relative z-1 text-center">
              <div className="position-relative d-inline-block">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000"
                  alt="ShopEasy Lifestyle"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxHeight: 420, objectFit: "cover", width: "100%" }}
                />

                {/* Floating Badge 1 */}
                <div
                  className="position-absolute top-0 start-0 translate-middle-y bg-white text-dark rounded-4 p-3 shadow-lg d-none d-sm-flex align-items-center gap-2"
                  style={{ zIndex: 2, border: "1px solid #e2e8f0" }}
                >
                  <div className="p-2 rounded-circle bg-danger-subtle text-danger">
                    <Flame size={20} />
                  </div>
                  <div className="text-start">
                    <div className="fw-bold small mb-0">Flash Deals</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>Up to 50% Off</div>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div
                  className="position-absolute bottom-0 end-0 translate-middle-y bg-white text-dark rounded-4 p-3 shadow-lg d-none d-sm-flex align-items-center gap-2"
                  style={{ zIndex: 2, border: "1px solid #e2e8f0" }}
                >
                  <div className="p-2 rounded-circle bg-success-subtle text-success">
                    <Zap size={20} />
                  </div>
                  <div className="text-start">
                    <div className="fw-bold small mb-0">Instant Checkout</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>100% Secure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION & TRUST BADGES */}
      <section className="container mb-5">
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100 p-3 p-md-4 border-0 shadow-sm bg-white hover-lift">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-circle bg-primary-subtle text-primary">
                  <Truck size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Free & Fast Delivery</h6>
                  <p className="text-muted small mb-0">On all orders above ₹499</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100 p-3 p-md-4 border-0 shadow-sm bg-white hover-lift">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-circle bg-success-subtle text-success">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">100% Authentic</h6>
                  <p className="text-muted small mb-0">Verified genuine products</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100 p-3 p-md-4 border-0 shadow-sm bg-white hover-lift">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-circle bg-warning-subtle text-warning">
                  <RotateCcw size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">30-Day Easy Returns</h6>
                  <p className="text-muted small mb-0">Hassle-free exchange policy</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100 p-3 p-md-4 border-0 shadow-sm bg-white hover-lift">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-circle bg-info-subtle text-info">
                  <Headphones size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">24/7 Dedicated Support</h6>
                  <p className="text-muted small mb-0">Instant priority assistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section id="categories" className="container mb-5 pt-2">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-primary fw-bold text-uppercase small" style={{ letterSpacing: "1px" }}>
              Explore Collections
            </span>
            <h2 className="fw-bold mb-0">Shop by Category</h2>
          </div>
          <Link to="/products" className="text-primary fw-semibold small text-decoration-none d-flex align-items-center gap-1">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="row g-4">
          {/* Electronics */}
          <div className="col-12 col-md-6 col-lg-4">
            <Link to="/products?category=electronics" className="text-decoration-none">
              <div className="category-card shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
                  alt="Electronics"
                />
                <div className="category-overlay">
                  <span className="badge bg-primary rounded-pill mb-2 px-2 py-1 align-self-start small">
                    Tech & Audio
                  </span>
                  <h4 className="fw-bold mb-1 text-white">Electronics</h4>
                  <p className="small text-white-50 mb-0">Premium headphones, smartwatches & accessories</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Men's Fashion */}
          <div className="col-12 col-md-6 col-lg-4">
            <Link to="/products?category=fashion" className="text-decoration-none">
              <div className="category-card shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"
                  alt="Men's Fashion"
                />
                <div className="category-overlay">
                  <span className="badge bg-warning text-dark rounded-pill mb-2 px-2 py-1 align-self-start small">
                    Apparel
                  </span>
                  <h4 className="fw-bold mb-1 text-white">Men's Fashion</h4>
                  <p className="small text-white-50 mb-0">Denim jackets, casual shirts & urban streetwear</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Women's Fashion */}
          <div className="col-12 col-md-6 col-lg-4">
            <Link to="/products?category=fashion" className="text-decoration-none">
              <div className="category-card shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800"
                  alt="Women's Fashion"
                />
                <div className="category-overlay">
                  <span className="badge bg-danger rounded-pill mb-2 px-2 py-1 align-self-start small">
                    Trending
                  </span>
                  <h4 className="fw-bold mb-1 text-white">Women's Collection</h4>
                  <p className="small text-white-50 mb-0">Summer dresses, activewear & chic style</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FLASH DEAL / PROMOTIONAL BANNER */}
      <section className="container mb-5">
        <div className="promo-banner p-4 p-md-5 shadow-lg">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 promo-tag px-3 py-1 rounded-pill small fw-bold mb-3">
                <Tag size={15} />
                <span>LIMITED TIME FLASH SALE</span>
              </div>
              <h2 className="display-6 fw-bold mb-2">Get Flat 20% Extra Off Today!</h2>
              <p className="text-white-50 mb-4">
                Use our exclusive seasonal discount code at checkout. Valid across all fashion and electronics collections.
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <div className="code-pill d-flex align-items-center gap-2">
                  <span>SHOPEASY20</span>
                  <button
                    type="button"
                    onClick={copyPromoCode}
                    className="btn btn-sm btn-link text-white p-0 text-decoration-none"
                    title="Copy code"
                  >
                    {copiedCode ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                  </button>
                </div>
                <Link to="/products" className="btn btn-warning rounded-pill px-4 py-2 fw-bold text-dark">
                  Shop Deal Now
                </Link>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="col-12 col-lg-5 text-center text-lg-end">
              <div className="d-inline-block bg-white bg-opacity-10 backdrop-blur rounded-4 p-4 text-center border border-white border-opacity-10">
                <div className="d-flex align-items-center justify-content-center gap-2 text-warning mb-2 small fw-semibold">
                  <Clock size={16} />
                  <span>DEAL EXPIRES IN</span>
                </div>
                <div className="d-flex justify-content-center gap-3">
                  <div className="p-2 bg-dark rounded-3" style={{ minWidth: 60 }}>
                    <div className="fs-3 fw-bold font-monospace text-white">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <small className="text-white-50" style={{ fontSize: "0.7rem" }}>HOURS</small>
                  </div>
                  <div className="p-2 bg-dark rounded-3" style={{ minWidth: 60 }}>
                    <div className="fs-3 fw-bold font-monospace text-white">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <small className="text-white-50" style={{ fontSize: "0.7rem" }}>MINS</small>
                  </div>
                  <div className="p-2 bg-dark rounded-3" style={{ minWidth: 60 }}>
                    <div className="fs-3 fw-bold font-monospace text-white">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <small className="text-white-50" style={{ fontSize: "0.7rem" }}>SECS</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED / TRENDING PRODUCTS */}
      <section className="container mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
          <div>
            <span className="text-primary fw-bold text-uppercase small" style={{ letterSpacing: "1px" }}>
              Handpicked Deals
            </span>
            <h2 className="fw-bold mb-0">Featured Products</h2>
          </div>

          {/* Filter Pills */}
          <div className="d-flex gap-2 flex-wrap">
            <button
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                activeCategory === "all" ? "btn-primary" : "btn-light border"
              }`}
              onClick={() => setActiveCategory("all")}
            >
              All Items
            </button>
            <button
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                activeCategory === "electronics" ? "btn-primary" : "btn-light border"
              }`}
              onClick={() => setActiveCategory("electronics")}
            >
              Electronics
            </button>
            <button
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                activeCategory === "fashion" ? "btn-primary" : "btn-light border"
              }`}
              onClick={() => setActiveCategory("fashion")}
            >
              Fashion
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="row g-4">
          {filteredProducts.map((p) => {
            const id = p._id || p.id;
            const originalPrice = Math.round(Number(p.price || 999) * 1.5);

            return (
              <div key={id} className="col-12 col-sm-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden product-card bg-white position-relative">
                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToWishlist(p, e)}
                    className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 shadow-sm border-0 d-flex align-items-center justify-content-center"
                    style={{ width: 36, height: 36, zIndex: 3 }}
                    title="Add to Wishlist"
                  >
                    <Heart size={18} className="text-danger" />
                  </button>

                  <Link to={`/products/${id}`} className="text-decoration-none text-dark">
                    <div className="overflow-hidden position-relative">
                      <img
                        src={getStableImage(p)}
                        alt={p.title}
                        className="w-100 product-img"
                      />
                      <span className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-75 rounded-pill px-2 py-1 small">
                        {p.category || "General"}
                      </span>
                    </div>
                  </Link>

                  <div className="card-body p-3 d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <div className="small text-warning d-flex align-items-center gap-1 fw-semibold">
                        <Star size={14} className="fill-warning" />
                        <span>{p.rating || "4.8"}</span>
                      </div>
                      <small className="badge bg-danger-subtle text-danger border border-danger border-opacity-25 rounded-pill">
                        50% OFF
                      </small>
                    </div>

                    <Link to={`/products/${id}`} className="text-decoration-none text-dark">
                      <h6 className="fw-bold mb-2 text-truncate" title={p.title}>
                        {p.title}
                      </h6>
                    </Link>

                    <div className="d-flex align-items-baseline gap-2 mb-3">
                      <span className="fs-5 fw-bold text-dark">₹{p.price}</span>
                      <small className="text-muted text-decoration-line-through">₹{originalPrice}</small>
                    </div>

                    <div className="mt-auto">
                      <button
                        className="btn btn-primary w-100 rounded-3 d-flex align-items-center justify-content-center gap-2 py-2"
                        onClick={(e) => handleAddToCart(p, e)}
                      >
                        <ShoppingBag size={17} />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-5">
          <Link
            to="/products"
            className="btn btn-outline-primary btn-lg rounded-pill px-5 fw-bold"
          >
            Explore All Products in Store →
          </Link>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS / TESTIMONIALS */}
      <section className="container mb-5 py-3">
        <div className="text-center mb-5">
          <span className="text-primary fw-bold text-uppercase small" style={{ letterSpacing: "1px" }}>
            Customer Love
          </span>
          <h2 className="fw-bold">What Our Shoppers Say</h2>
          <p className="text-muted small">Over 50,000+ happy customers across the country.</p>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card h-100 p-4 border-0 shadow-sm bg-white rounded-4">
              <div className="d-flex text-warning mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" stroke="none" />
                ))}
              </div>
              <p className="text-secondary mb-4 small" style={{ lineHeight: 1.6 }}>
                "Ordered the Sony ANC Headphones yesterday and they arrived this morning in pristine packaging! Sound quality is phenomenal and checkout was super smooth."
              </p>
              <div className="d-flex align-items-center gap-3 mt-auto">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{ width: 44, height: 44, background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
                >
                  PS
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Priya Sharma</h6>
                  <small className="text-success fw-semibold">✓ Verified Buyer • Bengaluru</small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 p-4 border-0 shadow-sm bg-white rounded-4">
              <div className="d-flex text-warning mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" stroke="none" />
                ))}
              </div>
              <p className="text-secondary mb-4 small" style={{ lineHeight: 1.6 }}>
                "The denim jacket and sneakers exceeded my expectations. High quality stitch, true to size, and the 50% discount was an absolute steal."
              </p>
              <div className="d-flex align-items-center gap-3 mt-auto">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{ width: 44, height: 44, background: "linear-gradient(135deg, #10b981, #059669)" }}
                >
                  AK
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Amit Kumar</h6>
                  <small className="text-success fw-semibold">✓ Verified Buyer • Mumbai</small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card h-100 p-4 border-0 shadow-sm bg-white rounded-4">
              <div className="d-flex text-warning mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" stroke="none" />
                ))}
              </div>
              <p className="text-secondary mb-4 small" style={{ lineHeight: 1.6 }}>
                "I needed to exchange a size and support handled it within 10 minutes without any friction. ShopEasy is now my top choice for online shopping."
              </p>
              <div className="d-flex align-items-center gap-3 mt-auto">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{ width: 44, height: 44, background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}
                >
                  SP
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Sneha Patel</h6>
                  <small className="text-success fw-semibold">✓ Verified Buyer • New Delhi</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER / VIP CLUB */}
      <section className="container mb-4">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white text-center">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 text-white"
                style={{
                  width: 56,
                  height: 56,
                  background: "linear-gradient(135deg, #2563eb, #4f46e5)"
                }}
              >
                <Award size={28} />
              </div>
              <h3 className="fw-bold mb-2">Join the ShopEasy VIP Club</h3>
              <p className="text-muted small mb-4">
                Subscribe to our insider newsletter and unlock ₹500 off your first purchase plus early access to flash sales.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="d-flex gap-2">
                <input
                  type="email"
                  className="form-control rounded-pill px-3 py-2"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold text-nowrap">
                  Subscribe
                </button>
              </form>
              <small className="text-muted d-block mt-2" style={{ fontSize: "0.75rem" }}>
                🔒 Zero spam. Unsubscribe with one click anytime.
              </small>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
