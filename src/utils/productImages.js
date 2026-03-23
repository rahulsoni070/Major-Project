import jacket from "../assets/products/jacket.jpg";
import tshirt from "../assets/products/tshirt.jpg";
import dress from "../assets/products/dress.jpg";
import shoes from "../assets/products/shoes.jpg";
import headphones from "../assets/products/headphones.jpg";
import defaultImg from "../assets/products/default.jpg";

export const productImageMap = {
  "Classic White T-Shirt": tshirt,
  "Blue Denim Jacket": jacket,
  "Floral Summer Dress": dress,
  "Running Sneakers": shoes,
  "Wireless Headphones": headphones,
};

export function getStableImage(product) {
  return productImageMap[product?.title] || defaultImg;
}