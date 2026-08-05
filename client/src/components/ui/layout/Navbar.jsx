import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiLayout } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";

const navLinks = [
  { name: "Marketplace", path: "/marketplace" },
  { name: "Categories", path: "/categories" },
  { name: "Suppliers", path: "/suppliers" },
  { name: "AI Assistant", path: "/ai" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const dashboardPath = user?.role === "Supplier" ? "/supplier-dashboard" : "/buyer-dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
          <span className="h-8 w-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/30">
            FF
          </span>
          <span>FabricFlow AI</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-slate-900"
                    : "text-slate-600 transition hover:text-slate-900"
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => navigate("/ai")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
            title="AI Search & Voice Assistant"
          >
            <FiSearch />
          </button>


          <button
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            title="View Cart"
          >
            <FiShoppingCart />
            {totalItemsCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white animate-bounce">
                {totalItemsCount}
              </span>
            )}
          </button>


          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <Link
                to={dashboardPath}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-semibold transition"
              >
                <FiLayout />
                <span>Dashboard</span>
                <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] uppercase font-bold rounded-md">
                  {user?.role}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50"
                title="Logout"
              >
                <FiLogOut />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-md shadow-blue-600/20"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-900 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-2 px-6 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {link.name}
              </NavLink>
            ))}

            <div className="mt-3 flex flex-col gap-3 pt-3 border-t border-slate-100">
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl bg-blue-50 px-4 py-3 text-center text-sm font-semibold text-blue-700 transition"
                  >
                    Go to {user?.role} Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="rounded-2xl border border-rose-200 px-4 py-3 text-center text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    Logout ({user?.name})
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl border border-blue-600 px-4 py-3 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
