import { useCallback, useEffect, useState } from "react";

export function useScrollTrigger() {
  const [isHidden, setIsHidden] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);
  const threshold = 200; // Threshold for hiding header - adjust it accordingly

  const handleScroll = useCallback(() => {
    const currentScroll = window.scrollY;

    if (currentScroll > prevScroll && currentScroll > threshold) {
      setIsHidden(true);
    } else if (currentScroll < prevScroll) {
      setIsHidden(false);
    }

    setPrevScroll(currentScroll);
  }, [prevScroll]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount to prevent any memory leak
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return isHidden;
}
