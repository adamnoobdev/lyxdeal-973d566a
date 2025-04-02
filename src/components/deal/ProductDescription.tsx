
import React from "react";

interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription = ({ description }: ProductDescriptionProps) => {
  return (
    <div className="bg-white shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold">Det här ingår</h2>
      <ul className="space-y-3">
        {description.split('\n').map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary mt-2 rounded-full" />
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
