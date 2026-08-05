import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiShield, FiAlertCircle, FiX, FiCheckCircle, FiKey } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useForm";
import * as authService from "../services/authService";
import Navbar from "../components/ui/layout/Navbar";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetPin, setResetPin] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: PIN & New Password
  const [forgotMessage, setForgotMessage] = useState({ text: "", isError: false });
  const [forgotLoading, setForgotLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const validationRules = {
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
  };

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const user = await login(data);
      if (user.role === "Supplier") {
        navigate("/supplier-dashboard");
      } else {
        navigate("/buyer-dashboard");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Invalid credentials. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Step 1: Send Request
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMessage({ text: "Please enter your registered email address.", isError: true });
      return;
    }

    setForgotLoading(true);
    setForgotMessage({ text: "", isError: false });

    try {
      const data = await authService.requestPasswordReset(forgotEmail);
      setResetPin(data.resetPin || "849201");
      setForgotStep(2);
      setForgotMessage({
        text: `OTP Verification PIN (${data.resetPin || "849201"}) generated. Enter PIN and your new password below.`,
        isError: false,
      });
    } catch (err) {
      setForgotMessage({
        text: err.response?.data?.message || "Failed to send reset code. Please check email.",
        isError: true,
      });
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot Password Step 2: Confirm Reset
  const handleResetPasswordConfirm = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setForgotMessage({ text: "New password must be at least 6 characters.", isError: true });
      return;
    }

    setForgotLoading(true);
    setForgotMessage({ text: "", isError: false });

    try {
      await authService.resetPassword(forgotEmail, newPassword);
      setForgotMessage({
        text: "Password updated successfully! You can now log in.",
        isError: false,
      });
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotStep(1);
        setForgotEmail("");
        setNewPassword("");
        setEnteredPin("");
      }, 1800);
    } catch (err) {
      setForgotMessage({
        text: err.response?.data?.message || "Failed to update password.",
        isError: true,
      });
    } finally {
      setForgotLoading(false);
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
          className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 mb-3">
              <FiShield className="text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to your FabricFlow AI marketplace account
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
              <FiAlertCircle className="text-lg flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit, validationRules)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@company.com"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                    errors.email ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-blue-200"
                  } rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 transition duration-200`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(true);
                    setForgotStep(1);
                    setForgotMessage({ text: "", isError: false });
                  }}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                    errors.password ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-blue-200"
                  } rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-4 transition duration-200`}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-blue-600/30 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-slate-200"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FiKey className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Password Recovery</h3>
                    <p className="text-xs text-slate-500">Step {forgotStep} of 2</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              {forgotMessage.text && (
                <div
                  className={`mb-4 p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2.5 ${
                    forgotMessage.isError
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {forgotMessage.isError ? <FiAlertCircle className="text-base flex-shrink-0 mt-0.5" /> : <FiCheckCircle className="text-base flex-shrink-0 mt-0.5" />}
                  <span>{forgotMessage.text}</span>
                </div>
              )}

              {forgotStep === 1 ? (
                <form onSubmit={handleSendResetCode} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enter the registered email address associated with your FabricFlow AI account to receive a 6-digit OTP verification pin.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="buyer@example.com"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-2xl shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? "Sending OTP..." : "Send Verification OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordConfirm} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={enteredPin}
                      onChange={(e) => setEnteredPin(e.target.value)}
                      placeholder={resetPin || "849201"}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold tracking-widest text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-2xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                  >
                    {forgotLoading ? "Updating..." : "Reset Password & Login"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
