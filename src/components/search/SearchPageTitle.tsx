
interface SearchPageTitleProps {
  deals: any[];
  query: string;
  category: string;
  city: string;
}

export const SearchPageTitle = ({
  deals,
  query,
  category,
  city,
}: SearchPageTitleProps) => {
  const getCategoryText = () => {
    if (category !== "Alla Erbjudanden") {
      return category.toLowerCase();
    }
    return "skönhetserbjudanden";
  };

  const getCityText = () => {
    if (city !== "Alla Städer") {
      return city;
    }
    return "Sverige";
  };

  const getTitleText = () => {
    if (query) {
      return `Resultat för "${query}"`;
    } 
    
    if (category !== "Alla Erbjudanden" && city !== "Alla Städer") {
      return `${category} i ${city}`;
    } 
    
    if (category !== "Alla Erbjudanden") {
      return category;
    } 
    
    if (city !== "Alla Städer") {
      return `Skönhetserbjudanden i ${city}`;
    }
    
    return "Alla skönhetserbjudanden";
  };

  const getDescriptionText = () => {
    let categoryText = getCategoryText();
    let cityText = getCityText();
    
    return `Hitta de bästa ${categoryText} i ${cityText}. Rabatterade skönhetsbehandlingar och andra lyxupplevelser till förmånliga priser.`;
  };

  return (
    <div className="my-6 text-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{getTitleText()}</h1>
      <p className="text-muted-foreground">{getDescriptionText()}</p>
      <p className="text-sm font-medium mt-4">{deals.length} erbjudanden hittades</p>
    </div>
  );
};
