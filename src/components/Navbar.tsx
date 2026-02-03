import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PlatformDropdown } from "./nav/PlatformDropdown";
import { ModelsDropdown } from "./nav/ModelsDropdown";
import { PartnersDropdown } from "./nav/PartnersDropdown";

const DASHBOARD_LOGIN_URL = "https://console.heliosenergy.io/";
const DASHBOARD_SIGNUP_URL = "https://console.heliosenergy.io/login?tab=signup";

const navItems = [
  { label: "Platform", hasDropdown: true, dropdown: PlatformDropdown },
  { label: "Models", hasDropdown: true, dropdown: ModelsDropdown },
  { label: "Pricing", hasDropdown: false, href: "/pricing" },
  { label: "Partners", hasDropdown: true, dropdown: PartnersDropdown },
];

export const Navbar = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string, index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(label);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setHoveredIndex(null);
    }, 150);
  };

  return (
    <nav
      className="hidden lg:block sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-500"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          
          {/* Logo - Original Branding */}
          <Link to="/" className="flex items-center relative z-[110]">
            <img
              src="/logos/logo-original.png"
              className="h-8 lg:h-10 w-auto"
              alt="Helios AI Logo"
            />
          </Link>

          {/* Desktop Navigation - Sliding Pill & Bold Typography */}
          <div className="hidden lg:flex items-center gap-1 relative">
            {navItems.map((item, index) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label, index)}
                onFocus={() => handleMouseEnter(item.label, index)}
              >
                {/* The Sliding Pill */}
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/[0.08] rounded-full z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="relative z-10">
                  {item.href ? (
                    <Link
                      to={item.href}
                      className={`flex items-center gap-2 px-5 py-2.5 text-[12px] font-mono uppercase tracking-[0.2em] font-semibold transition-colors duration-300 ${
                        openDropdown === item.label || hoveredIndex === index
                          ? "text-white"
                          : "text-white/70"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={openDropdown === item.label}
                      aria-controls={`nav-dropdown-${item.label.toLowerCase()}`}
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setOpenDropdown(openDropdown === item.label ? null : item.label);
                        }
                      }}
                      className={`flex items-center gap-2 px-5 py-2.5 text-[12px] font-mono uppercase tracking-[0.2em] font-semibold transition-colors duration-300 ${
                        openDropdown === item.label || hoveredIndex === index
                          ? "text-white"
                          : "text-white/70"
                      }`}
                    >
                      {item.label}
                      {item.hasDropdown && (
                        <ChevronDown className={`w-3.5 h-3.5 opacity-50 transition-transform duration-500 ${openDropdown === item.label ? 'rotate-180 opacity-100' : ''}`} />
                      )}
                    </button>
                  )}
                </div>
                
                {/* Dropdown Container */}
                <AnimatePresence>
                  {item.hasDropdown && item.dropdown && openDropdown === item.label && (
                    <div 
                      id={`nav-dropdown-${item.label.toLowerCase()}`}
                      className={`absolute top-full pt-4 z-50 ${
                        item.label === "Partners" || item.label === "Resources" ? "right-0" : "left-0"
                      }`}
                      onMouseEnter={() => handleMouseEnter(item.label, index)}
                    >
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(10px)" }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-[#0A0A0A] border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
                      >
                        <item.dropdown />
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-8 relative z-[110]">
            <a
              href={DASHBOARD_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-white/70 hover:text-white transition-colors font-mono uppercase tracking-[0.3em] font-bold"
            >
              Cloud login
            </a>
            <Button
              className="rounded-full bg-white text-black hover:bg-white/90 px-8 h-12 text-xs font-bold transition-transform hover:scale-105 duration-300"
              onClick={() =>
                window.open(DASHBOARD_SIGNUP_URL, "_blank", "noopener,noreferrer")
              }
            >
              Sign up
            </Button>
          </div>

        </div>
      </div>

    </nav>
  );
};
