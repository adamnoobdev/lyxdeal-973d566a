
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/sections/HeroSection';
import { DealsSection } from '@/components/home/sections/DealsSection';
import { PromotionBanner } from '@/components/home/sections/PromotionBanner';
import { StatsSection } from '@/components/home/sections/StatsSection';
import { CategorySection } from '@/components/home/index/CategorySection';
import { CreateAdminAccountForm } from '@/components/admin/CreateAdminAccountForm';

const Index = () => {
  const [showAdminCreator, setShowAdminCreator] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Alla Kategorier");
  const [selectedCity, setSelectedCity] = useState("Alla Städer");
  
  useEffect(() => {
    // Check if URL has ?createAdmin=true
    const params = new URLSearchParams(window.location.search);
    setShowAdminCreator(params.get('createAdmin') === 'true');
  }, []);
  
  return (
    <Layout>
      {showAdminCreator ? (
        <div className="container py-12">
          <CreateAdminAccountForm />
        </div>
      ) : (
        <>
          <HeroSection />
          <div className="container py-8 md:py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <CategorySection 
                selectedCategory={selectedCategory}
                selectedCity={selectedCity}
                onSelectCategory={setSelectedCategory}
                onSelectCity={setSelectedCity}
              />
            </div>
            <div className="md:col-span-3">
              <DealsSection 
                selectedCategory={selectedCategory}
                selectedCity={selectedCity}
              />
            </div>
          </div>
          <PromotionBanner />
          <StatsSection />
        </>
      )}
    </Layout>
  );
};

export default Index;
