import { useSanityQuery } from "@/hooks/useSanityData";

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
  const { data } = useSanityQuery<any>('logo-bar', `*[_type == "logoBar"][0]`);
  const logos = data?.logos || defaultLogos;

  return (
    <section className="py-10 border-y border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

          {/* Scrolling Container */}
          <div className="flex animate-scroll">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-8 flex items-center justify-center"
              >
                <span className="text-muted-foreground/60 font-semibold text-sm tracking-wide uppercase whitespace-nowrap">
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
