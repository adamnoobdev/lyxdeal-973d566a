
import { DealsListContainer } from "./DealsListContainer";
import { SidebarProvider } from "@/components/ui/sidebar";

export const DealsList = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <DealsListContainer />
    </SidebarProvider>
  );
};
