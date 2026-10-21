"use client";

import "../styles/landing.css";
import { LandingNav } from "@/components/landing/nav";
import { Hero, TrustBar } from "@/components/landing/hero";
import { LogoMarquee } from "@/components/landing/marquee";
import { FeatureBento, ToolOrbit } from "@/components/landing/features";
import { Steps } from "@/components/landing/steps";
import { VideoSection } from "@/components/landing/video";
import { CaseStudies } from "@/components/landing/cases";
import { Pricing } from "@/components/landing/pricing";
import { Booking } from "@/components/landing/booking";
import { CtaBand, Faq, LandingFooter } from "@/components/landing/closing";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-sand-0 text-sand-900">
      <LandingNav />
      <main id="main">
        <Hero />
        <TrustBar />
        <LogoMarquee />
        <ToolOrbit />
        <FeatureBento />
        <Steps />
        <VideoSection />
        <CaseStudies />
        <Pricing />
        <Booking />
        <Faq />
        <CtaBand />
      </main>
      <LandingFooter />
    </div>
  );
}
