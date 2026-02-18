import { Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks: Record<string, { label: string; to: string }[]> = {
  Company: [
    { label: "Careers", to: "/careers" },
    { label: "Contact", to: "/contact" },
    { label: "Pricing", to: "/pricing" },
  ],
  Legal: [
    { label: "Terms", to: "/tnc" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logos/logo-original.png"
                className="h-6 w-auto"
                alt="Helios Cloud Logo"
              />
            </div>
            <p className="text-sm text-white/80 mb-4">
              The fastest inference platform for generative AI.
            </p>
            <div className="flex gap-2">
              <a
                href="https://www.linkedin.com/company/helioscompute"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white/80 hover:text-primary transition-colors inline-flex items-center justify-center w-11 h-11"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground text-sm mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-sm text-white/80 text-center">
            © {new Date().getFullYear()} Helios Cloud, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
