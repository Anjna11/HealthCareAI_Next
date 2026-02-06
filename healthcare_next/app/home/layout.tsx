'use client';
import dynamic from 'next/dynamic';
import { HeartPulse } from 'lucide-react';  

const ResizablePanelGroup = dynamic(
  () => import('@/components/ui/resizable').then((m) => m.ResizablePanelGroup),
  { ssr: false }
);

const ResizablePanel = dynamic(
  () => import('@/components/ui/resizable').then((m) => m.ResizablePanel),
  { ssr: false }
);

const ResizableHandle = dynamic(
  () => import('@/components/ui/resizable').then((m) => m.ResizableHandle),
  { ssr: false }
);

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger
} from '@/components/ui/sidebar';
import { Calendar, Inbox } from 'lucide-react';
import Chat from '../chat';
import { usePathname } from 'next/navigation';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = pathname === '/home/patients' ? 'Patient Records' : pathname === '/home/appointments' ? 'Appointments' : ''; // Add more cases as needed

  return (
    <div className="flex flex-col h-screen">
      {/* Main horizontal layout: Sidebar + Main content */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <Sidebar id="left" className="flex-shrink-0">
            <SidebarHeader className="py-4">
              <div className="flex flex-col items-center justify-center text-[var(--sidebar-text-main)] ">
                <div className="flex items-center gap-3">
                  {/* <HeartPulse className="w-6 h-6 text-[#F87B1B]"/> */}  
                  <h1
                    className="text-base font-extrabold tracking-tight text-[#F87B1B]/80"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    DHANOMI
                  </h1>
                </div>
                <p
                  className="text-sm opacity-80"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  HealthCare.AI
                </p>
              </div>
            </SidebarHeader>

            <SidebarContent className="mt-3">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="text-base p-4.5 pl-2 rounded-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <a href="/home/patients">
                          <Inbox />
                          <span>Patient Records</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>

                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="text-base p-4.5 pl-2 rounded-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <a href="/home/appointments">
                          <Calendar />
                          <span>Appointment</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <div className="flex items-center bg-[var(--sidebar-bottom-back)] rounded px-1 py-1 cursor-pointer hover:bg-white/20 transition">
                <div className="text-xs w-6 h-6 flex items-center justify-center rounded-full bg-[var(--sidebar-bottom-icon-back)] text-[var(--sidebar-bottom-icon-fore)] font-semibold ml-2">
                  AJ
                </div>
                <div className="ml-3">
                  <div className="text-sm font-bold">Dr. Anjna Jagatiya</div>
                  <div className="text-[12px]">Healthcare Admin</div>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header - Merged SidebarTrigger and Page Title */}
            <div className="w-full">
              <div className="p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="rounded-md p-1" />
                  {/* Conditionally render the page title if provided */}
                  {pageTitle && (
                    <h2
                      className="text-lg font-semibold"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {pageTitle}
                    </h2>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50} minSize={50}>
                  <main className="h-full overflow-auto">
                    {children}
                  </main>
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={30} minSize={20}>
                  <div className="h-full overflow-auto">
                    <Chat onChange={(st) => console.log(st)} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}