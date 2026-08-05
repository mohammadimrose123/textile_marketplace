export default function FilterSidebar() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Category</h3>
        <select className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500">
          <option value="all">All</option>
          <option value="cotton">Cotton</option>
          <option value="silk">Silk</option>
          <option value="denim">Denim</option>
        </select>
      </div>

      <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Price</h3>
          <span className="text-sm text-slate-400">₹50 - ₹500</span>
        </div>
        <input type="range" className="w-full" />
      </div>

      <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Availability</h3>
        <label className="flex items-center gap-3 text-sm text-slate-600">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600" />
          In Stock
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-600">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600" />
          Ready to Ship
        </label>
      </div>
    </div>
  );
}
