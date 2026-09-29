export const productImageMap = {
  "Running Sneakers": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  "Running Shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  "Classic White T-Shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  "Blue Denim Jacket": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800",
  "Floral Summer Dress": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
  "Wireless Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  "Smart Fitness Watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  "Novel Book": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800"
};

const categoryFallbacks = {
  electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  fashion: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  men: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  women: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
  footwear: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  sports: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  books: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
  default: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
};

export function getStableImage(product) {
  // 1. If product title matches our catalog, return the exact verified product photo
  if (product?.title && productImageMap[product.title]) {
    return productImageMap[product.title];
  }

  // 2. If product has a dedicated image URL that is not random picsum or placeholder
  if (
    product?.image &&
    product.image.startsWith("http") &&
    !product.image.includes("picsum.photos") &&
    !product.image.includes("placeholder")
  ) {
    return product.image;
  }

  // 3. Fallback to sensible category photos
  const cat = (product?.category || "").toLowerCase();
  return categoryFallbacks[cat] || categoryFallbacks.default;
}