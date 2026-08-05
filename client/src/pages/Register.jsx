import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiCheckCircle, FiAlertCircle, FiShoppingBag, FiTruck } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useForm";
import Navbar from "../components/ui/layout/Navbar";

export default function Register() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("Buyer");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, errors, watch } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const validationRules = {
    name: {
      required: "Full Name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters",
      },
    },
    email: {
      required: "Email address is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Please enter a valid email address",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    },
    confirmPassword: {
      required: "Please confirm your password",
      validate: (val) => val === passwordValue || "Passwords do not match",
    },
  };

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: role,
      };

      await registerAuth(payload);

      if (role === "Supplier") {
        navigate("/supplier-onboarding");
      } else {
        navigate("/buyer-onboarding");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Registration failed. Please check your inputs."
      );
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
          className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-sm text-slate-500 mt-1">
              Join FabricFlow AI marketplace as a Buyer or Supplier
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-slate-100/80 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole("Buyer")}
              className={`py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition duration-200 ${
                role === "Buyer"
                  ? "bg-white text-blue-600 shadow-md shadow-slate-200/50"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FiShoppingBag className="text-base" />
              <span>Fabric Buyer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("Supplier")}
              className={`py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition duration-200 ${
                role === "Supplier"
                  ? "bg-white text-blue-600 shadow-md shadow-slate-200/50"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FiTruck className="text-base" />
              <span>Mill / Supplier</span>
            </button>
          </div>

          {serverError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
              <FiAlertCircle className="text-lg flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit, validationRules)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Sarah Jenkins"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                    errors.name ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-blue-200"
                  } rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 transition duration-200`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="sarah@textiledesign.com"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                    errors.email ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-blue-200"
                  } rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 transition duration-200`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="At least 6 characters"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                    errors.password ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-blue-200"
                  } rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 transition duration-200`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Re-enter your password"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                    errors.confirmPassword ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-blue-200"
                  } rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 transition duration-200`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-blue-600/30 transition duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create {role} Account</span>
                  <FiCheckCircle />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
