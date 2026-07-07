import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EASE, fadeUp, sectionHeading } from "@/components/HomeRevampSections";
import { useSiteCapacityData } from "@/hooks/useSiteCapacityData";
import { STATUS_LEGEND, type Site } from "./sites";

const SiteMapScene = lazy(() => import("./SiteMapScene"));

/* ------------------------------------------------------------------ */
/* Site ledger — synced with the map markers                           */
/* ------------------------------------------------------------------ */

const Ledger = ({
  sites,
  variant,
  activeId,
  onActive,
}: {
  sites: Site[];
  variant: "home" | "colo";
  activeId: string | null;
  onActive: (id: string | null) => void;
}) => (
  <div className="mt-4 lg:mt-0 lg:absolute lg:left-0 lg:bottom-0 lg:w-[230px] border border-white/10 bg-black/75 lg:backdrop-blur-md divide-y divide-white/10">
    {sites.map((site, i) => {
      const active = activeId === site.id;
      return (
        <button
          key={site.id}
          type="button"
          onMouseEnter={() => onActive(site.id)}
          onMouseLeave={() => onActive(null)}
          onFocus={() => onActive(site.id)}
          onBlur={() => onActive(null)}
          className={`w-full grid grid-cols-[1.25rem_1fr_auto] items-center gap-1.5 px-3 py-1 text-left transition-colors duration-300 ${
            active ? "bg-white/[0.06]" : ""
          }`}
        >
          <span className="font-mono text-[10px] leading-none text-white/60">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="font-heading font-bold text-white text-[12px] leading-none tracking-tight">
            {site.name}
            <span className="ml-1.5 font-mono font-normal text-[9px] text-white/55">{site.abbr}</span>
          </span>
          <span className="font-mono text-[10px] leading-none text-white/70 w-[3.4rem] text-right tabular-nums">
            {site.mw.toLocaleString()} MW
          </span>
        </button>
      );
    })}
    <p className="px-3 py-1 font-mono text-[8px] leading-snug text-white/45">
      {STATUS_LEGEND}
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* Map panel — canvas + ledger                                         */
/* ------------------------------------------------------------------ */

export const FootprintMap = ({
  sites,
  variant,
}: {
  sites: Site[];
  variant: "home" | "colo";
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Toggles as the map enters/leaves the viewport; drives the render loop.
  const inView = useInView(ref, { margin: "-120px" });
  // Mount the WebGL scene the first time it's seen, then keep it (paused when
  // off-screen) so the intro plays once rather than replaying on each scroll.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (inView) setMounted(true);
  }, [inView]);

  return (
    <div ref={ref} className="relative">
      <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[975/540]">
        <Suspense fallback={null}>
          {mounted && (
            <SiteMapScene
              sites={sites}
              variant={variant}
              activeId={activeId}
              onActive={setActiveId}
              play={inView}
              reduced={!!reduced}
            />
          )}
        </Suspense>
      </div>
      <Ledger sites={sites} variant={variant} activeId={activeId} onActive={setActiveId} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Homepage section                                                    */
/* ------------------------------------------------------------------ */

export const HomeFootprintSection = () => {
  const { sites } = useSiteCapacityData();
  const totalSites = sites.reduce((sum, site) => sum + site.siteCount, 0);
  const stateCount = sites.length;

  return (
    <section className="bg-black py-20 lg:py-28 px-4 lg:px-6 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-end">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, ease: EASE }}
            className="lg:col-span-7"
          >
            <h2 className={sectionHeading}>Where the megawatts live.</h2>
          </motion.div>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="lg:col-span-5 text-lg lg:text-xl text-white/70 font-light leading-relaxed lg:pb-2"
          >
            Helios builds where clean power is abundant and interconnection is
            fast. {totalSites.toLocaleString()} sites across {stateCount} states today — water-free,
            renewable-backed, Blackwell-ready.
          </motion.p>
        </div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="mt-10 lg:mt-14"
        >
          <FootprintMap sites={sites} variant="home" />
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-10 lg:mt-12 flex justify-end"
        >
          <Link
            to="/colocation"
            className="inline-flex items-center gap-3 text-white font-mono uppercase tracking-widest text-xs border-b border-white/30 hover:border-primary hover:text-primary pb-2 transition-colors group"
          >
            Explore colocation sites
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Colocation page map                                                 */
/* ------------------------------------------------------------------ */

export const ColoFootprintMap = () => {
  const { sites } = useSiteCapacityData();
  return <FootprintMap sites={sites} variant="colo" />;
};
