import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiExternalLink, FiMapPin, FiPhone, FiStar } from "react-icons/fi";

export default function SupplierCard({ supplier }) {
  const navigate = useNavigate();

  const name = supplier?.name || supplier?.businessName || "Apex Eco-Textiles Co.";
  const type = supplier?.businessType || "Mill & Weaving Manufacturer";
  const address = supplier?.address || "Industrial Fabric Park, Zone 4";
  const phone = supplier?.phone || "+1 800-FABRICS";

  return (
    <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-blue-600 block mb-1">
            Verified Manufacturer
          </span>
          <h3 className="text-2xl font-bold text-slate-900">{name}</h3>
          <p className="text-xs text-slate-500 mt-1">{type}</p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
          <FiCheckCircle /> Verified
        </span>
      </div>

      <div className="mt-6 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <FiMapPin className="text-blue-600" /> {address}
        </p>
        <p className="flex items-center gap-2">
          <FiPhone className="text-blue-600" /> {phone}
        </p>
        <p className="flex items-center gap-1 font-semibold text-slate-800">
          <FiStar className="text-amber-400 fill-amber-400" /> 4.9 Seller Trust Rating (214 Orders fulfilled)
        </p>
      </div>

      <button
        onClick={() => navigate("/suppliers")}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-md shadow-blue-600/20"
      >
        <span>Visit Supplier Profile</span>
        <FiExternalLink />
      </button>
    </div>
  );
}
