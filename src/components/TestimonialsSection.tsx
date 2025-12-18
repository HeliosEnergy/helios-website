import { useState, useEffect } from "react";

const testimonials = [
  {
    quote: "Fireworks has been a fantastic partner in building AI dev tools at Sourcegraph. Their fast, reliable model inference lets us focus on fine-tuning, AI-powered code search, and deep code context, making Cody the best AI coding assistant.",
    author: "Beyang Liu",
    role: "CTO at Sourcegraph",
    company: "Sourcegraph",
  },
  {
    quote: "By partnering with Fireworks to fine-tune models, we reduced latency from about 2 seconds to 350 milliseconds, significantly improving performance and enabling us to launch AI features at scale.",
    author: "Sarah Sachs",
    role: "AI Lead at Notion",
    company: "Notion",
  },
  {
    quote: "Fireworks has been an amazing partner getting our Fast Apply and Copilot++ models running performantly. They exceeded other competitors we reviewed on performance.",
    author: "Sualeh Asif",
    role: "CPO at Cursor",
    company: "Cursor",
  },
  {
    quote: "We've had a really great experience working with Fireworks to host open source models. After migrating one of our models, we noticed a 3x speedup in response time.",
    author: "Spencer Chan",
    role: "Product Lead at Quora",
    company: "Quora",
  },
];

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            Customer Love
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
            What our customers are saying
          </h2>
        </div>

        {/* Testimonial */}
        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[200px]">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${
                  i === activeIndex ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
              >
                <div className="text-center">
                  <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-violet-light flex items-center justify-center text-white font-semibold">
                      {testimonial.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.author}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
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
