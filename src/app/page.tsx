"use client";
import { useEffect } from "react";
import NavBar from "../../components/Home/NavBar/NavBar";
import Hero from "../../components/Home/Hero/Hero";
import HowItWorks from "../../components/Home/HowItWorks/HowItWorks";
import Features from "../../components/Home/Features/Features";
import Demo from "../../components/Home/Demo/Demo";
import Testemonial from "../../components/Home/Testemonial/Testemonial";
import FAQ from "../../components/Home/FAQ/FAQ";
import CTA from "../../components/Home/CTA/CTA";
import Footer from "../../components/Home/Footer/Footer";
import useUserStore from "../../core/userState";

export default function Home() {
  const {setTheme} = useUserStore();
  
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);
  
  return (
    <>
      <div className="md:px-[86px] px-[16px] overflow-x-clip">
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
    </>
  );
}
