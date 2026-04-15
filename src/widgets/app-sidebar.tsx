"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  BookOpen,
  ChevronRight,
  Clock8,
  Compass,
  History,
  LayoutDashboard,
  PauseIcon,
  PlayIcon,
  XIcon,
} from "lucide-react";

import { useLiveQuery } from "dexie-react-hooks";

import { useAuth } from "~/features/auth/context-provider";

import useInterval from "~/shared/hooks/use-interval";
import { indexedDB } from "~/shared/lib/api/dexie";
import { PlayerState } from "~/shared/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
import { Button } from "~/shared/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/shared/ui/collapsible";
import { HeartListIcon, LogoutIcon, RefreshIcon } from "~/shared/ui/icons";
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
import { Skeleton } from "~/shared/ui/skeleton";
import { cn } from "~/shared/utils/tailwind-merge";

import AuthButton from "./auth-buttons";
import Feedback from "./feedback";
import { UserSettings } from "./user-settings";
import useActivePlayerRef from "./youtube/use-active-player";

export default function AppSidebar() {
  const { user, logout } = useAuth();

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <UserGroup />
        <ExploreGroup />
        <Separator />
        <LocalGroup />
        <PlayerStatus />
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
              <p className="tracking-wide">Logout</p>
            </Button>
          ) : null}
          <UserSettings />
          <Feedback />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function PlayerStatus() {
  const [playingStatus, setPlayingStatus] = useState<YT.PlayerState>();
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const playerRef = useActivePlayerRef();
  const title = playerRef?.getVideoData().title;

  function renderControls(status: YT.PlayerState | undefined) {
    switch (status) {
      case PlayerState.PLAYING:
        return (
          <Button
            className="flex items-center gap-2"
            onClick={() => playerRef?.pauseVideo()}
          >
            <PauseIcon size={24} />
            Pause
          </Button>
        );

      case PlayerState.PAUSED:
        return (
          <Button
            className="flex items-center gap-2"
            onClick={() => playerRef?.playVideo()}
          >
            <PlayIcon size={24} />
            Resume
          </Button>
        );

      case PlayerState.ENDED:
        return (
          <Button
            className="flex items-center gap-2"
            onClick={() => playerRef?.playVideo()}
          >
            <RefreshIcon size={24} />
            Start Over
          </Button>
        );

      default:
        return <Skeleton className="h-9 w-12" />;
    }
  }

  useEffect(() => {
    if (playerRef) {
      const status = playerRef?.getPlayerState();
      setPlayingStatus(status);
      setShowMiniPlayer(true);
    }
  }, [playerRef]);

  useInterval(() => {
    const status = playerRef?.getPlayerState();
    setPlayingStatus(status);
  }, 1_000);

  if (!showMiniPlayer) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="relative">
        <Button
          className="absolute top-0.5 right-0.5 hover:bg-transparent"
          onClick={() => setShowMiniPlayer(false)}
          size="icon"
          variant="ghost"
        >
          <XIcon />
        </Button>
        <div className="bg-primary/40 flex h-max flex-col gap-3 rounded-md p-2">
          <div className="flex grow justify-start">
            {renderControls(playingStatus)}
          </div>
          <p className="line-clamp-2">{title}</p>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function LocalGroup() {
  const { setOpenMobile } = useSidebar();
  const favoriteCatalogs =
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
              <HeartListIcon className="mr-2 h-4 w-4" />
              <p className="tracking-wide">Favorite Catalogs</p>
            </div>
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="max-h-50 min-h-auto overflow-y-auto">
                {favoriteCatalogs.map((item) => (
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

function UserGroup() {
  const { user } = useAuth();

  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isDashboardActive = pathname.includes("dashboard");

  if (!user) {
    return (
      <SidebarHeader className="h-14 justify-center border-b px-4">
        <AuthButton />
      </SidebarHeader>
    );
  }
  return (
    <>
      <SidebarHeader className="h-14 justify-center border-b px-4">
        <div className="flex items-center gap-2">
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
                  "data-[active=true]:bg-primary/20 dark:data-[active=true]:text-white",
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
                    <p className="tracking-wide">Dashboard</p>
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
                    "data-[active=true]:bg-primary/20 dark:data-[active=true]:text-white",
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