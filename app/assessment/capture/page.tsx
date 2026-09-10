import type { Metadata } from "next";
import AssessmentCapture from "@/components/AssessmentCapture";

export const metadata: Metadata = {
  title: "Almost There — Your Readiness Score Is Ready",
  description: "One last step before we reveal your Digital Business Readiness Score.",
  robots: { index: false },
};

export default function AssessmentCapturePage() {
  return (
    <section className="bg-primary-50 py-16 sm:py-24">
      <div className="container-site">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-card sm:p-12">
          <AssessmentCapture />
        </div>
      </div>
    </section>
  );
}
