
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Store } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="w-full bg-primary text-white py-2 text-center text-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto px-4">
        <Link 
          to="/partner" 
          className="inline-flex items-center justify-center gap-1 hover:underline font-medium"
        >
          <Store className="h-4 w-4 mr-1" />
          <span className="hidden xs:inline">Salongsägare: Bli partner idag och få en </span>
          <span className="xs:hidden">För salonger: </span>
          <span className="font-bold whitespace-nowrap">gratis provmånad</span>
          <span className="hidden xs:inline"> med kod "provmanad"</span>
          <ArrowRight className="h-4 w-4 ml-1 animate-pulse" />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
