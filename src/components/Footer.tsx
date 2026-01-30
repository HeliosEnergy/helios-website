import { Github, Twitter, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Platform: ["Inference", "Fine-tuning", "Evaluation", "Deployment"],
  Models: ["LLMs", "Image", "Audio", "Embeddings"],
  Developers: ["Documentation", "API Reference", "Quickstart", "Pricing"],
  Company: ["About", /* "Blog", */ "Careers", "Contact"], // Blog hidden until content is ready
  Legal: ["Privacy", "Terms", "Security"],
};

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
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
                href="#"
                aria-label="Twitter"
                className="text-white/80 hover:text-primary transition-colors inline-flex items-center justify-center w-11 h-11"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="text-white/80 hover:text-primary transition-colors inline-flex items-center justify-center w-11 h-11"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-white/80 hover:text-primary transition-colors inline-flex items-center justify-center w-11 h-11"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-white/80 hover:text-primary transition-colors inline-flex items-center justify-center w-11 h-11"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground text-sm mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => {
                  const internalRoutes: Record<string, string> = {
                    "Pricing": "/pricing",
                    // "Blog": "/blog", // HIDDEN
                    "Careers": "/careers",
                    "Contact": "/contact",
                    "Terms": "/tnc",
                  };

                  const to = internalRoutes[link];

                  return (
                    <li key={link}>
                      {to ? (
                        <Link
                          to={to}
                          className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                          {link}
                        </Link>
                      ) : (
                        <a
                          href="#"
                          className="text-sm text-white/50 hover:text-white transition-colors"
                        >
                          {link}
                        </a>
                      )}
                    </li>
                  );
                })}
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
