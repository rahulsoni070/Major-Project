export const productImageMap = {
  "Classic White T-Shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  "Blue Denim Jacket": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
  "Floral Summer Dress": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800",
  "Running Sneakers": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  "Wireless Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
};

export function getStableImage(product) {
  return (
    productImageMap[product?.title] ||
    "https://via.placeholder.com/800x800?text=Product"
  );
}