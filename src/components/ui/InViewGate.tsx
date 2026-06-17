import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "framer-motion";

/**
 * Renders `children` only while the gate is on (or near) the viewport, and
 * unmounts them once it scrolls away. Heavy WebGL canvases otherwise keep a
 * GPU context and render loop alive for the whole page lifetime; mounting them
 * only when visible keeps at most one or two contexts active at a time.
 *
 * `fallback` shows in their place when offscreen (default: nothing). `margin`
 * expands the trigger area so the canvas is ready just before it scrolls in.
 */
export const InViewGate = ({
  children,
  fallback = null,
  className,
  style,
  margin = "300px",
  "aria-hidden": ariaHidden,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  style?: CSSProperties;
  margin?: string;
  "aria-hidden"?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: margin as `${number}px` });

  return (
    <div ref={ref} className={className} style={style} aria-hidden={ariaHidden}>
      {inView ? children : fallback}
    </div>
  );
};

export default InViewGate;
