'use client';
import dynamic from 'next/dynamic';
import { HeartPulse } from 'lucide-react'; // ✅ Added for the logo

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
    <div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <SidebarProvider>
            {/* ==== Sidebar ==== */}
            <Sidebar id="left">
              <SidebarHeader
                className="text-gray-300"
                style={{ background: '#11224E' }}
              >
                {/* ✅ Added logo from login page */}
                <div className="flex flex-col items-center justify-center py-3">
                  <div className="flex items-center gap-3 text-[#F87B1B] -ml-4">
                    <HeartPulse className="w-6.5 h-6" />
                    <h1
                      className="text-2xl font-extrabold text-white tracking-tight -ml-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      DHANOMI
                    </h1>
                  </div>
                  <p
                    className="text-sm text-gray-300 -mr-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    HealthCare.AI
                  </p>
                </div>

                <hr className="border-[#F87B1B]/30" />
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

              <SidebarFooter className="text-black bg-[#F87B1B]/95">
                <p className="text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  AnjnaJagatiya@gmail.com
                </p>
              </SidebarFooter>
            </Sidebar>

            {/* ==== Main Content ==== */}
            <main className="flex-1 p-4">
              <SidebarTrigger className="hover:bg-[#11224E]/70 hover:text-white" />
              {children}
            </main>
          </SidebarProvider>
        </ResizablePanel>

        <ResizableHandle />

        {/* ==== Chat Panel ==== */}
        <ResizablePanel className="w-sm max-w-sm">
          <Chat onChange={(st) => console.log(st)} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
