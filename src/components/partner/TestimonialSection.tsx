
import { Card, CardContent } from "../ui/card";
import { ResponsiveImage } from "../common/ResponsiveImage";
import { StarIcon } from "lucide-react";

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  avatarUrl: string;
}

const Testimonial = ({ name, role, content, avatarUrl }: TestimonialProps) => (
  <Card className="h-full">
    <CardContent className="p-4 md:p-6">
      <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
          <ResponsiveImage 
            src={avatarUrl || '/placeholder.svg'} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-sm md:text-base">{name}</h4>
          <p className="text-xs md:text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <div className="flex mb-2 md:mb-3">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} className="h-3 w-3 md:h-4 md:w-4 fill-current text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 text-xs md:text-sm">{content}</p>
    </CardContent>
  </Card>
);

export const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Sofia Lindberg",
      role: "Ägare, Skönhet & Harmoni",
      content: "Sedan vi blev partner med Lyxdeal har vi sett en betydande ökning i nya kunder. Plattformen är enkel att använda och ger oss en väg att nå kunder vi annars aldrig skulle nått.",
      avatarUrl: "/placeholder.svg"
    },
    {
      name: "Anders Johansson",
      role: "VD, Cityspa Stockholm",
      content: "Lyxdeal har hjälpt oss att fylla luckor i schemat och maximera vår kapacitet. Supporten är utmärkt och det är enkelt att hantera erbjudanden genom administrationspanelen.",
      avatarUrl: "/placeholder.svg"
    },
    {
      name: "Maria Eriksson",
      role: "Ägare, Skönhetskliniken",
      content: "Att bli partner med Lyxdeal var ett av de bästa affärsbesluten vi tagit. Vi har fått nya lojala kunder och sett en ökning i vår månatliga omsättning med mer än 20%.",
      avatarUrl: "/placeholder.svg"
    }
  ];

  return (
    <div className="py-10 md:py-16 bg-secondary-50">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4">Vad våra partners säger</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Hör från befintliga salongspartners om deras erfarenheter av att arbeta med Lyxdeal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
};
