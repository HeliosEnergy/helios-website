import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { PlatformDropdown } from "./nav/PlatformDropdown";
import { ModelsDropdown } from "./nav/ModelsDropdown";
import { DevelopersDropdown } from "./nav/DevelopersDropdown";
import { PartnersDropdown } from "./nav/PartnersDropdown";
import { ResourcesDropdown } from "./nav/ResourcesDropdown";

const navItems = [
  { label: "Platform", hasDropdown: true, dropdown: PlatformDropdown },
  { label: "Models", hasDropdown: true, dropdown: ModelsDropdown },
  { label: "Developers", hasDropdown: true, dropdown: DevelopersDropdown },
  { label: "Pricing", hasDropdown: false },
  { label: "Partners", hasDropdown: true, dropdown: PartnersDropdown },
  { label: "Resources", hasDropdown: true, dropdown: ResourcesDropdown },
  { label: "Company", hasDropdown: true },
];

export const Navbar = () => {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={theme === 'dark' ? '/logos/logo-inverted.png' : '/logos/logo.png'}
              className="w-6 h-6"
              alt="Helios AI Logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" ref={navRef}>
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
                    openDropdown === item.label 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    openDropdown === item.label 
                      ? <ChevronUp className="w-4 h-4" />
                      : <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                
                {/* Dropdown */}
                {item.hasDropdown && item.dropdown && openDropdown === item.label && (
                  <div 
                    className="absolute top-full left-0 pt-2 z-50"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="shadow-xl animate-fade-in">
                      <item.dropdown />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono uppercase tracking-wider">
              Log In
            </button>
            <Button variant="nav" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className="flex items-center justify-between px-2 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </button>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="ghost" className="justify-start font-mono uppercase tracking-wider text-xs">
                  Log In
                </Button>
                <Button variant="nav">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
