import { LayoutDashboard, LogOut, Shield, User } from "lucide-react"
import { NavLink, Outlet, ScrollRestoration } from "react-router-dom"
import { useLogout } from "~/auth/use-logout"
import { useUiAccess } from "~/auth/use-ui-access"
import { useViewer } from "~/auth/use-viewer"
import { cn } from "~/common/cn"
import { dashboardPath, internalAdminDashboardPath, profilePath } from "~/common/paths"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/ui/sidebar"
import { ThemeToggle } from "~/ui/theme-toggle"
import { UserAvatar } from "~/users/user-avatar"

function AppSidebar() {
  const { uiAccess } = useUiAccess()
  const { viewer } = useViewer()
  const logout = useLogout()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to={dashboardPath({})}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  P
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Prefab</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to={dashboardPath({})}>
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive} tooltip="Dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to={profilePath({})}>
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive} tooltip="Profile">
                      <User />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {uiAccess?.canInternalAdmin.value && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <NavLink to={internalAdminDashboardPath({})}>
                    {({ isActive }) => (
                      <SidebarMenuButton isActive={isActive} tooltip="Users">
                        <Shield />
                        <span>Users</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={viewer.fullName}>
              <UserAvatar user={viewer} className="size-4" />
              <span className="truncate">{viewer.fullName}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign Out" onClick={logout}>
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export const SidebarLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className={cn("flex h-12 items-center gap-2 border-b px-4 md:hidden")}>
          <SidebarTrigger />
        </header>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Outlet />
          <ScrollRestoration />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
