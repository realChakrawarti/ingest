"use client";

import { useLiveQuery } from "dexie-react-hooks";
import {
  Archive,
  BookOpen,
  ChevronRight,
  Clock8,
  Compass,
  History,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useAuth } from "~/features/auth/context-provider";
import { indexedDB } from "~/shared/lib/api/dexie";
import { cn } from "~/shared/lib/tailwind-merge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/shared/ui/collapsible";
import { HeartListIcon, LogoutIcon } from "~/shared/ui/icons";
import { Separator } from "~/shared/ui/separator";
import NextUpdate from "~/views/public-catalog/next-update";

import { Avatar, AvatarFallback, AvatarImage } from "../shared/ui/avatar";
import { Button } from "../shared/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "../shared/ui/sidebar";
import AuthButton from "./auth-buttons";
import Feedback from "./feedback";

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const catalogId = pathname.includes("/c/") && pathname.split("/c/")[1];

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <UserGroup />
        <ExploreGroup />
        <Separator />
        <LocalGroup />
      </SidebarContent>
      <SidebarFooter className="px-0">
        <div className="px-2">
          {user ? (
            <Button
              variant="ghost"
              onClick={logout}
              className={cn(
                "w-full justify-start px-2",
                "hover:bg-primary/5 hover:text-primary/80"
              )}
            >
              <LogoutIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
          ) : null}
          <Feedback />
        </div>

        {catalogId ? <Separator /> : <></>}
        <div className="px-2">
          {catalogId ? <NextUpdate catalogId={catalogId} /> : <></>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function LocalGroup() {
  const { setOpenMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);

  const favoriteCatalogs =
    useLiveQuery(() => indexedDB["favorites"].toArray(), []) ?? [];

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <SidebarGroup>
        <SidebarGroupLabel
          asChild
          className={cn(
            "group/label text-sm",
            "w-full justify-start px-2",
            "hover:bg-primary/5 hover:text-primary/80"
          )}
        >
          <CollapsibleTrigger
            className={cn(
              "flex items-center gap-2 dark:text-white text-[#18181B]",
              "group-data-[state=open]/collapsible:bg-primary/20 group-data-[state=open]/collapsible:dark:text-white"
            )}
          >
            <HeartListIcon className="mr-2 h-4 w-4" />
            Favorite Catalogs
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {favoriteCatalogs.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton
                        onClick={() => setOpenMobile(false)}
                        className={cn(
                          "px-0",
                          "data-[active=true]:bg-primary/20 data-[active=true]:dark:text-white",
                          "data-[state=open]:hover:bg-transparent",
                          "hover:bg-transparent"
                        )}
                        asChild
                      >
                        <Link href={`/c/${item.id}`}>
                          <Button
                            onClick={() => setIsOpen(false)}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start px-2",
                              "hover:bg-primary/5 hover:text-primary/80"
                            )}
                          >
                            {item.title}
                          </Button>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

function UserGroup() {
  const { user } = useAuth();

  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isDashboardActive = pathname.includes("dashboard");

  if (!user) {
    return (
      <SidebarHeader className="border-b px-4 h-14 justify-center">
        <AuthButton />
      </SidebarHeader>
    );
  }
  return (
    <>
      <SidebarHeader className="border-b px-4 h-14 justify-center">
        <div className="flex gap-2 items-center">
          <Avatar className="size-8 rounded-lg">
            <AvatarImage
              src={
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${user?.displayName}&background=random&size=96`
              }
              alt={user?.displayName || ""}
            />
            <AvatarFallback>{user?.displayName || ""}</AvatarFallback>
          </Avatar>
          <p>{user?.displayName}</p>
        </div>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setOpenMobile(false)}
                className={cn(
                  "px-0",
                  "data-[active=true]:bg-primary/20 data-[active=true]:dark:text-white",
                  "data-[state=open]:hover:bg-transparent",
                  "hover:bg-transparent"
                )}
                asChild
                isActive={isDashboardActive}
              >
                <Link href={"/dashboard"}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start px-2",
                      "hover:bg-primary/5 hover:text-primary/80"
                    )}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </SidebarGroup>
    </>
  );
}

function ExploreGroup() {
  const { setOpenMobile } = useSidebar();
  const existingVideos =
    useLiveQuery(() => indexedDB["watch-later"].toArray()) ?? [];

  const exploreItems = [
    { icon: Compass, label: "Explore", path: "/explore", shortPath: "/e/" },
    {
      icon: BookOpen,
      label: "Catalogs",
      path: "/explore/catalogs",
      shortPath: "/c/",
    },
    {
      icon: Archive,
      label: "Archives",
      path: "/explore/archives",
      shortPath: "/a/",
    },
    {
      badge: existingVideos.length,
      icon: Clock8,
      label: "Watch later",
      path: "/explore/watch-later",
      shortPath: "watch-later",
    },
    {
      icon: History,
      label: "History",
      path: "/explore/history",
      shortPath: "history",
    },
  ];

  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {exploreItems.map((item) => {
            const isActive =
              pathname === item.path || pathname.includes(item.shortPath);
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  onClick={() => setOpenMobile(false)}
                  className={cn(
                    "px-0",
                    "data-[active=true]:bg-primary/20 data-[active=true]:dark:text-white",
                    "data-[state=open]:hover:bg-transparent",
                    "hover:bg-transparent"
                  )}
                  asChild
                  isActive={isActive}
                >
                  <Link href={item.path}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-2",
                        "hover:bg-primary/5 hover:text-primary/80"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                </SidebarMenuButton>
                {item.badge ? (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                ) : null}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
