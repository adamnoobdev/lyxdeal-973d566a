
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/sections/HeroSection';
import { DealsSection } from '@/components/home/sections/DealsSection';
import { PromotionBanner } from '@/components/home/sections/PromotionBanner';
import { StatsSection } from '@/components/home/sections/StatsSection';
import { CategorySection } from '@/components/home/index/CategorySection';
import { CreateAdminAccountForm } from '@/components/admin/CreateAdminAccountForm';

const Index = () => {
  const [showAdminCreator, setShowAdminCreator] = useState(false);
  
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
          <CategorySection />
          <DealsSection />
          <PromotionBanner />
          <StatsSection />
        </>
      )}
    </Layout>
  );
};

export default Index;
