import { useState } from "react";
import { FiHeart, FiShoppingCart, FiCheck } from "react-icons/fi";
import { useCart } from "../../context/CartContext";

export default function ProductInfo({ product }) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState("White");
  const [quantity, setQuantity] = useState(100);

  const sampleProduct = product || {
    _id: "p1",
    title: "Premium Cotton Fabric",
    category: "Cotton",
    price: 180,
    moq: 100,
    stock: 420,
    supplier: "ABC Textiles",
    colors: ["White", "Black", "Navy", "Crimson"],
  };

  const handleAdd = () => {
    addToCart(sampleProduct, quantity, selectedColor);
  };

  return (
    <div>
      <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
        {sampleProduct.category}
      </span>
      <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-slate-900">
        {sampleProduct.title}
      </h1>
      <p className="mt-4 text-slate-600 leading-relaxed text-sm">
        Soft, breathable cotton fabric crafted for high-end garments, uniforms, and home textiles with superior thread density.
      </p>

      <div className="mt-6 flex items-baseline gap-2">
        <h2 className="text-3xl font-bold text-blue-600">${sampleProduct.price}</h2>
        <span className="text-sm text-slate-500 font-medium">/ yard</span>
      </div>

      <div className="mt-6 space-y-2 text-xs font-semibold text-slate-600">
        <p>⭐ 4.8 (214 Verified Buyer Reviews)</p>
        <p>Minimum Order Qty (MOQ): {sampleProduct.moq || 100} yards</p>
        <p>Available Stock: {sampleProduct.stock} yards in warehouse</p>
      </div>

      {/* Yard Quantity Input */}
      <div className="mt-6">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Select Sourcing Quantity (Yards)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={sampleProduct.moq || 50}
            step={50}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-32 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-slate-400 font-medium">Total: ${sampleProduct.price * quantity}</span>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleAdd}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-white font-semibold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition"
        >
          <FiShoppingCart className="text-lg" />
          <span>Add {quantity} Yards to Cart</span>
        </button>
        <button className="rounded-2xl border border-slate-200 px-5 hover:bg-slate-50 text-slate-600">
          <FiHeart className="text-lg" />
        </button>
      </div>
    </div>
  );
}
