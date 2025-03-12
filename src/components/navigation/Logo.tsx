
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface LogoProps {
  variant?: 'default' | 'miniature';
}

const Logo: React.FC<LogoProps> = ({ variant = 'default' }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [miniatureUrl, setMiniatureUrl] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const [logoData, miniatureData] = await Promise.all([
          supabase.storage.from('assets').getPublicUrl('Lyxdeal-logo.svg'),
          supabase.storage.from('assets').getPublicUrl('Min-logo-32x.png')
        ]);

        if (logoData?.data?.publicUrl) {
          setLogoUrl(logoData.data.publicUrl);
        }
        if (miniatureData?.data?.publicUrl) {
          setMiniatureUrl(miniatureData.data.publicUrl);
        }
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
            className="h-8 w-8 rounded-full object-contain" 
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
