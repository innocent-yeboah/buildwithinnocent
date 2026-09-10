"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CardIcon,
  MagnetIcon,
  RepeatIcon,
  CheckIcon,
  ClockIcon,
} from "@/components/Icons";

type Tab = "overview" | "bookings" | "leads" | "automations";

const stats = [
  { label: "Revenue this month", value: "GHS 8,420", change: "+22% vs last month", icon: CardIcon },
  { label: "Bookings this week", value: "23", change: "6 came in overnight", icon: ClockIcon },
  { label: "New leads", value: "17", change: "12 already followed up", icon: MagnetIcon },
  { label: "Automation actions", value: "148", change: "emails, reminders, follow-ups", icon: RepeatIcon },
];

const bookings = [
  { client: "Abena K.", service: "Deep Tissue Massage", time: "Today, 2:00 PM", status: "Paid", deposit: "GHS 125" },
  { client: "Yaw D.", service: "Signature Facial", time: "Today, 3:30 PM", status: "Paid", deposit: "GHS 75" },
  { client: "Nana A.", service: "Couples Package", time: "Tomorrow, 10:30 AM", status: "Deposit", deposit: "GHS 210" },
  { client: "Esi F.", service: "Swedish Massage", time: "Tomorrow, 12:00 PM", status: "Paid", deposit: "GHS 90" },
  { client: "Kojo M.", service: "Deep Tissue Massage", time: "Sat, 9:00 AM", status: "Deposit", deposit: "GHS 125" },
];

const leads = [
  { name: "Adwoa B.", source: "Instagram", interest: "Couples Package", stage: "New", note: "Asked about weekend availability" },
  { name: "Kofi T.", source: "Website", interest: "Deep Tissue", stage: "Follow-up sent", note: "Email sequence: message 2 of 4" },
  { name: "Ama O.", source: "Google", interest: "Facial", stage: "Warm", note: "Opened both emails, clicked prices" },
  { name: "Kwabena S.", source: "WhatsApp", interest: "Gift voucher", stage: "New", note: "Auto-reply sent, in queue" },
];

const automations = [
  { name: "Booking confirmation (SMS + email)", runs: 23, status: "Active" },
  { name: "24-hour appointment reminder", runs: 19, status: "Active" },
  { name: "Lead follow-up sequence (4 emails)", runs: 41, status: "Active" },
  { name: "Post-visit review request", runs: 15, status: "Active" },
  { name: "Win-back: no visit in 60 days", runs: 8, status: "Active" },
  { name: "Monthly newsletter", runs: 1, status: "Scheduled" },
];

const weeklyRevenue = [
  { day: "Mon", amount: 940 },
  { day: "Tue", amount: 1180 },
  { day: "Wed", amount: 760 },
  { day: "Thu", amount: 1420 },
  { day: "Fri", amount: 1690 },
  { day: "Sat", amount: 2080 },
  { day: "Sun", amount: 350 },
];

const maxRevenue = Math.max(...weeklyRevenue.map((d) => d.amount));

/**
 * Simulated owner dashboard: the "what you see" half of the demo.
 * All data is static sample data for Serenity Demo Spa.
 */
