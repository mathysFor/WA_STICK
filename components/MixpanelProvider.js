"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { initMixpanel, trackPageView, isInitialized } from "@/lib/mixpanel";

export default function MixpanelProvider({ children }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Initialiser Mixpanel au montage
  useEffect(() => {
    initMixpanel();
  }, []);

  // Tracker les changements de page
  useEffect(() => {
    if (!isInitialized()) return;

    // Track la page view (inclut le premier render)
    const referrer = isFirstRender.current ? document.referrer : "";
    trackPageView(pathname, referrer);
    
    isFirstRender.current = false;
  }, [pathname]);

  return <>{children}</>;
}

