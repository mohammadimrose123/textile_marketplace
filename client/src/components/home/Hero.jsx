import { Link } from "react-router-dom";
import { FiArrowRight, FiSearch } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 py-20">
      <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center gap-12 px-6 py-10 text-center md:px-8">
        <span className="mx-auto inline-flex rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          🚀 AI-Powered B2B Textile Marketplace
        </span>

        <div className="space-y-8">
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Discover premium textile suppliers across <span className="text-blue-600">India</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Connect buyers with trusted suppliers, compare fabrics, receive AI-powered recommendations, and streamline bulk textile sourcing in one polished platform.
          </p>
        </div>

        <div className="mx-auto flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-blue-700"
          >
            Explore Marketplace
            <FiArrowRight />
          </Link>
          <button className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
            <FiSearch />
            Ask AI Assistant
          </button>
        </div>

        <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-5 rounded-[2rem] bg-white p-8 text-left shadow-[0_35px_60px_-15px_rgba(15,23,42,0.12)] sm:grid-cols-4">
          <div>
            <p className="text-4xl font-extrabold text-blue-600">250+</p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">Suppliers</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600">18K+</p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">Products</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600">52</p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">Cities</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-blue-600">4.9★</p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
