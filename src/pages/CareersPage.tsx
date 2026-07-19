import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { QUERIES, useSanityQuery } from "@/hooks/useSanityData";
import {
  FALLBACK_CAREER_ROLES,
  careerApplicationHref,
  generalCareerApplicationHref,
  type CareerRole,
} from "@/lib/careers";

interface SanityCareerRole {
  role?: string;
  title?: string;
  department?: string;
  team?: string;
  location?: string;
  summary?: string;
  description?: string;
}

interface CareersContent {
  openPositions?: SanityCareerRole[];
}

const normalizeRoles = (positions?: SanityCareerRole[]): CareerRole[] => {
  if (!positions?.length) return FALLBACK_CAREER_ROLES;

  return positions.map((position) => ({
    title: position.role || position.title || "Open role",
    team: position.department || position.team || "Helios",
    location: position.location || "Location flexible",
    summary:
      position.summary ||
      position.description ||
      "Help Helios deliver dependable, high-performance infrastructure for frontier workloads.",
  }));
};

const CareersPage = () => {
  const reduceMotion = useReducedMotion();
  const { data: careers, isLoading } = useSanityQuery<CareersContent | null>(
    "careers-page",
    QUERIES.careersPage,
  );
  const roles = normalizeRoles(careers?.openPositions);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090A] text-white">
        <Navigation />
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-24 lg:px-6">
          <div className="h-[420px] animate-pulse rounded-xl bg-white/[0.04]" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#08090A] text-white selection:bg-[#FF6B35] selection:text-black">
      <Navigation />

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-20 pt-24 lg:px-6 lg:pb-28">
          <div className="grid items-end gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF8F5A]">
                Careers at Helios
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[0.98] tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl">
                Build the infrastructure behind frontier AI.
              </h1>
              <p className="mt-7 max-w-[62ch] text-lg leading-relaxed text-white/70 text-pretty">
                Helios brings power, data centers and accelerated computing together. Join the
                people turning scarce infrastructure into dependable capacity.
              </p>
              <a
                href="#open-roles"
                className="mt-9 inline-flex min-h-11 items-center gap-3 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#FF8F5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8F5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A] active:translate-y-px"
              >
                View open roles
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </motion.div>

            <motion.figure
              initial={reduceMotion ? false : { opacity: 0, clipPath: "inset(8% 0 0 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-[#111214]"
            >
              <img
                src="/coloc/hall-interior-rack-corridor.png"
                alt="A corridor between high-density GPU racks inside a Helios modular data hall"
                className="aspect-[4/3] w-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </motion.figure>
          </div>
        </section>

        <section className="border-y border-white/10">
          <div className="mx-auto grid max-w-7xl gap-px bg-white/10 md:grid-cols-4">
            {["Power", "Facilities", "GPU systems", "Customer workloads"].map((stage, index) => (
              <div
                key={stage}
                className="flex min-h-24 items-center justify-between gap-4 bg-[#0B0C0D] px-5 py-6 lg:px-7"
              >
                <span className="text-base font-semibold text-white">{stage}</span>
                {index < 3 && <ArrowRight className="h-4 w-4 text-[#FF8F5A]" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </section>

        <section id="open-roles" className="scroll-mt-20 px-4 py-20 lg:px-6 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-bold tracking-[-0.03em] text-balance sm:text-5xl">
                Work on systems that have to work.
              </h2>
              <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-white/65 text-pretty">
                Build across software and physical infrastructure with clear ownership, direct
                customer context and a high bar for operational detail.
              </p>
            </div>

            <div className="mt-12 border-t border-white/15">
              {roles.map((role, index) => (
                <motion.article
                  key={`${role.title}-${role.location}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.05 }}
                  className="grid gap-6 border-b border-white/10 py-8 md:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)_auto] md:items-center lg:py-10"
                >
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.025em] text-white sm:text-3xl">
                      {role.title}
                    </h3>
                    <p className="mt-3 max-w-[58ch] leading-relaxed text-white/60">{role.summary}</p>
                  </div>
                  <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-1">
                    <div>
                      <dt className="text-white/40">Team</dt>
                      <dd className="mt-1 font-medium text-white/85">{role.team}</dd>
                    </div>
                    <div>
                      <dt className="text-white/40">Location</dt>
                      <dd className="mt-1 font-medium text-white/85">{role.location}</dd>
                    </div>
                  </dl>
                  <Link
                    to={careerApplicationHref(role)}
                    className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#FF8F5A] hover:text-[#FF8F5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8F5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A] active:translate-y-px"
                  >
                    View role
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 lg:px-6 lg:pb-32">
          <div className="mx-auto max-w-7xl rounded-xl border border-white/10 bg-white/[0.035] px-6 py-10 sm:px-10 lg:flex lg:items-end lg:justify-between lg:gap-12 lg:px-12 lg:py-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Don’t see your role?</h2>
              <p className="mt-4 max-w-[62ch] leading-relaxed text-white/65">
                We still want to hear from exceptional builders working across infrastructure,
                energy, systems and customer operations.
              </p>
            </div>
            <Link
              to={generalCareerApplicationHref}
              className="mt-7 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[#FF8F5A] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0D] active:translate-y-px lg:mt-0"
            >
              Introduce yourself
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CareersPage;
