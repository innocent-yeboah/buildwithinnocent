import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-primary-50 py-20">
      <div className="container-site max-w-xl text-center">
        <p className="section-eyebrow">Let&rsquo;s find our way back</p>
        <h1 className="font-display text-4xl font-bold text-primary sm:text-5xl">
          This page seems to have wandered off.
        </h1>
        <p className="mt-5 text-lg text-ink/80">
          No worries — the important things are all still here. Let&rsquo;s
          get you back to growing your business.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/start" className="btn-secondary">
            Tell Us About Your Project
          </Link>
        </div>
      </div>
    </section>
  );
}
