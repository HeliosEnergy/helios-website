import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Decides whether this device should run the decorative WebGL shaders.
 *
 * Several animated WebGL canvases at once saturate weak / integrated GPUs and
 * can crash the tab, so we only opt in when the device looks capable: a real
 * desktop-width viewport, motion allowed, enough memory, and WebGL2 present.
 * Everywhere else, callers fall back to the static gradients / images.
 */

let webgl2Cache: boolean | undefined;
function hasWebgl2(): boolean {
  if (webgl2Cache !== undefined) return webgl2Cache;
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    webgl2Cache = !!gl;
    // Don't keep the probe context alive — free it immediately.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webgl2Cache = false;
  }
  return webgl2Cache;
}

function evaluate(): boolean {
  if (typeof window === "undefined") return false;
  const bigEnough = window.innerWidth >= MOBILE_BREAKPOINT;
  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // deviceMemory is Chromium-only; when absent, assume capable.
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const memOk = typeof mem !== "number" || mem > 4;
  return bigEnough && motionOk && memOk && hasWebgl2();
}

export function useHeavyGfx(): boolean {
  const [allowed, setAllowed] = useState<boolean>(evaluate);

  useEffect(() => {
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const recompute = () => setAllowed(evaluate());
    recompute();
    reduceMQ.addEventListener("change", recompute);
    window.addEventListener("resize", recompute);
    return () => {
      reduceMQ.removeEventListener("change", recompute);
      window.removeEventListener("resize", recompute);
    };
  }, []);

  return allowed;
}
