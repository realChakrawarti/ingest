"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";

import { Button } from "~/shared/ui/button";
import { cn } from "~/shared/utils/tailwind-merge";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      aria-label="Toggle theme"
      variant="ghost"
      className={cn(
        "w-full justify-start px-2",
        "hover:bg-primary/5 hover:text-primary/80"
      )}
      onClick={() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
      }}
    >
      <Sun className="mr-2 size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute mr-2 size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <p className="tracking-wide">Toggle Theme</p>
    </Button>
  );
}
