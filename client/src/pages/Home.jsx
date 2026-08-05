import Navbar from "../components/ui/layout/Navbar";
import Footer from "../components/ui/layout/Footer";
import Hero from "../components/home/Hero";
import AISearch from "../components/home/AISearch";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AISearch />
      <Footer />
    </>
  );
}
