import ClientDashboard from "@/components/ClientDashboard";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Client Portal — Your Project Dashboard",
  description: "Track your project's progress, milestones, and support.",
  path: "/client/dashboard",
  robots: { index: false },
});

export default function ClientDashboardPage() {
  return (
    <section className="min-h-[70vh] bg-primary-50 py-16 sm:py-20">
      <div className="container-site">
        <ClientDashboard />
      </div>
    </section>
  );
}
