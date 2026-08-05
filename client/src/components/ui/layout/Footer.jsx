export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <h2 className="text-xl font-semibold text-white">FabricFlow AI</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            An AI-powered textile marketplace bringing buyers and verified suppliers together for smarter bulk sourcing.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Explore</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>Marketplace</li>
            <li>Categories</li>
            <li>Suppliers</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Contact</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <p>support@fabricflow.ai</p>
            <p>+91 98765 43210</p>
            <p>Ahmedabad, Gujarat</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 bg-slate-950/90 py-6 text-center text-sm text-slate-500">
        © 2026 FabricFlow AI. All rights reserved.
      </div>
    </footer>
  );
}
