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

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Main horizontal layout: Sidebar + Main content */}
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <Sidebar id="left" className="flex-shrink-0">
            <SidebarHeader>
              <div className="flex flex-col items-center justify-center text-[var(--sidebar-text-main)]">
                <div className="flex items-center gap-3">
                  <HeartPulse className="w-6.5 h-6" />
                  <h1
                    className="text-base font-extrabold tracking-tight "
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    DHANOMI
                  </h1>
                </div>
                <p
                  className="text-sm"
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
            {/* Header */}
            <div className="w-full">
              <div className="p-4 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="rounded-md p-1" />
                </div>
              </div>
            </div>

            {/* Page content */}
            <main className="flex-1 overflow-auto pb-40">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>

      {/* Chat at the bottom */}
      <div className="fixed bottom-0 left-64 right-0 z-50 border-t">
        <Chat onChange={(st) => console.log(st)} />
      </div>
    </div>
  );
}
