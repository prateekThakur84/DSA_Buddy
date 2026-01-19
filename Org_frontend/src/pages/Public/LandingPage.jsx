import Navigation from "../../components/Navigation/Navigation";
import HeroSection from "../../components/Landing/HeroSection";
import FeaturesSection from "../../components/Landing/FeaturesSection";
import StatsSection from "../../components/Landing/StatsSection";
import CTASection from "../../components/Landing/CTASection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 selection:bg-cyan-500">
      
      <Navigation />
      
      <main className="relative z-10">
        <HeroSection />
        {/* <FeaturesSection /> */}
        {/* <StatsSection /> */}
        {/* <CTASection /> */}
      </main>

      {/* --- UNIFIED BACKGROUND (Matches Problems Page) --- */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 1. The Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* 2. Top Fade Gradient (Cyan tint) */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-cyan-900/10 via-transparent to-transparent opacity-50"></div>
        
        {/* 3. Subtle Ambient Glows (Optional, kept very low opacity to blend with grid) */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]"></div>
      </div>

    </div>
  );
};

export default LandingPage;