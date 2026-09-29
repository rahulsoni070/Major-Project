const isLocal = typeof window !== "undefined" && 
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (isLocal ? "http://localhost:5001" : "https://m-ecommerce-backend.vercel.app");