import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

/**
 * The site's primary call-to-action: a quiet pill with a circular arrow chip.
 *
 * Interaction (hover / focus / tap): the arrow chip glides from the leading
 * edge across to the trailing edge — the label slides the opposite way to make
 * room — then settles, while the whole pill lifts a hair. One continuous,
 * spring-eased motion. Honors prefers-reduced-motion (snaps, no travel).
 */

type Tone = "dark" | "light";
type Accent = "primary" | "emerald";

const palette: Record<`${Tone}-${Accent}`, { pill: string; chip: string }> = {
  "dark-primary": {
    pill: "border-white/15 bg-white/5 text-white group-hover:border-primary/40 group-focus-visible:border-primary/40",
    chip: "bg-white text-black group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:bg-primary group-focus-visible:text-primary-foreground",
  },
  "dark-emerald": {
    pill: "border-white/15 bg-white/5 text-white group-hover:border-emerald-400/50 group-focus-visible:border-emerald-400/50",
    chip: "bg-white text-black group-hover:bg-emerald-400 group-hover:text-black group-focus-visible:bg-emerald-400 group-focus-visible:text-black",
  },
  "light-primary": {
    pill: "border-black/15 bg-white/60 text-[#15171A] group-hover:border-primary/40 group-focus-visible:border-primary/40",
    chip: "bg-[#15171A] text-white group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:bg-primary group-focus-visible:text-primary-foreground",
  },
  "light-emerald": {
    pill: "border-black/15 bg-white/60 text-[#15171A] group-hover:border-emerald-600/50 group-focus-visible:border-emerald-600/50",
    chip: "bg-[#15171A] text-white group-hover:bg-emerald-600 group-hover:text-white group-focus-visible:bg-emerald-600 group-focus-visible:text-white",
  },
};

export const ArrowCTA = ({
  to,
  children,
  tone = "dark",
  accent = "primary",
  className = "",
}: {
  to: string;
  children: string;
  tone?: Tone;
  accent?: Accent;
  className?: string;
}) => {
  const reduced = useReducedMotion();
  const [engaged, setEngaged] = useState(false);
  const c = palette[`${tone}-${accent}`];

  // The chip's travel and the label's reflow share one luxurious deceleration
  // curve (expo-out): quick to leave, then a long, smooth glide into place.
  const travel = reduced
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };
  // The pill's lift / press is its own crisp, tactile spring.
  const press = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 520, damping: 32, mass: 0.7 };

  return (
    <motion.span
      className={`inline-block ${className}`}
      whileHover={reduced ? undefined : { scale: 1.025 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      onHoverStart={() => setEngaged(true)}
      onHoverEnd={() => setEngaged(false)}
      onTapStart={() => setEngaged(true)}
      transition={press}
    >
      <Link
        to={to}
        className={`group relative inline-flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${c.pill}`}
      >
        <motion.span
          layout
          transition={travel}
          style={{ order: engaged ? 2 : 0 }}
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors duration-300 ${c.chip}`}
        >
          <motion.span
            layout="position"
            animate={{ x: engaged && !reduced ? 1.5 : 0 }}
            transition={travel}
            className="grid place-items-center"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.span>
        </motion.span>
        <motion.span
          layout
          transition={travel}
          style={{ order: 1 }}
          className="whitespace-nowrap px-1.5"
        >
          {children}
        </motion.span>
      </Link>
    </motion.span>
  );
};

export default ArrowCTA;
