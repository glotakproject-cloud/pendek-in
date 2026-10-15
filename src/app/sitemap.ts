import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pendek.in";
  const now = new Date();

  const routes: Array<{
    path: string;
    priority: number;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  }> = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/harga", priority: 0.9, changeFrequency: "weekly" },
    { path: "/api-publik", priority: 0.8, changeFrequency: "weekly" },
    { path: "/tentang", priority: 0.7, changeFrequency: "monthly" },
    { path: "/kontak", priority: 0.7, changeFrequency: "monthly" },
    { path: "/masuk", priority: 0.6, changeFrequency: "monthly" },
    { path: "/daftar", priority: 0.6, changeFrequency: "monthly" },
    { path: "/syarat-ketentuan", priority: 0.4, changeFrequency: "yearly" },
    { path: "/kebijakan-privasi", priority: 0.4, changeFrequency: "yearly" },
  ];

  return routes.map((route) => ({
    url: `${appUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
