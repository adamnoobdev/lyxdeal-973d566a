
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveImage } from "./common/ResponsiveImage";
import { X } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
  currentImageUrl?: string;
}

export const ImageUpload = ({ onImageSelected, currentImageUrl }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Endast bildfiler är tillåtna');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Bilden får inte vara större än 5MB');
      return;
    }

    // Create a local preview before upload
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setIsUploading(true);
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `deals/${fileName}`;

      // Upload the file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      onImageSelected(publicUrl);
      setPreviewUrl(publicUrl);
      toast.success('Bilden har laddats upp');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Något gick fel vid uppladdningen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageSelected(''); // Send empty string to indicate image removal
    toast.success('Bilden har tagits bort');
  };

  return (
    <div className="space-y-4">
      {previewUrl && (
        <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-md border border-gray-200">
          <ResponsiveImage 
            src={previewUrl} 
            alt="Förhandsgranskning" 
            className="h-full w-full object-cover"
          />
          <Button 
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
            onClick={handleRemoveImage}
            title="Ta bort bild"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Ta bort bild</span>
          </Button>
        </div>
      )}
      <div className="space-y-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        {isUploading && <p className="text-sm text-muted-foreground">Laddar upp bild...</p>}
      </div>
    </div>
  );
};
