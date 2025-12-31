import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import catalystIcon from "@/assets/catalyst-icon.png";

const footerLinks = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Services: [
    { label: "AI Prospecting", href: "/#services" },
    { label: "Ad Optimization", href: "/#services" },
    { label: "Automation", href: "/#services" },
    { label: "Analytics", href: "/#services" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "Case Studies", href: "/case-studies" },
  ],
};

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-16 md:py-20 bg-primary text-primary-foreground">
      <div className="container-narrow">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-0.5 font-display text-xl sm:text-2xl font-bold">
              <span>Catalyst</span>
              <span className="text-accent">AI</span>
              <img src={catalystIcon} alt="" className="h-6 sm:h-8 w-auto ml-1 brightness-0 invert" />
            </Link>
            <p className="text-primary-foreground/70 mt-3 sm:mt-4 max-w-sm text-sm sm:text-base">
              Building intelligent growth engines for modern businesses. AI-powered systems that scale.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{category}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-xs sm:text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 sm:pt-8 border-t border-primary-foreground/10 gap-4">
          <p className="text-primary-foreground/50 text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Catalyst AI. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="p-2.5 sm:p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};