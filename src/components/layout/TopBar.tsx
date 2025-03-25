
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="w-full bg-primary-600 text-white py-2 text-center text-sm fixed top-0 left-0 z-[60]">
      <div className="container mx-auto px-4">
        <Link 
          to="/partner" 
          className="inline-flex items-center gap-1 hover:underline font-medium"
        >
          Bli salongspartner idag och få en gratis provmånad! 
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
