"use client";

import { useEffect, useRef } from "react";

import { useSidebar } from "../ui/sidebar";

export default function useScreenWidth() {
  const documentWidth = useRef<number>(0);

  useEffect(() => {
    documentWidth.current = document.documentElement.clientWidth;
  }, []);

  const { isMobile, open, openMobile } = useSidebar();

  const sidebarWidth = 16 * 16; // 16rem

  if (open && !isMobile && !openMobile) {
    return documentWidth.current - sidebarWidth;
  }

  return documentWidth.current;
}
