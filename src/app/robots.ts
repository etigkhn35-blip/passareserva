export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/hesabim",
          "/mesajlar",
          "/api",
          "/_next",
        ],
      },

      // 🔥 AI bot kontrol (isteğe bağlı ama öneririm)
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
      {
        userAgent: "ClaudeBot",
        disallow: "/",
      },
    ],

    sitemap: "https://passareserva.com/sitemap.xml",
    host: "https://passareserva.com",
  };
}