
import { AdminSidebarLinks } from "./AdminSidebarLinks";
import { SalonSidebarLinks } from "./SalonSidebarLinks";

interface AdminSidebarContentProps {
  userRole?: string;
}

export const AdminSidebarContent = ({ userRole }: AdminSidebarContentProps) => {
  const isAdmin = userRole !== 'salon_owner';
  
  return (
    <div className="flex flex-col gap-4 p-4">
      <AdminSidebarLinks />
      {!isAdmin && <SalonSidebarLinks />}
    </div>
  );
};
