
import { Routes, Route } from "react-router-dom";
import { AdminAuthCheck } from "@/components/admin/auth/AdminAuthCheck";
import { DealsList } from "@/components/admin/deals";
import { SalonsList } from "@/components/admin/salons/SalonsList";
import { SalonDeals } from "@/components/admin/salons/SalonDeals";
import { Dashboard } from "@/components/admin/Dashboard";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";

export default function Admin() {
  return (
    <AdminAuthCheck>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deals" element={<DealsList />} />
          <Route path="/salons" element={<SalonsList />} />
          <Route path="/salons/:salonId/deals" element={<SalonDeals />} />
        </Routes>
      </AdminLayout>
    </AdminAuthCheck>
  );
}
