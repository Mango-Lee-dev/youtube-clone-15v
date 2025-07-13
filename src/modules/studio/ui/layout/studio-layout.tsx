import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavBar } from "@/modules/home/ui/components/home-navbar";
import { HomeSidebar } from "@/modules/home/ui/components/home-sidebar";

export const StudioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavBar />
        <div className="flex min-h-screen pt-[4rem]">
          <HomeSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
