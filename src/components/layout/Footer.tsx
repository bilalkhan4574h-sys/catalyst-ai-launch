import { ArrowUp } from "lucide-react";

const footerLinks = {
  Company: ["About", "Careers", "Contact"],
  Services: ["AI Prospecting", "Ad Optimization", "Automation", "Analytics"],
  Resources: ["Blog", "Case Studies", "Documentation"],
  Legal: ["Privacy Policy", "Terms of Service"],
};

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="section-padding bg-primary text-primary-foreground">
      <div className="container-narrow">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="font-display text-2xl font-bold">
              Catalyst<span className="text-accent">AI</span>
            </a>
            <p className="text-primary-foreground/70 mt-4 max-w-sm">
              Building intelligent growth engines for modern businesses. AI-powered systems that scale.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-primary-foreground/10">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Catalyst AI. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
