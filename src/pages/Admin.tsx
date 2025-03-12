
import { Routes, Route } from "react-router-dom";
import { AdminAuthCheck } from "@/components/admin/auth/AdminAuthCheck";
import { DealsList } from "@/components/admin/deals";
import { SalonsList } from "@/components/admin/salons/SalonsList";
import { SalonDeals } from "@/components/admin/salons/SalonDeals";
import { Dashboard } from "@/components/admin/Dashboard";

export default function Admin() {
  return (
    <AdminAuthCheck>
      <div className="p-4 md:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deals" element={<DealsList />} />
          <Route path="/salons" element={<SalonsList />} />
          <Route path="/salons/:salonId/deals" element={<SalonDeals />} />
        </Routes>
      </div>
    </AdminAuthCheck>
  );
}
