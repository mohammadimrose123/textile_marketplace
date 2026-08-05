import Navbar from "../components/ui/layout/Navbar";
import Footer from "../components/ui/layout/Footer";
import SearchBar from "../components/marketplace/SearchBar";
import FilterSidebar from "../components/marketplace/FilterSidebar";
import ProductGrid from "../components/marketplace/ProductGrid";

export default function Marketplace() {
  return (
    <>
      <Navbar />

      <main className="bg-slate-50">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-[2rem] bg-gradient-to-r from-sky-500 to-cyan-500 p-10 text-white shadow-xl shadow-sky-500/20">
            <span className="text-sm uppercase tracking-[0.3em] text-sky-100">Marketplace</span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Browse premium textile products from trusted suppliers.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-sky-100/90 sm:text-lg">
              Filter inventory, compare supplier offers, and find the best fabric options for your next large order.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-slate-900">Refine results</h2>
              <p className="mt-2 text-sm text-slate-500">Use filters to narrow down suppliers and fabrics.</p>
              <div className="mt-6 space-y-6">
                <FilterSidebar />
              </div>
            </aside>

            <section className="space-y-8">
              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <SearchBar />
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <ProductGrid />
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
