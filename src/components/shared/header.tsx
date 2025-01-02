"use client";

import Image from "next/image";
import Link from "next/link";

import { useScrollTrigger } from "~/hooks/use-scroll-trigger";

import AppIcon from "../../../public/icon.png";
import { useAuth } from "../../app/auth/context-provider";
import { Button } from "../shadcn/button";
import { SidebarTrigger } from "../shadcn/sidebar";
import Feedback from "./feedback";
import { GitHubStargazer } from "./github-stargazers";
import { LogoutIcon } from "./icons";
import JustTip from "./just-the-tip";
import ThemeToggle from "./theme-toggle";

const Header = () => {
  const { user, logout } = useAuth();
  const isHidden = useScrollTrigger();

  return (
    <header
      className={`h-14 sticky z-50 top-0 w-full border-b border-border/40 self-start flex justify-between items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border transition-transform duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
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
              <Image src={AppIcon} alt="YTCatalog" className="size-7" />
              <p className="self-end text-lg tracking-wide dark:text-white/80 dark:hover:text-white text-primary/80 hover:text-primary">
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
