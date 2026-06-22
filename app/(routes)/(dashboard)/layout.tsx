import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./_common/app-sidebar";
import MobileNav from "./_common/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
            <AppSidebar />
            <SidebarInset
            className="bg-sidebar! border-none"
            >
            <div className="m-1 px-4 rounded-lg border border-border
             dark:border-[#e0e1e11a] shadow-xs bg-background h-full
            ">
            <div className="py-2 px-3 pb-28 md:pb-2">{children}</div>
            </div>
        </SidebarInset>
        <MobileNav />
    </SidebarProvider>
  )
}