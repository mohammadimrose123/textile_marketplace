import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RoleProtectedRoute({ allowedRole }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm font-medium text-slate-600">Verifying role...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== allowedRole) {
    const fallbackPath = user?.role === "Supplier" ? "/supplier-dashboard" : "/buyer-dashboard";
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
}
