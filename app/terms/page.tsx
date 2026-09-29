import { pageMeta } from "@/lib/page-meta";
import Link from "next/link";
import { responseTimePhrase, site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Terms",
  description:
    "Draft terms for using the Build With Innocent website, including a draft of the lead guarantee that still needs the owner's decision.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="bg-white py-16 sm:py-20">
      <div className="container-site max-w-3xl">
        <p className="section-eyebrow">Terms</p>
        <h1 className="section-title">Terms of use</h1>
        <p className="mt-4 text-sm text-ink/60">
          A plain-language draft for the website. It is not a client contract and it is not legal
          advice. A paid project starts only when both sides agree in writing.
        </p>

        <div className="mt-8 rounded-2xl border border-gold bg-gold-50 p-5 text-sm leading-relaxed text-primary-900">
          <p className="font-bold">TODO — owner decisions still required:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>TODO: legal entity name and address.</li>
            <li>TODO: whether the guarantee below is the promise you want to make, and on what conditions.</li>
            <li>TODO: governing law wording, if a lawyer wants it tighter than &quot;Ghana&quot;.</li>
          </ul>
        </div>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-ink/90">
          <section>
            <h2 className="font-display text-2xl font-bold text-primary">Using the site</h2>
            <p className="mt-3">
              You can read the pages, try the demo, and send an enquiry. Please do not misuse the
              forms (spam, fake details, or attempts to break the site). The content is owned by{" "}
              {site.name}. <strong>TODO: legal entity name.</strong>
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-primary">Prices on this website</h2>
            <p className="mt-3">
              The complete partnership shown on the site is {site.offer.summary}. The pricing
              calculator adds up individual modules and explains when that total is a partial
              selection rather than the full partnership. A figure on the site is an illustration
              until a proposal says otherwise. We do not change a price you have already accepted
              in writing.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-primary">Proposals</h2>
            <p className="mt-3">
              After you enquire we aim to reply {responseTimePhrase}. A proposal is an offer you
              can accept or ignore. Nothing is owed until you accept it.
            </p>
          </section>

          <section className="rounded-2xl border-2 border-dashed border-gold p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gold-800">Draft — not final</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-primary">
              The &quot;10+ qualified leads in 30 days&quot; guarantee
            </h2>
            <p className="mt-3">
              The site currently says: &quot;{site.promise}&quot; This section is a{" "}
              <strong>draft</strong> so visitors can see that the promise has conditions.{" "}
              <strong>
                TODO: Innocent Yeboah must decide whether to publish this wording, change it, or
                remove the guarantee. Do not treat the paragraphs below as agreed terms.
              </strong>
            </p>
            <p className="mt-3">Draft conditions, for discussion only:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                TODO: define &quot;qualified lead&quot; (for example: a person who asked about the
                client&apos;s actual service, with a working phone number, and who is not the
                client themselves).
              </li>
              <li>
                TODO: when the 30 days start (launch day, or the day tracking is confirmed).
              </li>
              <li>
                TODO: what &quot;we work for free&quot; covers and what it does not (extra pages,
                ads spend, a rebuild, a refund of money already paid).
              </li>
              <li>
                TODO: what the client must do (share access, answer messages, not pause the site).
              </li>
              <li>
                TODO: how a shortfall is checked, and who counts the leads.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-primary">Referrals</h2>
            <p className="mt-3">
              The referral page offers GHS 300 when someone you refer becomes a paying client.{" "}
              <strong>TODO: confirm payout timing, what &quot;becomes a client&quot; means, and how mobile money details are collected.</strong>{" "}
              Existing referral codes are emailed to the address on file. They are not shown to
              someone who only types that email into the form.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-primary">Liability</h2>
            <p className="mt-3">
              The demo and the calculator are illustrations. We are not liable for decisions you
              make from them alone. A delivered system is covered by the written proposal and by
              the support period that proposal names.
            </p>
          </section>

          <p>
            See also the{" "}
            <Link href="/privacy" className="font-semibold text-primary underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </article>
  );
}
