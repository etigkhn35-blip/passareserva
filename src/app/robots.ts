export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/hesabim", "/mesajlar"],
      },
    ],
    sitemap: "https://passareserva.com/sitemap.xml",
  };
}
