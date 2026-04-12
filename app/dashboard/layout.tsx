import { Telescope } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Telescope className="size-3.5" />
            </div>
            <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
              Vantage
            </span>
          </div>
        </SidebarHeader>
        <Separator className="mx-2 w-auto" />
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <div className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
