import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const ColocationBanner = () => (
  <section
    aria-labelledby="gpu-colocation-heading"
    className="relative isolate overflow-hidden rounded-xl bg-[#111214] px-6 py-9 text-white sm:px-10 sm:py-11 lg:px-12"
  >
    <div className="pointer-events-none absolute inset-y-0 right-0 w-[34%] min-w-[200px] overflow-hidden sm:w-[46%] sm:min-w-[280px]" aria-hidden="true">
      <div className="colo-orbit colo-orbit--outer absolute right-[-180px] top-1/2 h-[390px] w-[390px] -translate-y-1/2 opacity-20 sm:right-[-112px] sm:opacity-35" />
      <div className="colo-orbit colo-orbit--inner absolute right-[-110px] top-1/2 h-[250px] w-[250px] -translate-y-1/2 opacity-15 sm:right-[-42px] sm:opacity-30" />
    </div>

    <div className="relative max-w-2xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF8F5A]">
        GPU colocation
      </p>
      <h2
        id="gpu-colocation-heading"
        className="mt-4 max-w-xl text-3xl font-bold tracking-[-0.03em] text-balance sm:text-4xl"
      >
        Already own the hardware?
      </h2>
      <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-white/75 text-pretty">
        Bring your GPU servers. Helios provides high-density power, air or liquid cooling,
        network connectivity, security and on-site operations.
      </p>
      <Link
        to="/colocation#calculator"
        className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#FF8F5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8F5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111214] active:translate-y-px"
      >
        Estimate colocation cost
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  </section>
);
