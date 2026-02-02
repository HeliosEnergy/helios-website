import { Cloud, Users, Settings, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const PartnersDropdown = () => {
  return (
    <div className="flex gap-0 p-0 min-w-[1000px] bg-transparent">
      {/* Strategic Alliances */}
      <div className="flex-1 p-12 space-y-10">
        <div>
          <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-6">
            Alliances
          </h3>
          <p className="text-xl text-white/60 leading-relaxed font-light">
            An ecosystem <br />of power.
          </p>
        </div>
        
        <div className="space-y-6">
          {[
            { icon: Cloud, label: "Cloud & Infrastructure", page: "cloud-infrastructure" },
            { icon: Users, label: "Consulting & Services", page: "consulting-services" },
            { icon: Settings, label: "Technology Partners", page: "technology-partners" },
          ].map((item) => (
            <Link key={item.label} to={`/coming-soon?page=${item.page}`} className="flex items-center justify-between py-4 border-b border-white/5 text-sm text-white hover:text-white transition-all group">
              <div className="flex items-center gap-4">
                <item.icon className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                {item.label}
              </div>
              <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Startups Program */}
      <div className="flex-1 p-12 bg-white/[0.02] space-y-10">
        <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-8">
          Accelerate
        </h3>
        <div className="space-y-6">
          <div className="p-8 rounded-[24px] bg-white/5 border border-white/5 space-y-4">
            <h4 className="text-lg font-heading font-bold text-white">Helios for Startups</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Exclusive credits, technical support, and architectural guidance for the next generation of AI pioneers.
            </p>
          </div>
          <Link to="/startups" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary hover:text-white transition-colors ml-2">
            Apply for the program <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* The Call to Action */}
      <div className="flex-1 p-12 bg-[#111111] flex flex-col justify-between">
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#FF6B35]">Collaboration</span>
            <h4 className="text-3xl font-heading font-bold tracking-tighter text-white">Build with <br />Helios.</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Join our network of strategic vendors and help shape the future of distributed intelligence.
            </p>
          </div>
        </div>
        
        <Link
          to="/coming-soon?page=become-partner"
          className="mt-12 block w-full py-4 bg-white text-black text-center text-[10px] font-mono font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white/90 transition-all hover:scale-[1.02]"
        >
          Become a Partner
        </Link>
      </div>
    </div>
  );
};