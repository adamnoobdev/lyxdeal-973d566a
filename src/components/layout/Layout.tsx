
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import DesktopNav from "../navigation/DesktopNav";
import MobileNav from "../navigation/MobileNav";
import { Toaster } from "../ui/sonner";
import { DevelopmentNav } from "../development/DevelopmentNav";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <DesktopNav />
        <MobileNav />
      </header>
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" closeButton />
      <DevelopmentNav />
    </div>
  );
}
