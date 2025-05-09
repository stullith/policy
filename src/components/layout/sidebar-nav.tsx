// src/components/layout/sidebar-nav.tsx
'use client';

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, Wand2, Settings, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/reports', label: 'Detailed Reports', icon: FileText },
  { href: '/remediation', label: 'Remediation AI', icon: Wand2 },
  { href: '/trends', label: 'Compliance Trends', icon: TrendingUp },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden"}}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <SidebarMenuItem className="mt-auto">
         <SidebarMenuButton asChild tooltip={{children: "Settings", className: "group-data-[collapsible=icon]:block hidden"}}>
            <Link href="#">
              <Settings />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
