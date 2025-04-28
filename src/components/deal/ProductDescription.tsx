
import React from "react";

interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription = ({ description }: ProductDescriptionProps) => {
  return (
    <div className="bg-white shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold">Det här ingår</h2>
      <div className="space-y-4">
        {description.split('\n').map((paragraph, index) => (
          <p key={index} className="text-gray-700">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};
