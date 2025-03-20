"use client";

import Image from "next/image";
import Link from "next/link";

import { useScrollTrigger } from "~/shared/hooks/use-scroll-trigger";
import { cn } from "~/shared/lib/tailwind-merge";

import AppIcon from "../../public/icon.png";
import { useAuth } from "../features/auth/context-provider";
import { Button } from "../shared/ui/button";
import { LogoutIcon } from "../shared/ui/icons";
import { SidebarTrigger } from "../shared/ui/sidebar";
import Feedback from "./feedback";
import { GitHubStargazer } from "./github-stargazers";
import JustTip from "./just-the-tip";
import ThemeToggle from "./theme-toggle";

const Header = () => {
  const { user, logout } = useAuth();
  const isHidden = useScrollTrigger();

  const headerStyles = cn(
    "flex justify-between items-center self-start",
    "h-14 w-full sticky z-50 top-0 border-b border-border/40 ",
    "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border",
    "transition-transform duration-300",
    isHidden ? "-translate-y-full" : "translate-y-0"
  );

  return (
    <header className={headerStyles}>
      <div className="flex-1 flex justify-between items-center px-2 container mx-auto">
        <div className="flex gap-2 items-center">
          <SidebarTrigger className="h-8 w-8 mr-2">
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
          </SidebarTrigger>
          <Link href="/">
            <h1 className="flex gap-1">
              <Image src={AppIcon} alt="YTCatalog logo" className="size-7" />
              <p className="self-end text-lg tracking-wide dark:text-white/80 dark:hover:text-white text-primary/80 hover:text-primary" aria-hidden="true">
                YTCatalog
              </p>
            </h1>
          </Link>
        </div>
        <div className="flex gap-3 items-center">
          <GitHubStargazer owner="realChakrawarti" repo="yt-catalog" />
          <Feedback />
          {user ? (
            <JustTip label="Logout">
              <Button onClick={logout} variant="outline">
                <LogoutIcon size={24} />
              </Button>
            </JustTip>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
