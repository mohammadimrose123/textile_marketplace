import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import API from "../../services/api";

const defaultProducts = [
  {
    id: "1",
    _id: "1",
    name: "Premium Organic Cotton Fabric",
    title: "Premium Organic Cotton Fabric",
    category: "Cotton",
    description: "Soft, breathable 210 GSM combed cotton fabric suitable for luxury garments and home textiles.",
    price: 18,
    stock: 4200,
    supplier: "Apex Eco-Textiles Co.",
    rating: 4.9,
    reviews: 214,
    moq: 100,
    match: 98,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    _id: "2",
    name: "French Organic Linen",
    title: "French Organic Linen",
    category: "Linen",
    description: "High-quality organic French linen with natural flax texture and soft hand feel.",
    price: 26,
    stock: 1500,
    supplier: "Vanguard Silk Mills",
    rating: 4.8,
    reviews: 143,
    moq: 50,
    match: 96,
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    _id: "3",
    name: "Raw Indigo Denim Weave",
    title: "Raw Indigo Denim Weave",
    category: "Denim",
    description: "Durable 13.5 oz stretch selvage denim suitable for high-end jeans and jackets.",
    price: 32,
    stock: 2100,
    supplier: "Highland Denim Works",
    rating: 4.7,
    reviews: 180,
    moq: 75,
    match: 95,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    _id: "4",
    name: "Pure Mulberry Silk Charmeuse",
    title: "Pure Mulberry Silk Charmeuse",
    category: "Silk",
    description: "19 Momme lustrous satin weave silk for luxury evening dresses and bridal wear.",
    price: 38,
    stock: 1200,
    supplier: "Vanguard Silk Mills",
    rating: 5.0,
    reviews: 95,
    moq: 50,
    match: 99,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  },
];

export default function ProductGrid() {
  const [products, setProducts] = useState(defaultProducts);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await API.get("/products");
        if (response.data && response.data.length > 0) {
          setProducts(response.data);
        }
      } catch (err) {
        console.error("Using default catalog grid:", err);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
}