export default function DemoDashboard() {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "bookings", label: "Bookings" },
    { id: "leads", label: "Leads & CRM" },
    { id: "automations", label: "Automations" },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-primary-100 shadow-card-hover">
      {/* Fake browser chrome */}
      <div className="flex items-center gap-2 bg-primary-900 px-5 py-3">
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#FF6B6B]" />
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-gold" />
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-growth" />
        <p className="ml-3 truncate rounded-md bg-white/10 px-3 py-1 text-xs text-primary-100">
          serenitydemo.buildwithinnocent.com/admin
        </p>
      </div>

      <div className="bg-primary-50/60">
        {/* Dashboard header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-100 bg-white px-6 py-4">
          <div>
            <p className="font-display text-lg font-bold text-primary">
              Serenity Demo Spa
            </p>
            <p className="text-xs text-ink/60">Good morning, Akosua — here is your business today.</p>
          </div>
          <div role="tablist" aria-label="Dashboard sections" className="flex flex-wrap gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                  tab === t.id
                    ? "bg-primary text-white"
                    : "text-primary hover:bg-primary-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[26rem] p-6">
          {tab === "overview" && (
            <div className="animate-fade-in space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-card">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
                        {stat.label}
                      </p>
                      <stat.icon className="h-5 w-5 text-growth" />
                    </div>
                    <p className="mt-2 font-display text-2xl font-bold text-primary">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-growth">{stat.change}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-card">
                <p className="text-sm font-bold text-primary">Revenue this week</p>
                <div className="mt-5 flex h-40 items-end gap-3" role="img" aria-label="Bar chart of revenue by weekday, peaking Saturday at GHS 2,080">
                  {weeklyRevenue.map((d) => (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-ink/60">
                        {d.amount >= 1000 ? `${(d.amount / 1000).toFixed(1)}k` : d.amount}
                      </span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-400"
                        style={{ height: `${(d.amount / maxRevenue) * 100}%` }}
                      />
                      <span className="text-xs font-semibold text-ink/60">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "bookings" && (
            <div className="animate-fade-in overflow-x-auto rounded-2xl bg-white shadow-card">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <caption className="sr-only">Upcoming bookings</caption>
                <thead>
                  <tr className="border-b border-primary-50 text-xs uppercase tracking-wider text-ink/60">
                    <th scope="col" className="px-5 py-3.5">Client</th>
                    <th scope="col" className="px-5 py-3.5">Service</th>
                    <th scope="col" className="px-5 py-3.5">When</th>
                    <th scope="col" className="px-5 py-3.5">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={`${b.client}-${b.time}`} className="border-b border-primary-50/60 last:border-0">
                      <td className="px-5 py-3.5 font-semibold text-primary">{b.client}</td>
                      <td className="px-5 py-3.5 text-ink/80">{b.service}</td>
                      <td className="px-5 py-3.5 text-ink/80">{b.time}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                            b.status === "Paid"
                              ? "bg-growth-50 text-growth-700"
                              : "bg-gold-50 text-gold-800"
                          }`}
                        >
                          <CheckIcon className="h-3 w-3" />
                          {b.status} &middot; {b.deposit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "leads" && (
            <div className="animate-fade-in space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.name}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-card"
                >
                  <div>
                    <p className="font-semibold text-primary">
                      {lead.name}{" "}
                      <span className="ml-2 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {lead.source}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-ink/70">
                      Interested in <strong>{lead.interest}</strong> — {lead.note}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      lead.stage === "Warm"
                        ? "bg-gold-50 text-gold-800"
                        : lead.stage === "New"
                          ? "bg-primary-50 text-primary"
                          : "bg-growth-50 text-growth-700"
                    }`}
                  >
                    {lead.stage}
                  </span>
                </div>
              ))}
              <p className="pt-2 text-center text-xs text-ink/60">
                Every lead here was captured automatically — from the website,
                Instagram, Google, and WhatsApp.
              </p>
            </div>
          )}

          {tab === "automations" && (
            <div className="animate-fade-in space-y-3">
              {automations.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <RepeatIcon className="h-5 w-5 shrink-0 text-growth" />
                    <div>
                      <p className="text-sm font-semibold text-primary">{a.name}</p>
                      <p className="text-xs text-ink/60">{a.runs} runs this month</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      a.status === "Active"
                        ? "bg-growth-50 text-growth-700"
                        : "bg-primary-50 text-primary"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
              <p className="pt-2 text-center text-xs text-ink/60">
                148 actions this month that the owner never had to think about.
              </p>
            </div>
          )}
        </div>

        {/* Demo footer CTA */}
        <div className="border-t border-primary-100 bg-white px-6 py-5 text-center">
          <p className="text-sm text-ink/80">
            This dashboard comes standard with every system we build —
            customized to your business.{" "}
            <Link
              href="/start"
              className="font-bold text-primary underline-offset-4 hover:underline"
            >
              Get yours &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
