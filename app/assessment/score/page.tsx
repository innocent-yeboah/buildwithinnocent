import type { Metadata } from "next";
import AssessmentScore from "@/components/AssessmentScore";

export const metadata: Metadata = {
  title: "Your Digital Business Readiness Score",
  description:
    "Your personalized score and breakdown across the four growth layers: Offer, Attention, Capture, and Follow-Up.",
  robots: { index: false },
};

export default function AssessmentScorePage() {
  return (
    <section className="bg-primary-50 py-16 sm:py-24">
      <div className="container-site">
        <AssessmentScore />
      </div>
    </section>
  );
}
