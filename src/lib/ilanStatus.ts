export const isExpired = (ilan: any) => {
  if (!ilan?.bitisTarihi) return false;

  const end =
    ilan.bitisTarihi?.toDate?.() || new Date(ilan.bitisTarihi);

  return end < new Date();
};