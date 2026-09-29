import Link from "next/link";
import Image from "next/image";
import type { CaseStudyRecord, TestimonialRecord } from "@/lib/proof";

function Portrait({ src }: { src?: string }) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt=""
      width={72}
      height={72}
      className="h-12 w-12 rounded-full object-cover"
    />
  );
}

export function TestimonialList({ items }: { items: TestimonialRecord[] }) {
  if (items.length === 0) {
    return (
      <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-primary-100 bg-white px-8 py-12 text-center">
        <p className="font-display text-2xl text-primary">Client words, when they are real.</p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink/75">
          Quotes will appear here with the person’s name, role, business, and
          a link they are happy to stand behind. Nothing is shown in their
          place.
        </p>
      </div>
    );
  }

  return (
    <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <figure className="flex h-full flex-col rounded-3xl border border-primary-100 bg-white p-8">
            {item.logoSrc && (
              <Image
                src={item.logoSrc}
                alt=""
                width={120}
                height={40}
                className="mb-6 h-8 w-auto object-contain object-left"
              />
            )}
            <blockquote className="flex-1 text-[15px] leading-relaxed text-ink">
              {item.quote}
            </blockquote>
            {item.metric && (
              <p className="mt-5 text-sm font-semibold text-growth-700">
                {item.metric.value}
                <span className="mt-0.5 block font-normal text-ink/70">{item.metric.label}</span>
              </p>
            )}
            <figcaption className="mt-6 flex items-center gap-3 border-t border-primary-50 pt-5">
              <Portrait src={item.photoSrc} />
              <span>
                <span className="block text-sm font-semibold text-primary">{item.clientName}</span>
                <span className="block text-xs text-ink/70">
                  {[item.role, item.business].filter(Boolean).join(", ")}
                </span>
                {item.href && (
                  <a
                    href={item.href}
                    className="mt-1 inline-block text-xs font-semibold text-primary underline-offset-4 hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Visit
                  </a>
                )}
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

export function CaseStudyList({ studies }: { studies: CaseStudyRecord[] }) {
  if (studies.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-primary-200 bg-primary-50/60 px-8 py-14 text-center">
        <p className="font-display text-2xl text-primary sm:text-3xl">
          Case studies are being prepared with clients.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/75">
          A study will be published only with a real name, role, business,
          and numbers the client has confirmed. Until then, judge the work
          you can open yourself.
        </p>
        <Link href="/demo" className="btn-primary mt-8">
          Open the live demo <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {studies.map((study) => (
        <article
          key={study.id}
          className="grid gap-8 rounded-3xl border border-primary-100 bg-white p-8 sm:p-10 lg:grid-cols-[220px_1fr]"
        >
          <div>
            {study.logoSrc ? (
              <Image
                src={study.logoSrc}
                alt={`${study.business} logo`}
                width={180}
                height={64}
                className="h-12 w-auto object-contain object-left"
              />
            ) : (
              <p className="font-display text-xl text-primary">{study.business}</p>
            )}
            {study.photoSrc && (
              <Image
                src={study.photoSrc}
                alt=""
                width={220}
                height={220}
                className="mt-6 aspect-square w-full rounded-2xl object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-sm text-ink/70">
              {study.clientName}
              {study.role ? `, ${study.role}` : ""}
            </p>
            <h2 className="mt-2 font-display text-2xl text-primary sm:text-3xl">{study.summary}</h2>
            {study.quote && (
              <blockquote className="mt-5 border-l-2 border-gold pl-4 text-ink/85">
                {study.quote}
              </blockquote>
            )}
            {study.metrics.length > 0 && (
              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                {study.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="font-display text-2xl text-primary">{metric.value}</dt>
                    <dd className="mt-1 text-xs text-ink/70">{metric.label}</dd>
                  </div>
                ))}
              </dl>
            )}
            {study.href && (
              <a
                href={study.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                See the business
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
