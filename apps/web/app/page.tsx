import { LandingHero } from "../components/dom/landing-hero";
import { TrustedBy } from "../components/dom/trusted-by";
import { Features } from "../components/dom/features";
import { StatsSection } from "../components/dom/stats-section";
import { HowItWorks } from "../components/dom/how-it-works";
import { CTASection } from "../components/dom/cta-section";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <LandingHero />
      <TrustedBy />
      <Features />
      <StatsSection />
      <HowItWorks />
      <CTASection />
    </div>
  );
}
