import * as React from "react";
function Sidebar({ className = "", ...props }: React.ComponentProps<"aside">) { return <aside data-slot="sidebar" className={`sidebar-root ${className}`} {...props} />; }
function SidebarHeader({ className = "", ...props }: React.ComponentProps<"div">) { return <div data-slot="sidebar-header" className={`sidebar-header ${className}`} {...props} />; }
function SidebarContent({ className = "", ...props }: React.ComponentProps<"div">) { return <div data-slot="sidebar-content" className={`sidebar-content ${className}`} {...props} />; }
function SidebarFooter({ className = "", ...props }: React.ComponentProps<"div">) { return <div data-slot="sidebar-footer" className={`sidebar-footer ${className}`} {...props} />; }
function SidebarMenu({ className = "", ...props }: React.ComponentProps<"ul">) { return <ul data-slot="sidebar-menu" className={`sidebar-menu ${className}`} {...props} />; }
function SidebarMenuItem({ className = "", ...props }: React.ComponentProps<"li">) { return <li data-slot="sidebar-menu-item" className={`sidebar-menu-item ${className}`} {...props} />; }
function SidebarMenuButton({ className = "", ...props }: React.ComponentProps<"div">) { return <div data-slot="sidebar-menu-button" className={`sidebar-menu-button ${className}`} {...props} />; }
export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton };
