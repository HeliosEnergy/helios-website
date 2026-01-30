import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GrainGradient } from '@paper-design/shaders-react';

interface CaseStudy {
  id: number;
  company: string;
  logo: string;
  statLabel: string;
  statValue: string;
  quote: string;
  author: string;
  authorTitle: string;
  link: string;
  colorScheme: string[];
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    company: "Plex",
    logo: "plex",
    statLabel: "Plex Coffee reduces routine staff messages by 50%",
    statValue: "50%",
    quote: "ChatGPT cut our internal messages on certain issues by over half. Managers spend less time repeating the basics.",
    author: "Philipp Cheng",
    authorTitle: "Co-founder",
    link: "#",
    colorScheme: ["#FF6B9D", "#FF9F43", "#E8D5FF", "#FFFFFF"]
  },
  {
    id: 2,
    company: "TechFlow",
    logo: "techflow",
    statLabel: "TechFlow accelerates deployment by 75%",
    statValue: "75%",
    quote: "AI-powered automation transformed our CI/CD pipeline. What took hours now takes minutes.",
    author: "Sarah Chen",
    authorTitle: "CTO",
    link: "#",
    colorScheme: ["#FF7043", "#FF8FB1", "#B8F4D4", "#FFFFFF"]
  },
  {
    id: 3,
    company: "DataCore",
    logo: "datacore",
    statLabel: "DataCore scales infrastructure 10x faster",
    statValue: "10x",
    quote: "GPU scaling that just works. Our ML teams can focus on models, not infrastructure.",
    author: "Marcus Rodriguez",
    authorTitle: "Head of ML",
    link: "#",
    colorScheme: ["#FF6B6B", "#88E5E5", "#FFF5E6", "#FFB4A2"]
  },
  {
    id: 4,
    company: "Quantum Labs",
    logo: "quantum",
    statLabel: "Quantum Labs reduces compute costs by 60%",
    statValue: "60%",
    quote: "The most efficient GPU cloud we've used. Performance meets affordability.",
    author: "Dr. Emily Watson",
    authorTitle: "Research Director",
    link: "#",
    colorScheme: ["#DDA0FF", "#FFAA80", "#A8E6FF", "#FFFFFF"]
  }
];

export const CaseStudySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentStudy = caseStudies[currentIndex];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % caseStudies.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);
  };

  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 lg:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl sm:text-7xl font-heading font-bold text-white tracking-tightest leading-[0.85]">
            Trusted by companies
            <br />
            across the globe
          </h2>
        </div>

        {/* Main Card Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Full-width gradient background container */}
          <div className="relative rounded-[32px] overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-700 min-h-[520px]">
            {/* Full-width Gradient Background */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStudy.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <GrainGradient
                  width={1280}
                  height={720}
                  colors={currentStudy.colorScheme}
                  colorBack="#0e0d16"
                  softness={0.58}
                  intensity={0.08}
                  noise={0.5}
                  shape="blob"
                  speed={0.28}
                  scale={1.84}
                  offsetX={-0.24}
                  offsetY={0.08}
                />
              </motion.div>
            </AnimatePresence>

            {/* Content Grid: Card on left, Logo+Nav on right */}
            <div className="relative z-10 grid lg:grid-cols-5 gap-6 lg:gap-12 min-h-[520px] p-6 lg:p-12">
              {/* Left: Floating Testimonial Card (3/5ths) */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStudy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#0A0A0A]/95 backdrop-blur-sm rounded-[24px] p-10 lg:p-12 border border-white/5 h-full flex flex-col justify-center"
                  >
                    {/* Stat Label */}
                    <div className="mb-6">
                      <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/40">
                        {currentStudy.statLabel}
                      </span>
                    </div>

                    {/* Quote */}
                    <div className="space-y-6 mb-8">
                      {/* Quote Mark */}
                      <div className="text-white/20 text-6xl font-serif leading-none">"</div>

                      <p className="text-2xl sm:text-3xl text-white font-light leading-relaxed tracking-tight">
                        {currentStudy.quote}
                      </p>
                    </div>

                    {/* Author */}
                    <div className="space-y-1 mb-6">
                      <p className="text-base font-medium text-white">
                        {currentStudy.author}
                      </p>
                      <p className="text-sm text-white/50">
                        {currentStudy.authorTitle}
                      </p>
                    </div>

                    {/* Read More Link */}
                    <a
                      href={currentStudy.link}
                      className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
                    >
                      <span className="font-mono uppercase tracking-[0.2em]">Read more</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </a>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right: Company Logo + Navigation on Gradient (2/5ths) */}
              <div className="lg:col-span-2 flex flex-col items-center justify-between">
                {/* Company Logo */}
                <div className="flex-1 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStudy.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.5 }}
                      className="text-white/90 text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-center"
                    >
                      {currentStudy.company}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Arrows - Bottom */}
                <div className="flex items-center gap-3 pb-4">
                  <button
                    onClick={goToPrevious}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black text-white border border-white/10 hover:border-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Previous case study"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black text-white border border-white/10 hover:border-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Next case study"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
