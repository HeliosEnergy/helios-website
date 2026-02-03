import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Menu } from "lucide-react";
import { Button } from "./ui/button";

const DASHBOARD_LOGIN_URL = "https://console.heliosenergy.io/";
const DASHBOARD_SIGNUP_URL = "https://console.heliosenergy.io/login?tab=signup";

// Simplified nav items for mobile
const mobileNavItems = [
  { label: "Pricing", href: "/pricing" },
  { label: "Clusters", href: "/clusters" },
  { label: "Model Library", href: "/model-library" },
];

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="lg:hidden sticky top-0 z-50 bg-black border-b border-white/10">
      {/* Header bar - always visible */}
      <div className="flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center" onClick={closeMenu}>
          <img
            src="/logos/logo-original.png"
            className="h-7 w-auto"
            alt="Helios AI Logo"
          />
        </Link>

        {/* Hamburger button */}
        <button
          onClick={toggleMenu}
          className="p-2 text-white"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Dropdown menu - CSS-based visibility */}
      <div
        className={`
          absolute top-full left-0 right-0
          bg-black border-b border-white/10
          transition-all duration-300 ease-out
          ${isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2"
          }
        `}
      >
        <div className="px-4 py-4 space-y-1">
          {/* Navigation links */}
          {mobileNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={closeMenu}
              className="block py-3 px-4 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-lg font-medium"
            >
              {item.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="h-px bg-white/10 my-4" />

          {/* Auth buttons */}
          <div className="space-y-3 pt-2">
            <Button
              className="w-full rounded-full bg-white text-black hover:bg-white/90 h-12 text-sm font-bold"
              onClick={() => {
                window.open(DASHBOARD_SIGNUP_URL, "_blank", "noopener,noreferrer");
                closeMenu();
              }}
            >
              Sign up
            </Button>
            <a
              href={DASHBOARD_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="block text-center text-white/60 hover:text-white text-sm font-medium py-2 transition-colors"
            >
              Cloud login →
            </a>
          </div>
        </div>
      </div>

      {/* Backdrop overlay when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-[-1]"
          onClick={closeMenu}
        />
      )}
    </nav>
  );
};
