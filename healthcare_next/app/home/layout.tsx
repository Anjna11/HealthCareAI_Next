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
                    <SidebarHeader>
                        <p className="text-center text-xl">
                            Dhanomi - HealthCare
                        </p>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href='/home/patients'>
                                    <Inbox />
                                    <span>All Patients</span>
                                    </a>
                                </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>

                            <SidebarMenu>
                                <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href='#'>
                                    <Calendar />
                                    <span>Approtments</span>
                                    </a>
                                </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>


                        </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>


                    <SidebarFooter>
                        AnjnaJagatiya@gmail.com
                    </SidebarFooter>
                </Sidebar>
                <main className="flex-1 p-4">
                    <SidebarTrigger/>
                    {children}
                </main>
            </SidebarProvider>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel className="w-sm max-w-sm">
                <Chat/>
            </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}