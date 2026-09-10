"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { site } from "@/lib/site";
import { CheckIcon, ClockIcon, HeadsetIcon, GlobeIcon } from "@/components/Icons";

type Milestone = { title: string; done: boolean; date?: string };

type ClientProject = {
  id: string;
  project_name: string;
  business_name: string;
  client_name: string;
  status: "discovery" | "design_build" | "review" | "launched" | "support";
  progress: number;
  website_url: string | null;
  next_milestone: string | null;
  next_milestone_date: string | null;
  milestones: Milestone[];
  support_expires_on: string | null;
};

const statusLabels: Record<ClientProject["status"], string> = {
  discovery: "Discovery",
  design_build: "Design & Build",
  review: "Review & Refine",
  launched: "Launched",
  support: "Growth & Support",
};

type State =
  | { kind: "loading" }
  | { kind: "unauthenticated" }
  | { kind: "unconfigured" }
  | { kind: "error"; message: string }
  | { kind: "ready"; email: string; projects: ClientProject[] };

/**
 * The signed-in client's project view. Data comes from `client_projects`,
 * protected by RLS so each client only ever sees their own rows.
 */
export default function ClientDashboard() {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "loading" });

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setState({ kind: "unconfigured" });
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      setState({ kind: "unauthenticated" });
      router.replace("/client/login");
      return;
    }

    const { data, error } = await supabase
      .from("client_projects")
      .select(
        "id, project_name, business_name, client_name, status, progress, website_url, next_milestone, next_milestone_date, milestones, support_expires_on",
      )
      .order("created_at", { ascending: false });

    if (error) {
      setState({
        kind: "error",
        message:
          "We could not load your projects just now. Please refresh, or message us and we will check on it together.",
      });
      return;
    }

    setState({
      kind: "ready",
      email: session.user.email ?? "",
      projects: (data ?? []) as ClientProject[],
    });
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function signOut() {
    const supabase = getSupabaseBrowser();
    if (supabase) await supabase.auth.signOut();
    router.push("/client/login");
  }

  if (state.kind === "loading" || state.kind === "unauthenticated") {
    return <p className="py-16 text-center text-ink/60">Opening your portal…</p>;
  }

  if (state.kind === "unconfigured") {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-gold bg-gold-50 p-8 text-center">
        <p className="font-display text-lg font-bold text-primary">
          The portal is warming up.
        </p>
        <p className="mt-2 text-sm text-ink/80">
          Client sign-in is not switched on for this deployment yet. Reach us
          directly and we will help right away.
        </p>
        <a
          href={site.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-5 !px-6 !py-2.5 !text-sm"
        >
          Message Us on WhatsApp
        </a>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <p role="alert" className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
        {state.message}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="section-eyebrow !mb-1">Client Portal</p>
          <h1 className="font-display text-3xl font-bold text-primary">
            {state.projects[0]?.client_name
              ? `Hello, ${state.projects[0].client_name.split(" ")[0]}.`
              : "Hello."}
          </h1>
          <p className="mt-1 text-sm text-ink/60">Signed in as {state.email}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="rounded-lg border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Sign Out
        </button>
      </div>

      {state.projects.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-card">
          <p className="font-display text-xl font-bold text-primary">
            No projects are linked to this email yet.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink/80">
            If you recently became a client, we may still be setting up your
            portal. If you think something is off, message us — we will fix
            it together.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !px-6 !py-3 !text-sm"
            >
              Message Us on WhatsApp
            </a>
            <Link href="/start" className="btn-secondary !px-6 !py-3 !text-sm">
              Start a New Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {state.projects.map((project) => (
            <article key={project.id} className="overflow-hidden rounded-3xl bg-white shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-primary p-6 sm:p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">
                    {project.business_name}
                  </p>
                  <h2 className="font-display text-2xl font-bold text-white">
                    {project.project_name}
                  </h2>
                </div>
                <span className="rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-primary-900">
                  {statusLabels[project.status]}
                </span>
              </div>

              <div className="p-6 sm:p-8">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-primary">Project progress</span>
                    <span className="text-growth">{project.progress}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={project.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="mt-2 h-3 overflow-hidden rounded-full bg-primary-50"
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-growth to-gold transition-all duration-700"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Next milestone + quick facts */}
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-primary-50 p-4">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      <ClockIcon className="h-4 w-4" /> Next Milestone
                    </p>
                    <p className="mt-2 text-sm font-semibold text-ink">
                      {project.next_milestone ?? "Being scheduled"}
                    </p>
                    {project.next_milestone_date && (
                      <p className="mt-0.5 text-xs text-ink/60">
                        {new Date(project.next_milestone_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl bg-primary-50 p-4">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      <GlobeIcon className="h-4 w-4" /> Your Website
                    </p>
                    {project.website_url ? (
                      <a
                        href={project.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block truncate text-sm font-semibold text-growth underline-offset-4 hover:underline"
                      >
                        {project.website_url.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <p className="mt-2 text-sm font-semibold text-ink">In progress</p>
                    )}
                  </div>
                  <div className="rounded-xl bg-primary-50 p-4">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      <HeadsetIcon className="h-4 w-4" /> Support Until
                    </p>
                    <p className="mt-2 text-sm font-semibold text-ink">
                      {project.support_expires_on
                        ? new Date(project.support_expires_on).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "1 year after launch"}
                    </p>
                  </div>
                </div>

                {/* Milestones */}
                {Array.isArray(project.milestones) && project.milestones.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                      Milestones
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {project.milestones.map((milestone) => (
                        <li key={milestone.title} className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                              milestone.done
                                ? "bg-growth text-white"
                                : "border-2 border-primary-200 bg-white"
                            }`}
                          >
                            {milestone.done && <CheckIcon className="h-3.5 w-3.5" />}
                          </span>
                          <span
                            className={`text-sm ${
                              milestone.done ? "font-medium text-ink" : "text-ink/60"
                            }`}
                          >
                            {milestone.title}
                            {milestone.date && (
                              <span className="ml-2 text-xs text-ink/50">{milestone.date}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Support strip */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-growth-50 p-5">
                  <p className="text-sm font-semibold text-growth-700">
                    Need anything? Your partnership includes direct support.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={site.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-growth px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-growth-600"
                    >
                      WhatsApp Us
                    </a>
                    <a
                      href={`mailto:${site.email}`}
                      className="rounded-lg border-2 border-growth px-4 py-2 text-sm font-bold text-growth-700 transition-colors hover:bg-growth hover:text-white"
                    >
                      Email Support
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
