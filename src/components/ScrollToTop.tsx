import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Disable browser scroll restoration so it doesn't fight us
if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
}

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // Safari fallback
  }, [pathname]);

  return null;
};
