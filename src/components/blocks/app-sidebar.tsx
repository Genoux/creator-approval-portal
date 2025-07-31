"use client";

import {
  Image as ImageIcon,
  MessageCircleQuestionMark,
  NotepadText,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import type * as React from "react";
import { NavMain } from "@/components/blocks/nav-main";
import { NavSecondary } from "@/components/blocks/nav-secondary";
import { NavUser } from "@/components/blocks/nav-user";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Creator Approval",
      url: "/dashboard",
      icon: UserPlus,
    },
    {
      title: "Content for Review",
      url: "#",
      icon: ImageIcon,
      disabled: true,
    },
    {
      title: "Briefs for Review",
      url: "#",
      icon: NotepadText,
      disabled: true,
    },
  ],
  navSecondary: [
    {
      title: "Got a Question?",
      url: "#",
      icon: MessageCircleQuestionMark,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-col items-start gap-1.5 justify-between py-1">
            <Image src="/inBeat.svg" alt="inBeat" width={100} height={32} />
            <span className="text-xs text-muted-foreground">
              Creator Approval Portal v0.1
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator className="opacity-50" />
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
