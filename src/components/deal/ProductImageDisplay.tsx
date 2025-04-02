
import React from "react";
import { ResponsiveImage } from "../common/ResponsiveImage";

interface ProductImageDisplayProps {
  imageUrl: string;
  title: string;
}

export const ProductImageDisplay = ({ imageUrl, title }: ProductImageDisplayProps) => {
  return (
    <div className="bg-white shadow-sm overflow-hidden">
      <ResponsiveImage
        src={imageUrl}
        alt={title}
        className="w-full aspect-[4/3] object-cover"
      />
    </div>
  );
};
