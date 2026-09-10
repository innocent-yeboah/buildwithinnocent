import type { Metadata } from "next";
import ClientDashboard from "@/components/ClientDashboard";

export const metadata: Metadata = {
  title: "Client Portal — Your Project Dashboard",
  description: "Track your project's progress, milestones, and support.",
  robots: { index: false },
};

export default function ClientDashboardPage() {
  return (
    <section className="min-h-[70vh] bg-primary-50 py-16 sm:py-20">
      <div className="container-site">
        <ClientDashboard />
      </div>
    </section>
  );
}
