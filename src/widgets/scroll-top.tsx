"use client";

import { ArrowUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/shared/ui/button";
import { cn } from "~/shared/utils/tailwind-merge";

const scrollToTop = () => {
  window.scrollTo({ behavior: "smooth", top: 0 });
};

export default function ScrollTop() {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Button
      className={cn(
        "fixed bottom-12 right-6 p-2 shadow-lg transition-opacity duration-200",
        showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      size="icon"
      onClick={scrollToTop}
    >
      <ArrowUpIcon className="w-5 h-5" />
      <span className="sr-only">Scroll to top</span>
    </Button>
  );
}
