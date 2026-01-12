"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export function useAdminStats() {
  const [stats, setStats] = useState({
    users: 0,
    ilanlar: 0,
    messages: 0,
    destek: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const usersSnap = await getCountFromServer(collection(db, "users"));
        const ilanSnap = await getCountFromServer(collection(db, "ilanlar"));
        const msgSnap = await getCountFromServer(collection(db, "messages"));
        const destekSnap = await getCountFromServer(collection(db, "destek_talepleri"));

        setStats({
          users: usersSnap.data().count,
          ilanlar: ilanSnap.data().count,
          messages: msgSnap.data().count,
          destek: destekSnap.data().count,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return { stats, loading };
}
