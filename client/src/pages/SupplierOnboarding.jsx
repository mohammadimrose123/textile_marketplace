import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiPhone, FiCheckCircle, FiAlertCircle, FiTag } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useForm";
import Navbar from "../components/ui/layout/Navbar";

export default function SupplierOnboarding() {
  const { saveSupplierOnboarding } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      businessName: "Apex Eco-Textiles Co.",
      businessType: "Mill & Weaving Manufacturer",
      address: "Industrial Fabric Park, Zone 4",
      phone: "+1 800-FABRICS",
      categories: "Cotton, Silk, Eco Blend",
      fabrics: "Bamboo Cotton, Tencel Silk, Mulberry Raw Silk",
      moq: 200,
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const payload = {
        businessName: data.businessName,
        businessType: data.businessType,
        address: data.address,
        phone: data.phone,
        categories: data.categories.split(",").map((s) => s.trim()),
        fabrics: data.fabrics.split(",").map((s) => s.trim()),
        moq: Number(data.moq),
      };

      await saveSupplierOnboarding(payload);
      navigate("/supplier-dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to save supplier profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50"
        >
          <div className="text-center mb-8">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-full uppercase tracking-wider">
              Supplier Setup
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">
              Supplier Storefront Setup
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Provide your textile manufacturing & business details to start listing products
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
              <FiAlertCircle className="text-lg flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Business / Company Name
              </label>
              <div className="relative">
                <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  {...register("businessName")}
                  type="text"
                  placeholder="Apex Eco-Textiles Co."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Business Type
                </label>
                <input
                  {...register("businessType")}
                  type="text"
                  placeholder="e.g. Textile Mill, Converter"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                  <input
                    {...register("phone")}
                    type="text"
                    placeholder="+1 800-FABRICS"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Physical / Manufacturing Address
              </label>
              <input
                {...register("address")}
                type="text"
                placeholder="123 Industrial Textile Hub, City, Country"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Categories Supplied (Comma separated)
              </label>
              <div className="relative">
                <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  {...register("categories")}
                  type="text"
                  placeholder="Cotton, Silk, Eco Blend, Synthetic"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Main Fabrics Offered
                </label>
                <input
                  {...register("fabrics")}
                  type="text"
                  placeholder="Bamboo Cotton, Tencel"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Minimum Order Qty (MOQ)
                </label>
                <input
                  {...register("moq")}
                  type="number"
                  placeholder="200"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-emerald-600/30 transition duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save Supplier Profile</span>
                  <FiCheckCircle />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
