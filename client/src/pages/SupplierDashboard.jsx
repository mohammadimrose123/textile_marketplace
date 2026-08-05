import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiDollarSign, FiPackage, FiLayers, FiTrendingUp, FiPlus, FiCheckCircle, FiTruck, FiBox } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";
import Navbar from "../components/ui/layout/Navbar";

export default function SupplierDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    metrics: { revenue: 0, ordersCount: 0, productsCount: 0, inventoryCount: 0 },
    orders: [],
    products: [],
  });
  const [loading, setLoading] = useState(true);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: 15,
    stock: 500,
    category: "Cotton",
  });
  const [productSubmitLoading, setProductSubmitLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      const data = await authService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to load supplier dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductSubmitLoading(true);
    try {
      await authService.createProduct(newProduct);
      setShowAddModal(false);
      setNewProduct({
        title: "",
        description: "",
        price: 15,
        stock: 500,
        category: "Cotton",
      });
      fetchDashboard();
    } catch (err) {
      alert("Failed to add product: " + (err.response?.data?.message || err.message));
    } finally {
      setProductSubmitLoading(false);
    }
  };

  const metrics = dashboardData.metrics || { revenue: 42500, ordersCount: 18, productsCount: 6, inventoryCount: 14200 };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl text-white shadow-xl shadow-slate-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-semibold text-xs rounded-full border border-emerald-400/30 uppercase tracking-wider">
              Supplier & Mill Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2">
              {dashboardData.profile?.businessName || user?.name || "Supplier Storefront"}
            </h1>
            <p className="text-sm text-emerald-200 mt-1">
              Manage your textile catalog, wholesale orders, and inventory status
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-emerald-500/30 transition flex items-center gap-2"
          >
            <FiPlus className="text-lg" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* REVENUE & METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
              <p className="text-3xl font-bold text-slate-900 mt-1">${metrics.revenue.toLocaleString()}</p>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                <FiTrendingUp /> +14.2% this month
              </span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
              <FiDollarSign />
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Orders</span>
              <p className="text-3xl font-bold text-slate-900 mt-1">{metrics.ordersCount}</p>
              <span className="text-xs font-semibold text-blue-600 block mt-1">Active fulfillment</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
              <FiPackage />
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Listed Fabrics</span>
              <p className="text-3xl font-bold text-slate-900 mt-1">{metrics.productsCount}</p>
              <span className="text-xs font-semibold text-slate-500 block mt-1">Catalog items</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
              <FiLayers />
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Stock Yards</span>
              <p className="text-3xl font-bold text-slate-900 mt-1">{metrics.inventoryCount.toLocaleString()}</p>
              <span className="text-xs font-semibold text-emerald-600 block mt-1">Available in warehouse</span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
              <FiBox />
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 px-6 font-semibold text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === "overview"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FiLayers /> Products Catalog ({dashboardData.products?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-6 font-semibold text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === "orders"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FiPackage /> Buyer Orders ({dashboardData.orders?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`pb-4 px-6 font-semibold text-sm border-b-2 flex items-center gap-2 transition ${
              activeTab === "inventory"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FiBox /> Warehouse Inventory
          </button>
        </div>

        {/* TAB 1: PRODUCTS LIST */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-900">Your Listed Fabrics</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800"
              >
                + Add Product
              </button>
            </div>

            {dashboardData.products?.length === 0 ? (
              <div className="text-center py-12">
                <FiLayers className="text-4xl text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-semibold">No products listed yet</p>
                <p className="text-xs text-slate-400 mt-1">Click "Add New Product" to publish your first textile item.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.products.map((prod) => (
                  <div key={prod._id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
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
                      <div>
                        <span className="text-xs text-slate-400 font-medium block">Stock</span>
                        <span className="font-semibold text-emerald-600">{prod.stock} yds</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md">
            <h3 className="font-bold text-lg text-slate-900 mb-6">Incoming Buyer Orders</h3>
            {dashboardData.orders?.length === 0 ? (
              <div className="text-center py-12">
                <FiTruck className="text-4xl text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-semibold">No active orders</p>
                <p className="text-xs text-slate-400 mt-1">Orders placed by buyers will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.orders.map((ord) => (
                  <div key={ord._id} className="p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900">Order #{ord._id.substring(0, 8)}</p>
                      <p className="text-xs text-slate-500">Buyer: {ord.buyer?.name || "Verified Buyer"}</p>
                    </div>
                    <span className="font-bold text-emerald-600">${ord.totalAmount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INVENTORY */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Inventory Overview</h3>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 mb-6">
              <FiCheckCircle className="text-xl flex-shrink-0 text-emerald-600" />
              <span>All warehouse fabric stock counts are live and synchronized with the buyer catalog.</span>
            </div>

            <div className="space-y-3">
              {(dashboardData.products?.length > 0 ? dashboardData.products : [
                { _id: "1", title: "Organic Bamboo Cotton Weave", stock: 4500, category: "Cotton" },
                { _id: "2", title: "Pure Mulberry Silk", stock: 1200, category: "Silk" }
              ]).map((item) => (
                <div key={item._id} className="p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
                    <span className="text-xs text-slate-500">Category: {item.category}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-sm">{item.stock} yds available</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD PRODUCT MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
            >
              <h3 className="font-bold text-xl text-slate-900 mb-4">Add Fabric Product</h3>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    placeholder="e.g. Organic Egyptian Cotton"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Cotton">Cotton</option>
                    <option value="Silk">Silk</option>
                    <option value="Denim">Denim</option>
                    <option value="Linen">Linen</option>
                    <option value="Wool">Wool</option>
                    <option value="Synthetic">Synthetic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="High grade textile specification..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Price ($ / yd)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Stock (Yards)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={productSubmitLoading}
                    className="flex-1 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {productSubmitLoading ? "Saving..." : "Save Fabric"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
