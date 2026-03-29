"use client";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";

/**
 * PageTransition
 * ──────────────
 * Wraps every page in a fade+lift animation that re-fires on every
 * client-side navigation. We do this by keying off `pathname` so
 * React remounts this node on route change.
 *
 * Strategy:
 *  - On pathname change we briefly set `animating = true` which re-applies
 *    the CSS animation class, then immediately remove the flag so the class
 *    is stable for the rest of the page visit.
 *  - All animation is CSS-only (GPU composited opacity + transform).
 *  - `will-change` is set inline only during animation and cleared after
 *    to avoid keeping compositing layers alive unnecessarily.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState(0);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setKey((k) => k + 1);   // remount → re-trigger the CSS animation
    }
  }, [pathname]);

  return (
    <div key={key} className="page-transition-root">
      {children}
    </div>
  );
}
