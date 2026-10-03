import NavBar from "../../components/Home/NavBar/NavBar";
import Hero from "../../components/Home/Hero/Hero";
import HowItWorks from "../../components/Home/HowItWorks/HowItWorks";
import Features from "../../components/Home/Features/Features";
import Demo from "../../components/Home/Demo/Demo";
import Testemonial from "../../components/Home/Testemonial/Testemonial";
import FAQ from "../../components/Home/FAQ/FAQ";
import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7FAF7] text-[#101511] transition-colors duration-300 dark:bg-black dark:text-white">
      <div className="md:px-[86px] px-[16px]">
        <NavBar />
        <Hero />
        <HowItWorks />
        <Features />
        <Demo />
        <Testemonial />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
