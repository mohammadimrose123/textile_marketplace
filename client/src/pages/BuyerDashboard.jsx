import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiPackage, FiHeart, FiCpu, FiShoppingBag, FiDollarSign, FiTrash2, FiShoppingCart, FiMessageSquare } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import * as authService from "../services/authService";
import Navbar from "../components/ui/layout/Navbar";
import OrderTracker from "../components/orders/OrderTracker";
import SupplierChatDrawer from "../components/chat/SupplierChatDrawer";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("overview");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSupplierName, setChatSupplierName] = useState("Apex Eco-Textiles Co.");

  const [dashboardData, setDashboardData] = useState({
    profile: null,
    orders: [],
    recommendations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await authService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to load buyer dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const profile = dashboardData.profile || user?.profileDetails || {};

  const openSupplierChat = (name = "Apex Eco-Textiles Co.") => {
    setChatSupplierName(name);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl text-white shadow-xl shadow-slate-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 font-semibold text-xs rounded-full border border-blue-400/30 uppercase tracking-wider">
              Buyer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2">
              Welcome back, {user?.name || "Valued Buyer"}!
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Manage your textile orders, wishlist, and AI recommendations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openSupplierChat("Apex Eco-Textiles Co.")}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
            >
              <FiMessageSquare className="text-base" />
              <span>Direct Supplier Chat</span>
            </button>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
              <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                {user?.name ? user.name[0].toUpperCase() : "B"}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-white">{user?.name}</p>
                <p className="text-[10px] text-slate-300">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 px-6 font-semibold text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FiUser /> Profile Overview
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-6 font-semibold text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === "orders"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FiPackage /> Active Orders & Tracking
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`pb-4 px-6 font-semibold text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === "wishlist"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FiHeart /> Wishlist ({wishlistCount})
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`pb-4 px-6 font-semibold text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === "recommendations"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FiCpu /> AI Recommendations
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-blue-100 text-blue-600 font-bold text-2xl flex items-center justify-center">
                  {user?.name ? user.name[0] : "B"}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{user?.name}</h3>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md">
                    Role: {user?.role || "Buyer"}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Business Type</span>
                  <span className="font-semibold text-slate-800">{profile.businessType || "Wholesale Garments"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Industry</span>
                  <span className="font-semibold text-slate-800">{profile.industry || "Fashion & Garments"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Estimated Budget</span>
                  <span className="font-semibold text-slate-800">${profile.budget ? profile.budget.toLocaleString() : "10,000"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Target MOQ</span>
                  <span className="font-semibold text-slate-800">{profile.moq || 100} yards</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <FiShoppingBag className="text-blue-600" /> Sourcing Preferences
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Preferred Categories
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(profile.preferredCategories || ["Cotton", "Silk", "Linen"]).map((cat, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white border border-slate-200 text-xs font-semibold rounded-lg text-slate-700">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Preferred Fabrics
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(profile.preferredFabric || ["Organic Cotton", "Mulberry Silk"]).map((fab, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white border border-slate-200 text-xs font-semibold rounded-lg text-slate-700">
                          {fab}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  <FiPackage className="text-blue-600 text-xl mb-2" />
                  <p className="text-2xl font-bold text-slate-900">1 Active</p>
                  <p className="text-xs text-slate-500">Order Tracker</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                  <FiHeart className="text-rose-500 text-xl mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{wishlistCount}</p>
                  <p className="text-xs text-slate-500">Wishlist Items</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm col-span-2 sm:col-span-1">
                  <FiDollarSign className="text-emerald-600 text-xl mb-2" />
                  <p className="text-2xl font-bold text-slate-900">${profile.budget || 10000}</p>
                  <p className="text-xs text-slate-500">Target Budget</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS & TRACKER */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <OrderTracker orderId="PO-84920 (4,200 Yds Combed Organic Cotton)" />
          </div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === "wishlist" && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Saved Wishlist Fabrics ({wishlistCount})</h3>

            {wishlistItems.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
                <FiHeart className="text-4xl text-slate-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-800">Your Wishlist is empty</p>
                <p className="text-xs text-slate-400 mt-1">Click the heart symbol on any fabric card in the marketplace to save it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlistItems.map((item) => (
                  <div key={item._id || item.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80"}
                        alt={item.title}
                        className="h-14 w-14 rounded-2xl object-cover"
                      />
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded uppercase">
                          {item.category || "Cotton"}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{item.title}</h4>
                        <p className="text-xs font-semibold text-blue-600">${item.price} / yard</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(item, 100)}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-blue-600/20"
                      >
                        <FiShoppingCart /> Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item._id || item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Remove from Wishlist"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RECOMMENDATIONS */}
        {activeTab === "recommendations" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <FiCpu className="text-blue-600 text-2xl" />
              <div>
                <h3 className="font-bold text-lg text-slate-900">AI Fabric Matchmaking</h3>
                <p className="text-xs text-slate-500">Custom recommendations based on your sourcing parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  98% Match Score
                </span>
                <h4 className="font-bold text-slate-900 mt-3">Combed Organic Egyptian Cotton</h4>
                <p className="text-xs text-slate-500 mt-1">210 GSM • Fine Plain Weave</p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">$18.50 / yd</span>
                  <Link to="/product/1" className="text-xs font-semibold text-blue-600 hover:underline">View Fabric →</Link>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  94% Match Score
                </span>
                <h4 className="font-bold text-slate-900 mt-3">Pure Mulberry Silk Charmeuse</h4>
                <p className="text-xs text-slate-500 mt-1">19 Momme • Lustrous Satin finish</p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">$32.00 / yd</span>
                  <Link to="/product/4" className="text-xs font-semibold text-blue-600 hover:underline">View Fabric →</Link>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  91% Match Score
                </span>
                <h4 className="font-bold text-slate-900 mt-3">Sustainable Tencel Lyocell Blend</h4>
                <p className="text-xs text-slate-500 mt-1">160 GSM • Soft Breathable</p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">$15.75 / yd</span>
                  <Link to="/product/2" className="text-xs font-semibold text-blue-600 hover:underline">View Fabric →</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Direct Supplier Messaging Drawer */}
      <SupplierChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        supplierName={chatSupplierName}
      />
    </div>
  );
}
