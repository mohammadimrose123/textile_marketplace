import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBriefcase, FiDollarSign, FiLayers, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useForm";
import Navbar from "../components/ui/layout/Navbar";

export default function BuyerOnboarding() {
  const { saveBuyerOnboarding } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      businessType: "Apparel Brand",
      industry: "High Fashion & Luxury",
      preferredCategories: "Cotton, Silk, Denim",
      preferredFabric: "Organic Cotton, Mulberry Silk",
      budget: 10000,
      moq: 50,
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const payload = {
        businessType: data.businessType,
        industry: data.industry,
        preferredCategories: data.preferredCategories.split(",").map((s) => s.trim()),
        preferredFabric: data.preferredFabric.split(",").map((s) => s.trim()),
        budget: Number(data.budget),
        moq: Number(data.moq),
      };

      await saveBuyerOnboarding(payload);
      navigate("/buyer-dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to save onboarding details.");
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
            <span className="px-3 py-1 bg-blue-100 text-blue-700 font-semibold text-xs rounded-full uppercase tracking-wider">
              Step 2 of 2
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">
              Buyer Profile Onboarding
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Customize your textile sourcing preferences to unlock AI-matched suppliers
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
              <FiAlertCircle className="text-lg flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Business Type
                </label>
                <input
                  {...register("businessType")}
                  type="text"
                  placeholder="e.g. Apparel Brand, Boutique"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Industry Focus
                </label>
                <input
                  {...register("industry")}
                  type="text"
                  placeholder="e.g. Fashion, Home Decor"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Preferred Categories (Comma separated)
              </label>
              <div className="relative">
                <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  {...register("preferredCategories")}
                  type="text"
                  placeholder="Cotton, Silk, Linen, Knit"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Preferred Fabrics (Comma separated)
              </label>
              <input
                {...register("preferredFabric")}
                type="text"
                placeholder="Organic Cotton, Raw Silk, Egyptian Linen"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Estimated Sourcing Budget ($)
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                  <input
                    {...register("budget")}
                    type="number"
                    placeholder="10000"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Target MOQ (Minimum Order Qty)
                </label>
                <input
                  {...register("moq")}
                  type="number"
                  placeholder="100"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-blue-600/30 transition duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Onboarding</span>
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
