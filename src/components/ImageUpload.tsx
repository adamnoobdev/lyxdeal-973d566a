import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
}

export const ImageUpload = ({ onImageSelected }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kontrollera filtyp
    if (!file.type.startsWith('image/')) {
      toast.error('Endast bildfiler är tillåtna');
      return;
    }

    // Kontrollera filstorlek (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Bilden får inte vara större än 5MB');
      return;
    }

    setIsUploading(true);
    try {
      // Här skulle vi normalt ladda upp bilden till en server
      // För nu simulerar vi en uppladdning och returnerar en dummy URL
      await new Promise(resolve => setTimeout(resolve, 1000));
      const imageUrl = URL.createObjectURL(file);
      onImageSelected(imageUrl);
      toast.success('Bilden har laddats upp');
    } catch (error) {
      toast.error('Något gick fel vid uppladdningen');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isUploading}
      />
      {isUploading && <p className="text-sm text-muted-foreground">Laddar upp bild...</p>}
    </div>
  );
};