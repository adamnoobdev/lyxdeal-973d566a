import { useState } from "react";

export const useImageUrl = (initialUrl: string) => {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (imageError || !initialUrl) {
      return "/placeholder.svg";
    }
    
    // If it's a blob URL or already a full URL, return as is
    if (initialUrl.startsWith('blob:') || initialUrl.startsWith('http')) {
      return initialUrl;
    }
    
    // If it's a relative path from Supabase storage, construct the full URL
    const { origin } = window.location;
    return `${origin}${initialUrl}`;
  };

  const handleImageError = () => {
    console.log('Image failed to load:', initialUrl);
    setImageError(true);
  };

  return {
    imageUrl: getImageUrl(),
    handleImageError,
    hasError: imageError
  };
};