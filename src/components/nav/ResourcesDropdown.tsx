import { ArrowRight, BookOpen, Newspaper, PlayCircle, Book } from "lucide-react";
import { Link } from "react-router-dom";

export const ResourcesDropdown = () => {
  return (
    <div className="flex gap-0 p-0 min-w-[1100px] bg-transparent">
      {/* Learning Center */}
      <div className="flex-1 p-12 space-y-10">
        <div>
          <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-6">
            Knowledge
          </h3>
          <p className="text-xl text-white/60 leading-relaxed font-light">
            Insights from the <br />intelligence frontier.
          </p>
        </div>

        <div className="space-y-4">
          {[
            // { label: "Blog", href: "/blog", icon: Newspaper }, // HIDDEN - waiting for content
            { label: "Documentation", href: "#", icon: BookOpen },
            { label: "Demos", href: "#", icon: PlayCircle },
            { label: "Cookbooks", href: "#", icon: Book },
          ].map((item) => (
            <Link key={item.label} to={item.href} className="flex items-center justify-between py-4 border-b border-white/5 text-sm text-white hover:text-white transition-all group">
              <div className="flex items-center gap-4">
                <item.icon className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                {item.label}
              </div>
              <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Insights */}
      <div className="flex-[1.2] p-12 bg-white/[0.02] space-y-10">
        <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-8">
          Featured
        </h3>
        <div className="space-y-6">
          <a href="#" className="flex gap-6 p-6 rounded-[24px] bg-white/5 border border-white/5 hover:border-white/20 transition-all group">
            <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-[10px] text-white/70 font-mono text-center px-2">BENCH MARK</span>
            </div>
            <div className="space-y-2">
              <span className="text-[#FF6B35] font-mono text-[10px] uppercase tracking-widest">Research</span>
              <h4 className="text-base font-heading font-bold text-white leading-tight">
                Your AI Benchmark is Lying to You.
              </h4>
              <p className="text-xs text-white/70">Exposing the truth in performance metrics.</p>
            </div>
          </a>

          <a href="#" className="flex gap-6 p-6 rounded-[24px] bg-white/5 border border-white/5 hover:border-white/20 transition-all group">
            <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-[10px] text-white/70 font-mono text-center px-2">CLAUDE CODE</span>
            </div>
            <div className="space-y-2">
              <span className="text-[#FF6B35] font-mono text-[10px] uppercase tracking-widest">Tutorial</span>
              <h4 className="text-base font-heading font-bold text-white leading-tight">
                Eval-Driven Development with Claude.
              </h4>
              <p className="text-xs text-white/70">A new paradigm for reliable agents.</p>
            </div>
          </a>
        </div>
      </div>

      {/* Company - Folded In */}
      <div className="flex-1 p-12 bg-[#111111] flex flex-col justify-between">
        <div className="space-y-10">
          <div>
            <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-8">
              Helios Energy
            </h3>
            <div className="space-y-6">
              <div className="space-y-6">
                {[
                  { label: "About Us", href: "#" },
                  { label: "Careers", href: "/careers" },
                  { label: "Events", href: "/events" },
                  { label: "Newsroom", href: "/press" },
                  { label: "Contact", href: "/contact" }
                ].map(item => (
                  <Link key={item.label} to={item.href} className="block text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <p className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em] mb-4">Current Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-white/60">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};