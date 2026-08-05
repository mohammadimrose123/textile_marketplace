import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/ui/layout/Navbar";
import Footer from "../components/ui/layout/Footer";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductSpecs from "../components/product/ProductSpecs";
import SupplierCard from "../components/product/SupplierCard";
import SimilarProducts from "../components/product/SimilarProducts";

const defaultCatalog = [
  {
    id: "1",
    _id: "1",
    name: "Premium Organic Cotton Fabric",
    title: "Premium Organic Cotton Fabric",
    category: "Cotton",
    price: 18,
    stock: 4200,
    supplier: "Apex Eco-Textiles Co.",
    moq: 100,
    description: "Soft, breathable 210 GSM combed cotton fabric crafted for high-end apparel, uniforms, and home textiles.",
  },
  {
    id: "2",
    _id: "2",
    name: "French Organic Linen",
    title: "French Organic Linen",
    category: "Linen",
    price: 26,
    stock: 1500,
    supplier: "Vanguard Silk Mills",
    moq: 50,
    description: "High-quality organic French linen with natural flax texture and soft hand feel.",
  },
  {
    id: "3",
    _id: "3",
    name: "Raw Indigo Denim Weave",
    title: "Raw Indigo Denim Weave",
    category: "Denim",
    price: 32,
    stock: 2100,
    supplier: "Highland Denim Works",
    moq: 75,
    description: "Durable 13.5 oz stretch selvage denim suitable for high-end jeans and jackets.",
  },
  {
    id: "4",
    _id: "4",
    name: "Pure Mulberry Silk Charmeuse",
    title: "Pure Mulberry Silk Charmeuse",
    category: "Silk",
    price: 38,
    stock: 1200,
    supplier: "Vanguard Silk Mills",
    moq: 50,
    description: "19 Momme lustrous satin weave silk for luxury evening dresses and bridal wear.",
  },
];

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchProduct = async () => {
      if (!id) return;
      try {
        // Only call API if id looks like a 24-char ObjectId
        if (id.length === 24) {
          const response = await API.get(`/products/${id}`);
          if (response.data) {
            setProduct(response.data);
            return;
          }
        }
      } catch (err) {
        console.error("API fetch error, using catalog fallback:", err);
      }
    };
    fetchProduct();
  }, [id]);


  const activeProduct =
    product ||
    defaultCatalog.find((p) => String(p.id) === String(id) || String(p._id) === String(id)) ||
    defaultCatalog[0];

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 py-10 min-h-screen">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-[2rem] bg-white p-6 sm:p-10 shadow-sm border border-slate-200/80">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  Item #{activeProduct._id || activeProduct.id}
                </span>
                <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900">
                  {activeProduct.title || activeProduct.name}
                </h1>
              </div>
              <div className="inline-flex items-center gap-3 rounded-full bg-emerald-50 border border-emerald-200 px-5 py-2.5 text-sm text-emerald-800 font-semibold">
                <span>Available Stock:</span> {activeProduct.stock || 4200} yards
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[2rem] bg-slate-50 p-6 border border-slate-200/60">
                <ProductGallery />
              </div>
              <div className="space-y-6">
                <div className="rounded-[2rem] bg-slate-50 p-6 border border-slate-200/60">
                  <ProductInfo product={activeProduct} />
                </div>
                <div className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-blue-400">
                      Supplier Overview
                    </p>
                    <p className="text-lg font-bold">{typeof activeProduct.supplier === "object" ? activeProduct.supplier.name : (activeProduct.supplier || "Apex Eco-Textiles Co.")}</p>
                    <p className="text-xs text-slate-300">
                      Verified mill specializing in eco-friendly cotton, silk, and high-density textiles with reliable shipping.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 space-y-10">
              <div className="rounded-[2rem] bg-white p-8 border border-slate-200/80 shadow-sm">
                <ProductSpecs />
              </div>
              <div className="grid gap-8 xl:grid-cols-[0.8fr_0.6fr]">
                <div className="rounded-[2rem] bg-white p-8 border border-slate-200/80 shadow-sm">
                  <SimilarProducts />
                </div>
                <div>
                  <SupplierCard supplier={typeof activeProduct.supplier === "object" ? activeProduct.supplier : null} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
