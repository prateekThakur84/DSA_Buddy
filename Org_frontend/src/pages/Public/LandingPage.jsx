import Navigation from "../../components/Navigation/Navigation";
import HeroSection from "../../components/Landing/HeroSection";
import FeaturesSection from "../../components/Landing/FeaturesSection";
import StatsSection from "../../components/Landing/StatsSection";
import CTASection from "../../components/Landing/CTASection";
// bg-gradient-to-br

const LandingPage = () => {
  return (
    <div className="min-h-screen  from-slate-900 via-gray-900 to-black">

      <Navigation />
      
      <main className="relative">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
      </main>

      {/* background effect      */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

    </div>
  );
};

export default LandingPage;
