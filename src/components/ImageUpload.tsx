import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
}

export const ImageUpload = ({ onImageSelected }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

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
      toast.success('Bilden har laddats upp');
    } catch (error) {
      console.error('Upload error:', error);
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