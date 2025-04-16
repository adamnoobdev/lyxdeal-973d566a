
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Home, FileText, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreatorLayoutProps {
  children: ReactNode;
}

export const CreatorLayout = ({ children }: CreatorLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Creator Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - branding */}
            <Link to="/" className="flex items-center">
              {/* Replace with your logo */}
              <span className="font-bold text-xl text-primary">Lyxdeal</span>
              <span className="ml-2 text-sm text-gray-500">Kreatör</span>
            </Link>
            
            {/* Right side - nav links */}
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                <Home className="inline-block w-4 h-4 mr-1" />
                Hem
              </Link>
              <Link to="/creator/dashboard" className="text-primary hover:text-primary/80 px-3 py-2 text-sm font-medium">
                <Award className="inline-block w-4 h-4 mr-1" />
                Kreatörportal
              </Link>
              {user ? (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/creator">Min profil</Link>
                </Button>
              ) : (
                <Button variant="default" size="sm" asChild>
                  <Link to="/auth">Logga in</Link>
                </Button>
              )}
            </div>
            
            {/* Mobile menu button - we would implement a full mobile menu in a real application */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" className="-mr-1">
                <span className="sr-only">Öppna meny</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Lyxdeal. Alla rättigheter förbehållna.</p>
        </div>
      </footer>
    </div>
  );
};
