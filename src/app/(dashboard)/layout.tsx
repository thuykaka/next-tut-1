import { DashboardSidebar } from '@/modules/dashboard/ui/components/dashboard-sidebar';
import Header from '@/modules/dashboard/ui/components/header';
import KBar from '@/modules/dashboard/ui/components/kbar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <KBar>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <Header />
          <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
