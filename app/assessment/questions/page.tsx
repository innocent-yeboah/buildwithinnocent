import type { Metadata } from "next";
import AssessmentQuestions from "@/components/AssessmentQuestions";

export const metadata: Metadata = {
  title: "Assessment Questions — Your Digital Business Readiness Score",
  description:
    "Answer 8 quick questions about how your business attracts, captures, and follows up with customers.",
  robots: { index: false },
};

export default function AssessmentQuestionsPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-site">
        <AssessmentQuestions />
      </div>
    </section>
  );
}
