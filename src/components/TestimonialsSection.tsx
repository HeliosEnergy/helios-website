import { useState, useEffect } from "react";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: section, isLoading } = useSanityQuery<any>('testimonials-section', QUERIES.testimonialsSection);

  useEffect(() => {
    if (!section?.testimonials?.length) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % section.testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [section?.testimonials]);

  if (isLoading || !section?.testimonials?.length) return null;

  return (
    <section className="py-20 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            {section.sectionLabel}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-foreground">
            {section.heading}
          </h2>
        </div>

        {/* Testimonial */}
        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[200px]">
            {section.testimonials.map((testimonial: any, i: number) => (
              <div
                key={i}
                className={`transition-all duration-500 ${i === activeIndex ? "opacity-100" : "opacity-0 absolute inset-0"
                  }`}
              >
                <div className="text-center">
                  <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-yellow-light flex items-center justify-center text-primary-foreground font-semibold">
                      {testimonial.author.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.author}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {section.testimonials.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex
                    ? "bg-primary w-6"
                    : "bg-border hover:bg-muted-foreground"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
