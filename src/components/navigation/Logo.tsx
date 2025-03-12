
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface LogoProps {
  variant?: 'default' | 'miniature';
}

const Logo: React.FC<LogoProps> = ({ variant = 'default' }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [miniatureUrl, setMiniatureUrl] = useState('');
  const miniatureIcon = '/lovable-uploads/5a5c81bd-bf04-44b1-a9f0-d931dbdc78fa.png';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const logoData = await supabase.storage.from('assets').getPublicUrl('Lyxdeal-logo.svg');

        if (logoData?.data?.publicUrl) {
          setLogoUrl(logoData.data.publicUrl);
        }
        
        // Vi använder den lokala bilden direkt istället för att hämta från Supabase
        setMiniatureUrl(miniatureIcon);
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    
    fetchImages();
  }, []);

  return (
    <Link to="/" className="flex items-center">
      {variant === 'miniature' ? (
        miniatureUrl ? (
          <img 
            src={miniatureUrl} 
            alt="LyxDeal" 
            className="h-6 w-6 object-contain" 
          />
        ) : (
          <span className="font-bold text-xl">L</span>
        )
      ) : (
        logoUrl ? (
          <img 
            src={logoUrl} 
            alt="LyxDeal Logo" 
            className="h-8 w-auto" 
          />
        ) : (
          <span className="font-bold text-2xl">LyxDeal</span>
        )
      )}
    </Link>
  );
};

export default Logo;
