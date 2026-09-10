import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Practical Growth Ideas for African Businesses",
  description:
    "No jargon, no fluff. Practical articles on lead capture, mobile money, automation, and building a business that grows while you sleep.",
  alternates: { canonical: "/blog" },
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="bg-primary py-16 sm:py-20">
        <div className="container-site max-w-3xl text-center">
          <p className="animate-fade-in section-eyebrow !text-gold">The Blog</p>
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Practical Growth Ideas. No Fluff.
          </h1>
          <p
            className="animate-fade-up mt-5 text-lg text-primary-100"
            style={{ animationDelay: "150ms" }}
          >
            Everything we learn building systems for African businesses,
            written so you can use it today — client or not.
          </p>
        </div>
      </section>

      <section aria-label="Articles" className="bg-white py-16 sm:py-24">
        <div className="container-site">
          {/* Featured post */}
          <RevealOnScroll>
            <Link
              href={`/blog/${featured.slug}`}
              className="group block overflow-hidden rounded-3xl border border-primary-50 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <article className="grid lg:grid-cols-2">
                <div className="flex min-h-56 items-center justify-center bg-primary p-10">
                  <p className="font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
                    {featured.title}
                  </p>
                </div>
                <div className="p-8 sm:p-10">
                  <p className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest">
                    <span className="rounded-full bg-gold-50 px-3 py-1 text-gold-800">
                      Latest
                    </span>
                    <span className="text-growth">{featured.category}</span>
                    <span className="text-ink/50">{featured.readMinutes} min read</span>
                  </p>
                  <p className="mt-4 text-lg leading-relaxed text-ink/80">
                    {featured.description}
                  </p>
                  <p className="mt-5 text-sm text-ink/60">
                    {dateFormatter.format(new Date(featured.publishedAt))}
                  </p>
                  <p className="mt-5 font-bold text-primary group-hover:text-growth">
                    Read the article &rarr;
                  </p>
                </div>
              </article>
            </Link>
          </RevealOnScroll>

          {/* Remaining posts */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, index) => (
              <RevealOnScroll key={post.slug} delay={index * 90}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-primary-50 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                    <span className="text-growth">{post.category}</span>
                    <span className="text-ink/50">{post.readMinutes} min</span>
                  </p>
                  <h2 className="mt-3 font-display text-xl font-bold leading-snug text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
                    {post.description}
                  </p>
                  <p className="mt-5 text-xs text-ink/50">
                    {dateFormatter.format(new Date(post.publishedAt))}
                  </p>
                  <p className="mt-2 text-sm font-bold text-primary group-hover:text-growth">
                    Read &rarr;
                  </p>
                </Link>
              </RevealOnScroll>
            ))}
          </div>

          {/* Newsletter nudge */}
          <RevealOnScroll delay={150}>
            <div className="mt-14 rounded-3xl bg-primary-50 p-8 text-center sm:p-10">
              <h2 className="font-display text-2xl font-bold text-primary">
                One Useful Idea in Your Inbox, Every Two Weeks.
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-ink/80">
                Join the newsletter and get each new article — plus lessons
                from real client systems — before anyone else.
              </p>
              <Link href="/newsletter" className="btn-primary mt-6">
                Join the Newsletter <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
