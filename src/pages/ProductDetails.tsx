import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeal } from "@/hooks/useDeal";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for reviews (we can implement real reviews later)
const reviews = [
  {
    id: 1,
    author: "Anna Svensson",
    rating: 5,
    comment: "Fantastisk upplevelse! Verkligen värt pengarna.",
    date: "2024-02-15"
  },
  {
    id: 2,
    author: "Erik Larsson",
    rating: 4,
    comment: "Mycket bra service och trevlig personal.",
    date: "2024-02-10"
  }
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: deal, isLoading, isError } = useDeal(id || "");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Erbjudandet kunde inte hittas
            </h2>
            <Button
              onClick={() => navigate("/")}
              className="mt-4"
            >
              Gå tillbaka till startsidan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !deal) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const discountPercentage = Math.round(
    ((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 py-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Tillbaka till erbjudanden
        </Link>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="relative">
              <img
                src={deal.imageUrl}
                alt={deal.title}
                className="aspect-[4/3] w-full rounded-lg object-cover shadow-lg"
              />
              <Badge 
                className="absolute right-3 top-3 bg-primary text-white font-semibold"
              >
                {discountPercentage}% RABATT
              </Badge>
            </div>
          </div>
          
          <div className="space-y-6">
            <Badge variant="outline" className="mb-2">
              {deal.category}
            </Badge>
            
            <h1 className="text-3xl font-bold">{deal.title}</h1>
            
            <div className="flex items-center gap-2">
              {renderStars(4.5)}
              <span className="text-sm text-gray-600">
                (4.5 / 5)
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg text-gray-600">{deal.description}</p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Ordinarie pris</p>
                <p className="text-lg line-through">{formatPrice(deal.originalPrice)}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Ditt pris</p>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(deal.discountedPrice)}
                </p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Köp Nu
              </Button>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p>✓ Plats: {deal.city}</p>
              <p>✓ Tid kvar: {deal.timeRemaining}</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Omdömen</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg bg-white p-6 shadow">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{review.author}</span>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <div className="mb-2 flex">{renderStars(review.rating)}</div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;