"use client"

import { brand, Logo } from "@syner/ui/branding"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@syner/ui/components/sidebar"
import { ThemeToggle } from "@syner/ui/components/theme-toggle"

import { groups, links } from "@/components/nav"

export function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar()

  // On mobile the sidebar is a sheet over the page. Following a link there
  // scrolls the content behind it and leaves the drawer covering what you just
  // navigated to, with the body still scroll-locked. Dismiss on tap.
  const dismissOnMobile = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={brand.name}>
              <Logo className="size-5 shrink-0" />
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">{brand.name}</span>
                <span className="truncate text-muted-foreground text-xs">{brand.tagline}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<a href={item.href} onClick={dismissOnMobile} />}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton
                    render={
                      <a
                        href={link.href}
                        onClick={dismissOnMobile}
                        rel="noreferrer"
                        target="_blank"
                      />
                    }
                    tooltip={link.title}
                  >
                    <link.icon />
                    <span>{link.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
              <span className="truncate text-muted-foreground text-xs group-data-[collapsible=icon]:hidden">
                shadcn · Base UI
              </span>
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
