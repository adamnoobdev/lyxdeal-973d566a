
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Logo: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await supabase.storage.from('assets').getPublicUrl('Lyxdeal-logo.svg');
        if (data?.publicUrl) {
          setLogoUrl(data.publicUrl);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    
    fetchLogo();
  }, []);

  return (
    <Link to="/" className="flex items-center">
      {logoUrl ? (
        <img src={logoUrl} alt="LyxDeal Logo" className="w-full h-auto" />
      ) : (
        <span className="font-bold text-2xl">LyxDeal</span>
      )}
    </Link>
  );
};

export default Logo;
