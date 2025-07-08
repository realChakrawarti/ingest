"use client";

import { useEffect, useRef, useState } from "react";

import { useSidebar } from "../ui/sidebar";

const sidebarWidth = 16 * 16; // 16rem

export default function useScreenWidth() {
  const documentRef = useRef<HTMLElement | null>(null);
  const [documentWidth, setDocumentWidth] = useState<number>(0);
  const { isMobile, open, openMobile } = useSidebar();

  useEffect(() => {
    documentRef.current = document.documentElement;
  }, []);

  useEffect(() => {
    const clientWidth = documentRef.current?.clientWidth;

    if (!clientWidth) return;

    if (open && !isMobile && !openMobile) {
      setDocumentWidth(clientWidth - sidebarWidth);
    } else {
      setDocumentWidth(clientWidth);
    }
  }, [isMobile, open, openMobile, documentRef.current]);

  return documentWidth;
}
