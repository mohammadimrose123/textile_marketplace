import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLayers, FiArrowRight, FiCheckCircle, FiPackage, FiSearch } from "react-icons/fi";
import API from "../services/api";
import Navbar from "../components/ui/layout/Navbar";

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryList = [
    { name: "All", count: 12, icon: "🧵", description: "All textile materials & blends" },
    { name: "Cotton", count: 5, icon: "🌾", description: "Organic, Combed, Egyptian & Twill Cotton" },
    { name: "Silk", count: 3, icon: "✨", description: "Mulberry, Bamboo & Raw Silk Charmeuse" },
    { name: "Denim", count: 2, icon: "👖", description: "Rigid & Stretch Selvage Denim" },
    { name: "Linen", count: 2, icon: "🍃", description: "Pure French & Irish Linen" },
    { name: "Wool", count: 1, icon: "🐑", description: "Merino Wool & Cashmere Blends" },
    { name: "Synthetic", count: 2, icon: "🧪", description: "Recycled Polyester & Nylon Weaves" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to load products for categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 p-8 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl text-white shadow-xl">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 font-semibold text-xs rounded-full border border-blue-400/30 uppercase tracking-wider">
            Fabric Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">Fabric Categories</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Browse textiles by material composition, GSM specs, and wholesale supplier availability
          </p>
        </div>

        {/* Category Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {categoryList.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`p-4 rounded-2xl border text-left transition ${
                selectedCategory === cat.name
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-white border-slate-200 text-slate-800 hover:border-blue-400"
              }`}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <p className="font-bold text-sm leading-tight">{cat.name}</p>
              <p className={`text-[11px] mt-1 ${selectedCategory === cat.name ? "text-blue-100" : "text-slate-400"}`}>
                {cat.count} Fabrics
              </p>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-900">
              {selectedCategory} Fabrics ({filteredProducts.length > 0 ? filteredProducts.length : 3})
            </h3>
            <span className="text-xs font-semibold text-slate-400">Verified Marketplace Listings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredProducts.length > 0
              ? filteredProducts
              : [
                  {
                    _id: "c1",
                    title: "Organic Egyptian Cotton Twill",
                    category: "Cotton",
                    price: 18.5,
                    stock: 2500,
                    description: "220 GSM combed cotton with high tensile strength for apparel.",
                  },
                  {
                    _id: "c2",
                    title: "Pure Mulberry Silk Charmeuse",
                    category: "Silk",
                    price: 32.0,
                    stock: 1200,
                    description: "19 Momme lustrous satin weave silk for luxury dresses.",
                  },
                  {
                    _id: "c3",
                    title: "Rigid Indigo Selvage Denim",
                    category: "Denim",
                    price: 14.0,
                    stock: 4000,
                    description: "13.5 oz heavy raw shuttle loom denim fabric.",
                  },
                ]
            ).map((prod) => (
              <div key={prod._id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-md">
                    {prod.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base mt-2">{prod.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{prod.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Price / yd</span>
                    <span className="font-bold text-slate-900">${prod.price}</span>
                  </div>
                  <Link
                    to={`/product/${prod._id}`}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
