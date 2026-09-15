import LandingNavbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Tracks from "@/components/landing/Tracks";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <LandingNavbar />
      <Hero />
      <Tracks />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
