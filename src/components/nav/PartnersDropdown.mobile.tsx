import { Cloud, Users, Settings, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export const PartnersDropdownMobile = () => {
  return (
    <div className="space-y-4 py-4">
      <h4 className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] px-4">
        Alliances
      </h4>
      <div className="space-y-2 px-4">
        {[
          { icon: Cloud, label: "Cloud & Infrastructure", page: "cloud-infrastructure" },
          { icon: Users, label: "Consulting & Services", page: "consulting-services" },
          { icon: Settings, label: "Technology Partners", page: "technology-partners" },
        ].map((item) => (
          <Link key={item.label} to={`/coming-soon?page=${item.page}`} className="flex items-center gap-3 py-2 text-xs text-white/60 hover:text-white transition-colors">
            <item.icon className="w-4 h-4 opacity-30" />
            {item.label}
          </Link>
        ))}
      </div>

      <h4 className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] px-4 pt-4">
        Startups
      </h4>
      <div className="px-4">
        <Link to="/startups" className="flex items-center gap-3 py-2 text-xs text-[#FF6B35] hover:text-white transition-colors">
          <Rocket className="w-4 h-4" />
          Helios for Startups — $5K Credits
        </Link>
      </div>

      <Link to="/coming-soon?page=become-partner" className="block mx-4 mt-4 py-2 px-4 text-center text-xs font-mono font-bold text-black bg-white rounded-lg hover:bg-white/90 transition-colors">
        Become a Partner
      </Link>
    </div>
  );
};
