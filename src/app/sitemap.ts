import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default async function sitemap() {
  const baseUrl = "https://passareserva.com";

  const snapshot = await getDocs(collection(db, "ilanlar"));

  const listings = snapshot.docs
    .filter(doc => doc.data().status === "approved") // only approved listings
    .map(doc => ({
      url: `${baseUrl}/listing/${doc.id}`,
      lastModified: new Date(),
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/listings`,
      lastModified: new Date(),
    },
    ...listings,
  ];
}