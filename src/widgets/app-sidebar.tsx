"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  BookOpen,
  ChevronRight,
  Clock8,
  HeartIcon,
  History,
  HomeIcon,
  LogOutIcon,
} from "lucide-react";

import { useLiveQuery } from "dexie-react-hooks";

import { useAuth } from "~/features/auth/context-provider";

import { indexedDB } from "~/shared/lib/api/dexie";
import { Button } from "~/shared/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/shared/ui/collapsible";
import { Separator } from "~/shared/ui/separator";
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
} from "~/shared/ui/sidebar";
import { cn } from "~/shared/utils/tailwind-merge";

import Feedback from "./feedback";
import ThemeToggle from "./theme-toggle";
import { UserSettings } from "./user-settings";

export default function AppSidebar() {
  const { user, logout } = useAuth();

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
                "flex flex-col gap-1",
                "w-full justify-start px-2 h-auto items-start",
                "hover:bg-primary/5 hover:text-primary/80"
              )}
            >
              <div className="flex gap-2">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <p className="tracking-wide">Logout</p>
              </div>
              <p className="text-muted-foreground text-xs">
                {user?.displayName}
              </p>
            </Button>
          ) : null}
          <ThemeToggle />
          <UserSettings />
          <Feedback />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function LocalGroup() {
  const { setOpenMobile } = useSidebar();
  const favoriteFeeds =
    useLiveQuery(() => indexedDB["favorites"].toArray(), []) ?? [];

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel
          asChild
          className={cn("group/label text-sm", "w-full justify-start px-2")}
        >
          <CollapsibleTrigger
            className={cn(
              "group-data-[state=open]/collapsible:bg-primary/20 dark:group-data-[state=open]/collapsible:text-white"
            )}
          >
            <div className="flex items-center gap-2 text-[#18181B] dark:text-white">
              <HeartIcon className="mr-2 h-4 w-4" />
              <p className="tracking-wide">Favorite Feeds</p>
            </div>
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="max-h-50 min-h-auto overflow-y-auto">
                {favoriteFeeds.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          onClick={() => setOpenMobile(false)}
                          className={cn(
                            "px-0",
                            "data-[active=true]:bg-primary/20 dark:data-[active=true]:text-white",
                            "data-[state=open]:hover:bg-transparent",
                            "hover:bg-transparent"
                          )}
                          asChild
                        >
                          <Link href={`/c/${item.id}`}>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start px-2",
                                "hover:bg-primary/5 hover:text-primary/80"
                              )}
                            >
                              <p className="tracking-wide">{item.title}</p>
                            </Button>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                ))}
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

import { AvatarFallback, AvatarImage, Avatar } from "~/shared/ui/avatar";

import AuthButton from "./auth-buttons";

function UserGroup() {
  const { user } = useAuth();
  return (
    <>
      <SidebarHeader className="h-14 justify-center border-b px-4">
        {user ? (
          <Link href={"/dashboard"}>
            <Button
              variant="outline"
              className="flex w-auto items-center gap-1 rounded-md border border-l-0 p-0 pr-2"
            >
              <Avatar className="size-full w-auto rounded-md">
                <AvatarImage
                  src={
                    user?.photoURL ||
                    `https://ui-avatars.com/api/?name=${user?.displayName}&background=random&size=96`
                  }
                  alt={user?.displayName || ""}
                />
                <AvatarFallback>{user?.displayName || ""}</AvatarFallback>
              </Avatar>
              <p>Dashboard</p>
            </Button>
          </Link>
        ) : (
          <AuthButton />
        )}
      </SidebarHeader>
    </>
  );
}

function ExploreGroup() {
  const { setOpenMobile } = useSidebar();
  const existingVideos =
    useLiveQuery(() => indexedDB["watch-later"].toArray()) ?? [];

  const exploreItems = [
    {
      icon: BookOpen,
      label: "Feeds",
      path: "/explore/feeds",
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
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenMobile(false)}
              className={cn(
                "px-0",
                "data-[active=true]:bg-primary/20 dark:data-[active=true]:text-white",
                "data-[state=open]:hover:bg-transparent",
                "hover:bg-transparent"
              )}
              asChild
            >
              <Link className="hover-shift" href={"/"}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start px-2",
                    "hover:bg-primary/5 hover:text-primary/80"
                  )}
                >
                  <HomeIcon className="mr-2 h-4 w-4" />
                  <p className="tracking-wide">Home</p>
                </Button>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {exploreItems.map((item) => {
            const isActive =
              pathname === item.path || pathname.includes(item.shortPath);
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  onClick={() => setOpenMobile(false)}
                  className={cn(
                    "px-0",
                    "data-[active=true]:bg-primary/20 dark:data-[active=true]:text-white",
                    "data-[state=open]:hover:bg-transparent",
                    "hover:bg-transparent"
                  )}
                  asChild
                  isActive={isActive}
                >
                  <Link className="hover-shift" href={item.path}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-2",
                        "hover:bg-primary/5 hover:text-primary/80"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <p className="tracking-wide">{item.label}</p>
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