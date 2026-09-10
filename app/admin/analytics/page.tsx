import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Analytics — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type LeadRow = {
  status: string;
  industry: string;
  referral_code: string | null;
  created_at: string;
};

type Analytics = {
  totalLeads: number;
  leads30d: number;
  leadsByStatus: Record<string, number>;
  leadsByIndustry: Record<string, number>;
  referredLeads: number;
  totalAssessments: number;
  averageScore: number | null;
  bandCounts: Record<string, number>;
  totalSubscribers: number;
  totalReferralPartners: number;
  totalReferralClicks: number;
};

async function loadAnalytics(): Promise<Analytics | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const [leadsRes, assessmentsRes, subscribersRes, referralsRes] = await Promise.all([
    supabase.from("leads").select("status, industry, referral_code, created_at"),
    supabase.from("assessments").select("score, band"),
    supabase.from("subscribers").select("id", { count: "exact", head: true }).eq("subscribed", true),
    supabase.from("referrals").select("clicks"),
  ]);

  if (
    leadsRes.error ||
    assessmentsRes.error ||
    referralsRes.error ||
    subscribersRes.error
  ) {
    console.error("Admin analytics query failed:", {
      leads: leadsRes.error?.message,
      assessments: assessmentsRes.error?.message,
      referrals: referralsRes.error?.message,
      subscribers: subscribersRes.error?.message,
    });
    return null;
  }

  const leads = (leadsRes.data ?? []) as LeadRow[];
  const assessments = (assessmentsRes.data ?? []) as { score: number; band: string }[];
  const referrals = (referralsRes.data ?? []) as { clicks: number }[];

  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const countBy = (rows: string[]) =>
    rows.reduce<Record<string, number>>((acc, key) => {
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

  return {
    totalLeads: leads.length,
    leads30d: leads.filter((l) => new Date(l.created_at).getTime() >= cutoff).length,
    leadsByStatus: countBy(leads.map((l) => l.status)),
    leadsByIndustry: countBy(leads.map((l) => l.industry)),
    referredLeads: leads.filter((l) => l.referral_code).length,
    totalAssessments: assessments.length,
    averageScore:
      assessments.length > 0
        ? Math.round(assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length)
        : null,
    bandCounts: countBy(assessments.map((a) => a.band)),
    totalSubscribers: subscribersRes.count ?? 0,
    totalReferralPartners: referrals.length,
    totalReferralClicks: referrals.reduce((sum, r) => sum + r.clicks, 0),
  };
}

const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  proposal_sent: "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

function BarList({
  title,
  data,
  accent,
}: {
  title: string;
  data: Record<string, number>;
  accent: string;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, count]) => count), 1);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card">
      <h2 className="font-display text-lg font-bold text-primary">{title}</h2>
      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-ink/60">No data yet.</p>
      ) : (
        <div className="mt-5 space-y-4">
          {entries.map(([key, count]) => (
            <div key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-ink">{statusLabels[key] ?? key}</span>
                <span className="font-bold text-primary">{count}</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-primary-50">
                <div
                  className={`h-full rounded-full ${accent}`}
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Internal analytics: the funnel at a glance — leads, assessments,
 * subscribers, and referral performance. Protected by middleware.
 */
export default async function AdminAnalyticsPage() {
  const analytics = await loadAnalytics();

  if (!analytics) {
    return (
      <section className="bg-primary-50 py-20">
        <div className="container-site max-w-xl text-center">
          <h1 className="font-display text-3xl font-bold text-primary">Analytics</h1>
          <p className="mt-4 rounded-2xl border border-gold bg-gold-50 p-6 text-ink/80">
            Supabase is not configured (or a query failed), so there is
            nothing to show yet. Set <code className="font-mono text-sm">SUPABASE_URL</code>{" "}
            and <code className="font-mono text-sm">SUPABASE_SERVICE_ROLE_KEY</code>, run the
            migrations, and refresh.
          </p>
        </div>
      </section>
    );
  }

  const headline = [
    { label: "Total leads", value: analytics.totalLeads },
    { label: "Leads — last 30 days", value: analytics.leads30d },
    { label: "Assessments taken", value: analytics.totalAssessments },
    {
      label: "Average readiness score",
      value: analytics.averageScore !== null ? `${analytics.averageScore}/100` : "—",
    },
    { label: "Newsletter subscribers", value: analytics.totalSubscribers },
    { label: "Referral partners", value: analytics.totalReferralPartners },
    { label: "Referral link clicks", value: analytics.totalReferralClicks },
    { label: "Leads via referral", value: analytics.referredLeads },
  ];

  return (
    <section className="min-h-screen bg-primary-50 py-14">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-eyebrow !mb-1">Admin</p>
            <h1 className="font-display text-3xl font-bold text-primary">
              Growth Analytics
            </h1>
          </div>
          <p className="text-sm text-ink/60">
            Live from Supabase &middot;{" "}
            {new Date().toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Headline stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {headline.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                {stat.label}
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-primary">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Breakdowns */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <BarList
            title="Leads by Status"
            data={analytics.leadsByStatus}
            accent="bg-gradient-to-r from-primary to-primary-400"
          />
          <BarList
            title="Leads by Industry"
            data={analytics.leadsByIndustry}
            accent="bg-gradient-to-r from-growth to-growth-300"
          />
          <BarList
            title="Assessment Bands"
            data={analytics.bandCounts}
            accent="bg-gradient-to-r from-gold-600 to-gold-300"
          />
        </div>

        <p className="mt-10 text-center text-xs text-ink/50">
          Traffic analytics (page views, referrers) live in Vercel Analytics.
          This dashboard tracks conversions — the numbers that pay the bills.
        </p>
      </div>
    </section>
  );
}
