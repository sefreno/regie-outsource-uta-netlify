"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Home as HomeIcon,
  FileText as FileTextIcon,
  FileCheck as FileCheckIcon,
  Clipboard as ClipboardIcon,
  Wrench as ToolIcon,
  Truck as TruckIcon,
  Banknote as BanknoteIcon,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Bell as BellIcon,
  ArrowRightCircle as ArrowRightCircleIcon,
  ArrowLeftCircle as ArrowLeftCircleIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Tableau de bord",
    href: "/dashboard/",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    label: "Qualification",
    href: "/qualification/",
    icon: <FileTextIcon className="h-5 w-5" />,
  },
  {
    label: "Confirmation",
    href: "/confirmation/",
    icon: <FileCheckIcon className="h-5 w-5" />,
  },
  {
    label: "Gestion administrative",
    href: "/administrative/",
    icon: <ClipboardIcon className="h-5 w-5" />,
  },
  {
    label: "Visite technique",
    href: "/technical-visit/",
    icon: <ToolIcon className="h-5 w-5" />,
  },
  {
    label: "Installation",
    href: "/installation/",
    icon: <TruckIcon className="h-5 w-5" />,
  },
  {
    label: "Facturation",
    href: "/billing/",
    icon: <BanknoteIcon className="h-5 w-5" />,
  },
  {
    label: "Paramètres",
    href: "/settings/",
    icon: <SettingsIcon className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "bg-gray-900 text-gray-300 border-r border-gray-800 h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-3 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-gray-100 hover:bg-gray-800"
          >
            {collapsed ? (
              <ArrowRightCircleIcon className="h-5 w-5" />
            ) : (
              <ArrowLeftCircleIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                pathname === item.href
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-gray-100 hover:bg-gray-800",
                "button-highlight"
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3">
          <Separator className="bg-gray-800" />
          <div className="pt-3">
            <Link
              href="/login/"
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors",
                "button-highlight"
              )}
            >
              <BellIcon className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Changer de compte</span>}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
