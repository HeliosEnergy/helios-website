import { BookOpen, Newspaper, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const ResourcesDropdownMobile = () => {
  return (
    <div className="space-y-4 py-4">
      <h4 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.3em] px-4">
        Knowledge
      </h4>
      <div className="space-y-2 px-4">
        {[
          // { label: "Blog", href: "/blog", icon: Newspaper }, // HIDDEN - waiting for content
          { label: "Documentation", href: "#", icon: BookOpen },
          { label: "Demos", href: "#", icon: PlayCircle },
        ].map((item) => (
          <Link key={item.label} to={item.href} className="flex items-center gap-3 py-2 text-xs text-white/60 hover:text-white transition-colors">
            <item.icon className="w-4 h-4 opacity-30" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
