import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { sectionId } from "../data/academic";

/** Query parameters keep section links compatible with HashRouter and reloads. */
export function useReadingPosition() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const section = new URLSearchParams(search).get("apartado");
    if (!section) return;
    const frame = requestAnimationFrame(() => {
      const heading = document.getElementById(sectionId(section));
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, search]);
}
