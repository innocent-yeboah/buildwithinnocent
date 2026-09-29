import ClientLogin from "@/components/ClientLogin";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Client Portal — Sign In",
  description:
    "Sign in to your Build With Innocent client portal to track your project, milestones, and support.",
  path: "/client/login",
  robots: { index: false },
});

export default function ClientLoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center bg-primary-50 py-16">
      <div className="container-site">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <p className="section-eyebrow">Client Portal</p>
            <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
              Welcome Back, Partner.
            </h1>
            <p className="mt-3 text-ink/80">
              Track your project, milestones, and support — all in one place.
            </p>
          </div>
          <div className="mt-8 rounded-3xl bg-white p-8 shadow-card">
            <ClientLogin />
          </div>
        </div>
      </div>
    </section>
  );
}
