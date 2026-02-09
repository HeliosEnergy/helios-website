import { Link } from "react-router-dom";

export const CompanyDropdownMobile = () => {
  return (
    <div className="space-y-4 py-4">
      <h4 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.3em] px-4">
        Helios Energy
      </h4>
      <div className="space-y-1 px-4">
        {[
          { label: "About Us", to: "#" },
          { label: "Careers", to: "/careers" },
          { label: "Events", to: "/events" },
          { label: "Newsroom", to: "/press" },
          { label: "Contact", to: "/contact" }
        ].map((item) => (
          <Link key={item.label} to={item.to} className="block py-2 text-xs text-white/60 hover:text-white transition-colors">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
