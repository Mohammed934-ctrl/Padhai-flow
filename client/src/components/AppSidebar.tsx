import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  GraduationCap,
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  BarChart2,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Plans", url: "/dashboard/plans", icon: CalendarDays },
  { title: "Today", url: "/dashboard/today", icon: CheckSquare },
  { title: "Progress", url: "/dashboard/progress", icon: BarChart2 },
];

export function AppSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-1 py-1">
          {/* Logo - hidden when collapsed */}
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary text-primary-foreground shrink-0">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-base tracking-tight">
              PadhaiFlow
            </span>
          </div>
          {/* Trigger always visible */}
          <SidebarTrigger />
        </div>
        {/* Logo icon only when collapsed */}
        <div className="hidden group-data-[collapsible=icon]:flex justify-center">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url} end>
                    {({ isActive }) => (
                      <SidebarMenuButton isActive={isActive} tooltip={item.title}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}