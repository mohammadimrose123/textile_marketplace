import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import CartDrawer from "../components/cart/CartDrawer";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleProtectedRoute from "../components/auth/RoleProtectedRoute";

import Home from "../pages/Home";
import Marketplace from "../pages/Marketplace";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BuyerOnboarding from "../pages/BuyerOnboarding";
import SupplierOnboarding from "../pages/SupplierOnboarding";
import BuyerDashboard from "../pages/BuyerDashboard";
import SupplierDashboard from "../pages/SupplierDashboard";
import Categories from "../pages/Categories";
import Suppliers from "../pages/Suppliers";
import AIAssistant from "../pages/AIAssistant";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CartDrawer />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/ai" element={<AIAssistant />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Authenticated Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Buyer Specific Routes */}
                <Route element={<RoleProtectedRoute allowedRole="Buyer" />}>
                  <Route path="/buyer-onboarding" element={<BuyerOnboarding />} />
                  <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
                </Route>

                {/* Supplier Specific Routes */}
                <Route element={<RoleProtectedRoute allowedRole="Supplier" />}>
                  <Route path="/supplier-onboarding" element={<SupplierOnboarding />} />
                  <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
                </Route>
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}