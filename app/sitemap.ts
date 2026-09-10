import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/what-we-build", priority: 0.9 },
    { path: "/how-it-works", priority: 0.8 },
    { path: "/industries", priority: 0.8 },
    { path: "/case-studies", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/start", priority: 1 },
    { path: "/assessment", priority: 0.9 },
    { path: "/demo", priority: 0.8 },
    { path: "/demo/booking", priority: 0.6 },
    { path: "/demo/dashboard", priority: 0.6 },
    { path: "/calculator", priority: 0.9 },
    { path: "/experience", priority: 0.7 },
    { path: "/referral", priority: 0.6 },
    { path: "/blog", priority: 0.7 },
    { path: "/resources", priority: 0.7 },
    { path: "/newsletter", priority: 0.5 },
  ];

  const pages: MetadataRoute.Sitemap = routes.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
