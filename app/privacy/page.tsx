import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Build With Innocent handles personal data under Ghana's Data Protection Act, 2012 (Act 843).",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="bg-white py-16 sm:py-20">
      <div className="container-site max-w-3xl">
        <p className="section-eyebrow">Privacy</p>
        <h1 className="section-title">Privacy policy</h1>
        <p className="mt-4 text-sm text-ink/60">
          Written in plain language for Ghana&apos;s Data Protection Act, 2012 (Act 843). This is a
          working draft for the website. It is not a substitute for advice from a lawyer.
        </p>

        <div className="mt-8 rounded-2xl border border-gold bg-gold-50 p-5 text-sm leading-relaxed text-primary-900">
          <p className="font-bold">TODO — the owner must fill these in before this page is treated as final:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>TODO: legal entity name (the registered business, if it is not just the brand name).</li>
            <li>TODO: postal address in Ghana.</li>
            <li>TODO: Data Protection Commission registration number, if registered.</li>
          </ul>
        </div>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-ink/90">
          <section>
            <h2 className="font-display text-2xl font-bold text-primary">Who we are</h2>
            <p className="mt-3">
              This website is {site.name} ({site.url}).{" "}
              <strong>
                TODO: legal entity name, the name of the person responsible, and a postal address.
              </strong>{" "}
              If you have a question about your data, email{" "}
              {site.email ? (
                <a className="font-semibold text-primary underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              ) : (
                "the contact address published on this site"
              )}
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-primary">What we collect</h2>
            <p className="mt-3">Only what you type into a form, plus a little technical data the host already logs:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Project enquiries: your name, WhatsApp number, type of business, and anything else you choose to add (business name, email, project notes).</li>
              <li>The readiness assessment: your answers, score, name, business name, and email.</li>
              <li>Newsletter: your email and optional first name.</li>
              <li>Referrals: your name, email, optional phone, and the code we create.</li>
              <li>If you arrive from a referral link, we store that code in your browser so a later enquiry can be attributed.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-primary">Why we collect it</h2>
            <p className="mt-3">
              To reply to you, prepare a proposal, send the newsletter you asked for, and run the
              referral programme. Under Act 843 we rely on your consent, which you give by
              submitting the form. We do not sell personal data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-primary">Who else sees it</h2>
            <p className="mt-3">
              We use a few companies to run the site. They process data for us, they do not own it:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Supabase — stores enquiries, assessments, subscribers, and referrals.</li>
              <li>Resend — sends email.</li>
              <li>Meta (WhatsApp Cloud API) — sends us a WhatsApp message when you enquire, and powers the click-to-chat button.</li>
              <li>Vercel — hosts the site and may collect basic analytics.</li>
            </ul>
            <p className="mt-3">
              Optional advertising pixels (Meta, Google, LinkedIn) load only when their IDs are set
              on the deployment. If they are on, those companies may see that you visited.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-primary">How long we keep it</h2>
            <p className="mt-3">
              We keep an enquiry for as long as we need it to respond and to keep a record of the
              conversation. You can ask us to delete it.{" "}
              <strong>TODO: a specific retention period, once the owner decides.</strong>
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-primary">Your rights</h2>
            <p className="mt-3">
              Act 843 gives you the right to know what we hold, to correct it, to ask us to delete
              it, and to object to how we use it. Email us and we will respond. You can also
              contact the Data Protection Commission of Ghana.{" "}
              <strong>TODO: DPC registration number, if any.</strong>
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-primary">Children</h2>
            <p className="mt-3">
              This site is for business owners. We do not knowingly collect data from children.
            </p>
          </section>

          <p>
            <Link href="/terms" className="font-semibold text-primary underline">
              Read the terms
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
