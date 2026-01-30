import { useSanityQuery } from "@/hooks/useSanityData";
import type { LogoBar as LogoBarData } from "@/types/sanity";

const defaultLogos = [
  "Uber",
  "DoorDash",
  "Notion",
  "GitLab",
  "Upwork",
  "HubSpot",
  "Cursor",
  "Samsung",
  "Verizon",
  "Quora",
];

export const LogoBar = () => {
  const { data } = useSanityQuery<LogoBarData>('logo-bar', `*[_type == "logoBar"][0]`);
  const logos = data?.logos || defaultLogos;

  return (
    <section className="py-16 border-y border-border/30 bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12">
          <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-white/70 border-b border-border/50 pb-1">
            Validated Infrastructure Partners
          </span>
          
          <div className="relative w-full overflow-hidden">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

            {/* Scrolling Container */}
            <div className="flex animate-scroll grayscale opacity-50 contrast-150">
              {[...logos, ...logos].map((logo, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-12 flex items-center justify-center group"
                >
                  <span className="text-foreground font-heading font-bold text-lg tracking-tighter transition-all duration-500 group-hover:opacity-100 group-hover:scale-110">
                    {logo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
