
export const formatDate = (date: Date | string | null) => {
  if (!date) return "Okänt datum";
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('sv-SE');
};
