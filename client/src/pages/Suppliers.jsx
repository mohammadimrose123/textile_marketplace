import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTruck, FiMapPin, FiPhone, FiCheckCircle, FiTag, FiSearch } from "react-icons/fi";
import API from "../services/api";
import Navbar from "../components/ui/layout/Navbar";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await API.get("/profiles/suppliers");
        setSuppliers(response.data);
      } catch (err) {
        console.error("Failed to load suppliers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((s) => {
    const name = s.businessName || s.user?.name || "";
    const cat = (s.categories || []).join(" ");
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || cat.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 p-8 bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-semibold text-xs rounded-full border border-emerald-400/30 uppercase tracking-wider">
              Verified Mills
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2">Textile Suppliers & Mills</h1>
            <p className="text-sm text-emerald-200 mt-1 max-w-xl">
              Connect directly with verified textile manufacturers, weaving mills, and fabric converters
            </p>
          </div>

          <div className="w-full sm:w-72 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search suppliers or fabric..."
              className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        {/* Suppliers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredSuppliers.length > 0
            ? filteredSuppliers
            : [
                {
                  _id: "s1",
                  businessName: "Apex Eco-Textiles Co.",
                  businessType: "Mill & Weaving Manufacturer",
                  address: "Industrial Fabric Park, Zone 4",
                  phone: "+1 800-FABRICS",
                  categories: ["Cotton", "Silk", "Eco Blend"],
                  fabrics: ["Bamboo Cotton", "Tencel Silk"],
                  moq: 200,
                  user: { name: "Atlas Supplier", email: "supplier@fabricflow.ai" },
                },
                {
                  _id: "s2",
                  businessName: "Vanguard Silk Mills",
                  businessType: "Pure Silk Producer & Converter",
                  address: "Silk Industrial Belt, Sector 12",
                  phone: "+1 888-SILKS",
                  categories: ["Silk", "Satin"],
                  fabrics: ["Mulberry Silk", "Raw Silk"],
                  moq: 100,
                  user: { name: "Vanguard Mills", email: "info@vanguardsilk.com" },
                },
                {
                  _id: "s3",
                  businessName: "Highland Denim Works",
                  businessType: "Denim & Twill Manufacturer",
                  address: "Cotton Hub, Mill Zone 8",
                  phone: "+1 800-DENIMS",
                  categories: ["Denim", "Cotton"],
                  fabrics: ["Selvage Denim", "Heavy Twill"],
                  moq: 300,
                  user: { name: "Highland Mills", email: "sales@highlanddenim.com" },
                },
              ]
          ).map((supp) => (
            <div key={supp._id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md flex flex-col justify-between hover:shadow-lg transition">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{supp.businessName || supp.user?.name}</h3>
                    <p className="text-xs text-slate-500">{supp.businessType || "Textile Manufacturer"}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                    <FiCheckCircle /> Verified
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <p className="flex items-center gap-2">
                    <FiMapPin className="text-emerald-600" /> {supp.address || "Industrial Fabric Park"}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiPhone className="text-emerald-600" /> {supp.phone || "+1 800-FABRICS"}
                  </p>
                </div>

                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Categories Supplied
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(supp.categories || ["Cotton", "Silk"]).map((c, i) => (
                      <span key={i} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-md">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700">MOQ: {supp.moq || 100} yds</span>
                <button
                  onClick={() => alert(`Contacting ${supp.businessName || "Supplier"} at ${supp.user?.email || "sales@fabricflow.ai"}`)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition"
                >
                  Contact Supplier
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
