import { FiCheckCircle, FiClock, FiTruck, FiBox, FiShield } from "react-icons/fi";

const sampleSteps = [
  { id: 1, title: "Purchase Order Placed", date: "Aug 02, 2026", status: "completed", icon: FiBox },
  { id: 2, title: "Lab-Dip & Sample Approved", date: "Aug 03, 2026", status: "completed", icon: FiShield },
  { id: 3, title: "Bulk Weaving & Dyeing", date: "Aug 04, 2026", status: "current", icon: FiClock },
  { id: 4, title: "Quality Control & Packaging", date: "Estimated Aug 06", status: "upcoming", icon: FiCheckCircle },
  { id: 5, title: "Dispatched & In Transit", date: "Estimated Aug 08", status: "upcoming", icon: FiTruck },
];

export default function OrderTracker({ orderId = "ORD-84920" }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Active Order Timeline</span>
          <h3 className="text-lg font-bold text-slate-900">{orderId}</h3>
        </div>
        <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200 flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" /> In Production
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-8 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {sampleSteps.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";

          return (
            <div key={step.id} className="relative flex items-start gap-4">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs z-10 ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : isCurrent
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-4 ring-blue-100"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}
              >
                <Icon className="text-sm" />
              </div>

              <div>
                <h4
                  className={`text-sm font-bold ${
                    isCompleted ? "text-emerald-700" : isCurrent ? "text-blue-600" : "text-slate-500"
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">{step.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
