'use client';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, 
    SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, 
    SidebarMenuItem, SidebarProvider, 
    SidebarTrigger} from "@/components/ui/sidebar";

import { Calendar, Inbox, Search, Settings } from "lucide-react"
import Chat from "../chat";

export default function HomeLayout({ children }: { children: React.ReactNode }) {

    return (
        <div>
            <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
            <SidebarProvider>
                <Sidebar id="left">
                <SidebarHeader
                    className="text-gray-300"
                style={{background: "#11224E"}}>
                    <p
                    className="text-center font-semibold leading-tight mt-2"
                    >
                        <span className="text-2xl" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                          DHANOMI
                        </span> <br/>
                        <span className="text-base" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                          HealthCare.AI
                        </span>
                    </p>
                    <hr/>
                </SidebarHeader>
                    <SidebarContent className="mt-3">
                        <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                <SidebarMenuButton asChild className="text-base p-4.5 pl-2 rounded-none" 
                                    style={{ fontFamily: "'Poppins', sans-serif"}}>
                                    <a href='/home/patients'>
                                    <Inbox />
                                    <span>All Patients</span>
                                    </a>
                                </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>

                            <SidebarMenu>
                                <SidebarMenuItem>
                                <SidebarMenuButton asChild className="text-base p-4.5 pl-2 rounded-none"
                                     style={{ fontFamily: "'Poppins', sans-serif"}}>
                                    <a href='/home/appointments'>
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
                        <p className="text-center"  style={{ fontFamily: "'Poppins', sans-serif"}}>
                            AnjnaJagatiya@gmail.com
                        </p>
                    </SidebarFooter>
                </Sidebar>
                <main className="flex-1 p-4">
                    <SidebarTrigger className="hover:bg-[#11224E]/70 hover:text-white"/>
                    {children}
                </main>
            </SidebarProvider>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className="w-sm max-w-sm">
                <Chat onChange={(st) => console.log(st)}/>
            </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}