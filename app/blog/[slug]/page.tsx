import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/blog";
import { site } from "@/lib/site";
import CtaBand from "@/components/CtaBand";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
    },
  };
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function BlogPostPage({ params }: PageProps) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: site.founder },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  const others = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article>
        <header className="bg-primary py-16 sm:py-20">
          <div className="container-site max-w-3xl">
            <p className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest">
              <span className="rounded-full bg-gold/15 px-3 py-1 text-gold">
                {post.category}
              </span>
              <span className="text-primary-200">{post.readMinutes} min read</span>
            </p>
            <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-lg text-primary-100">{post.description}</p>
            <p className="mt-6 text-sm text-primary-200">
              By {site.founder} &middot;{" "}
              {dateFormatter.format(new Date(post.publishedAt))}
            </p>
          </div>
        </header>

        <div className="bg-white py-14 sm:py-20">
          <div className="container-site max-w-3xl">
            <div className="space-y-6">
              {post.sections.map((section, index) => {
                switch (section.type) {
                  case "heading":
                    return (
                      <h2
                        key={index}
                        className="pt-4 font-display text-2xl font-bold text-primary"
                      >
                        {section.text}
                      </h2>
                    );
                  case "list":
                    return (
                      <ul key={index} className="space-y-3 pl-1">
                        {section.items.map((item) => (
                          <li key={item} className="flex gap-3 leading-relaxed text-ink/90">
                            <span
                              aria-hidden="true"
                              className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-growth"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  case "callout":
                    return (
                      <aside
                        key={index}
                        className="rounded-2xl border-l-4 border-gold bg-gold-50 p-6 font-medium leading-relaxed text-primary"
                      >
                        {section.text}
                      </aside>
                    );
                  default:
                    return (
                      <p key={index} className="text-lg leading-relaxed text-ink/90">
                        {section.text}
                      </p>
                    );
                }
              })}
            </div>

            {/* Author strip */}
            <div className="mt-14 flex items-center gap-4 rounded-2xl bg-primary-50 p-6">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-gold"
              >
                IG
              </span>
              <div>
                <p className="font-bold text-primary">{site.founder}</p>
                <p className="text-sm text-ink/70">
                  Builds digital business systems for African enterprises —
                  and runs his own business on the same system he sells.
                </p>
              </div>
            </div>

            {/* Read next */}
            {others.length > 0 && (
              <nav aria-label="Read next" className="mt-12">
                <h2 className="font-display text-xl font-bold text-primary">Read Next</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {others.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/blog/${other.slug}`}
                      className="group rounded-2xl border border-primary-50 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-growth">
                        {other.category}
                      </p>
                      <p className="mt-2 font-display font-bold leading-snug text-primary group-hover:text-growth">
                        {other.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </nav>
            )}
          </div>
        </div>
      </article>

      <CtaBand
        title="Reading Is Good. A Working System Is Better."
        subtitle="Everything in this article is built into the systems we deliver. Tell us about your project and see it working for your business in 5 weeks."
      />
    </>
  );
}
