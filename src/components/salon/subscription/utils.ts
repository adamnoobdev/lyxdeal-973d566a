
export const formatDate = (date: string | null) => {
  if (!date) return "Okänt datum";
  
  return new Date(date).toLocaleDateString('sv-SE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};
