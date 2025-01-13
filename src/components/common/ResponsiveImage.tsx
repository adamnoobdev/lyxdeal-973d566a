import { useImageUrl } from "@/hooks/useImageUrl";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export const ResponsiveImage = ({ src, alt, className = "", ...props }: ResponsiveImageProps) => {
  const { imageUrl, handleImageError } = useImageUrl(src);

  return (
    <img
      src={imageUrl}
      alt={alt}
      onError={handleImageError}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};