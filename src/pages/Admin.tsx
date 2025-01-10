import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DealsList } from "@/components/admin/DealsList";
import { SalonsList } from "@/components/admin/salons/SalonsList";

export default function Admin() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DealsList />} />
            <Route path="/salons" element={<SalonsList />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}