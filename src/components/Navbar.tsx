import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PlatformDropdown } from "./nav/PlatformDropdown";
import { ModelsDropdown } from "./nav/ModelsDropdown";
import { DevelopersDropdown } from "./nav/DevelopersDropdown";
import { PartnersDropdown } from "./nav/PartnersDropdown";
import { ResourcesDropdown } from "./nav/ResourcesDropdown";
import { PlatformDropdownMobile } from "./nav/PlatformDropdown.mobile";
import { ModelsDropdownMobile } from "./nav/ModelsDropdown.mobile";
import { DevelopersDropdownMobile } from "./nav/DevelopersDropdown.mobile";
import { PartnersDropdownMobile } from "./nav/PartnersDropdown.mobile";
import { ResourcesDropdownMobile } from "./nav/ResourcesDropdown.mobile";
import { CompanyDropdownMobile } from "./nav/CompanyDropdown.mobile";

const DASHBOARD_LOGIN_URL = "https://console.heliosenergy.io/";
const DASHBOARD_SIGNUP_URL = "https://console.heliosenergy.io/login?tab=signup";

const navItems = [
  { label: "Platform", hasDropdown: true, dropdown: PlatformDropdown, dropdownMobile: PlatformDropdownMobile },
  { label: "Models", hasDropdown: true, dropdown: ModelsDropdown, dropdownMobile: ModelsDropdownMobile },
  { label: "Developers", hasDropdown: true, dropdown: DevelopersDropdown, dropdownMobile: DevelopersDropdownMobile },
  { label: "Pricing", hasDropdown: false, href: "/pricing" },
  { label: "Partners", hasDropdown: true, dropdown: PartnersDropdown, dropdownMobile: PartnersDropdownMobile },
  // TODO: Unhide Resources when we have blog/docs content
  // { label: "Resources", hasDropdown: true, dropdown: ResourcesDropdown, dropdownMobile: ResourcesDropdownMobile },
  // { label: "Company", hasDropdown: true, dropdownMobile: CompanyDropdownMobile },
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobileDropdown, setExpandedMobileDropdown] = useState<string | null>(null);
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

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <nav 
      className="sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-500"
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

          {/* Mobile Menu Trigger */}
          <button
            className="lg:hidden relative z-[110] p-2 text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <motion.span 
                animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-white block rounded-full"
              />
              <motion.span 
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-white block rounded-full"
              />
              <motion.span 
                animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-white block rounded-full"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Refined Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-black flex flex-col pt-32 pb-12 lg:hidden"
            id="mobile-nav"
          >
            <div className="flex-1 px-8 overflow-y-auto scrollbar-hide">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <div key={item.label} className="border-b border-white/[0.05]">
                    {item.href ? (
                      <Link
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-6 text-2xl font-heading font-bold tracking-tightest text-white"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <div className="py-2">
                        <button
                          onClick={() => setExpandedMobileDropdown(
                            expandedMobileDropdown === item.label ? null : item.label
                          )}
                          className="w-full flex items-center justify-between py-4 text-2xl font-heading font-bold tracking-tightest text-white"
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-6 h-6 opacity-50 transition-transform duration-300 ${
                              expandedMobileDropdown === item.label ? 'rotate-180 opacity-100' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedMobileDropdown === item.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden bg-white/[0.03] rounded-3xl mb-4"
                            >
                              <div className="p-4">
                                {item.dropdownMobile && <item.dropdownMobile />}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Footer Actions */}
            <div className="px-8 mt-auto pt-8 flex flex-col gap-4 border-t border-white/[0.05]">
              <Button
                className="rounded-full bg-white text-black h-16 text-lg font-bold w-full"
                onClick={() => {
                  window.open(DASHBOARD_SIGNUP_URL, "_blank", "noopener,noreferrer");
                  setMobileMenuOpen(false);
                }}
              >
                Sign up
              </Button>
              <a
                href={DASHBOARD_LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 font-mono text-xs uppercase tracking-[0.4em] py-4 font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cloud login
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
