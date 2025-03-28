
// Formatera datum för visning
export const formatDate = (dateString: string | null) => {
  if (!dateString) return "Okänt datum";
  const date = new Date(dateString);
  return date.toLocaleDateString('sv-SE');
};
