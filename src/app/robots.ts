import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pendek.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/tentang",
          "/harga",
          "/kontak",
          "/syarat-ketentuan",
          "/kebijakan-privasi",
          "/api-publik",
          "/masuk",
          "/daftar",
        ],
        disallow: [
          "/dashboard/",
          "/dashboard/*",
          "/admin/",
          "/admin/*",
          "/s/",
          "/s/*",
          "/api/",
          "/api/*",
          "/auth/",
          "/auth/*",
        ],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
