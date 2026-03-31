import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://passareserva.com",
      lastModified: new Date(),
    },
    {
      url: "https://passareserva.com/ilanlar",
      lastModified: new Date(),
    },
  ];
}
