import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for initial development
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
  // Mock product data (in a real app, this would be fetched based on the id)
  const product = {
    id: 1,
    title: "Lyxig Spa-dag",
    description: "Heldags spa-tillgång med 60 minuters massage och ansiktsbehandling",
    longDescription: "Unna dig en hel dag av avkoppling på vårt lyxiga spa. I paketet ingår:\n\n" +
      "• Tillgång till alla spa-faciliteter\n" +
      "• 60 minuters klassisk massage\n" +
      "• Ansiktsbehandling\n" +
      "• Lunch med ett glas mousserande vin\n" +
      "• Lån av badrock, tofflor och handduk",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
    originalPrice: 2000,
    discountedPrice: 990,
    timeRemaining: "2 dagar kvar",
    category: "Skönhet & Spa",
    location: "Stockholm Spa & Wellness",
    validUntil: "2024-12-31",
    averageRating: 4.5
  };

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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 py-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Tillbaka till erbjudanden
        </Link>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <img
              src={product.imageUrl}
              alt={product.title}
              className="rounded-lg object-cover shadow-lg"
            />
          </div>
          
          <div className="space-y-6">
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            
            <h1 className="text-3xl font-bold">{product.title}</h1>
            
            <div className="flex items-center gap-2">
              {renderStars(product.averageRating)}
              <span className="text-sm text-gray-600">
                ({product.averageRating} / 5)
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg text-gray-600">{product.description}</p>
              <p className="whitespace-pre-line text-gray-700">{product.longDescription}</p>
            </div>
            
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Ordinarie pris</p>
                <p className="text-lg line-through">{formatPrice(product.originalPrice)}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Ditt pris</p>
                <p className="text-3xl font-bold text-success">{formatPrice(product.discountedPrice)}</p>
              </div>
              <Button className="w-full">Köp Nu</Button>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p>✓ Gäller till: {product.validUntil}</p>
              <p>✓ Plats: {product.location}</p>
              <p>✓ Tid kvar: {product.timeRemaining}</p>
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