import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Briefcase, TrendingUp, Workflow, Cpu, BookOpen, Users, Building2, Mail } from "lucide-react";
import catalystIcon from "@/assets/catalyst-icon.png";
import Dock from "@/components/Dock";

const navLinks = [
  { label: "Services", href: "/#services", icon: Briefcase },
  { label: "Results", href: "/#results", icon: TrendingUp },
  { label: "Process", href: "/#process", icon: Workflow },
  { label: "Tech", href: "/#tech", icon: Cpu },
  { label: "Insights", href: "/blog", icon: BookOpen },
  { label: "About", href: "/about", icon: Users },
  { label: "Careers", href: "/careers", icon: Building2 },
  { label: "Contact", href: "/contact", icon: Mail },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    // Check if it's a hash link for the homepage
    if (href.startsWith("/#")) {
      const hash = href.substring(1); // Remove leading /
      if (location.pathname === "/") {
        // Already on homepage, just scroll
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to homepage with hash
        navigate("/" + hash);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container-narrow px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center font-display text-xl sm:text-2xl font-bold tracking-tight">
            <span className="text-foreground">Catalyst</span>
            <span className="bg-gradient-to-r from-accent to-[hsl(187,92%,43%)] bg-clip-text text-transparent">AI</span>
            <img src={catalystIcon} alt="" className="h-10 sm:h-12 w-auto -ml-2" />
          </Link>

          {/* Desktop Navigation - Dock */}
          <nav className="hidden md:flex items-center">
            <Dock
              items={navLinks.map((link) => ({
                icon: <link.icon size={20} />,
                label: link.label,
                onClick: () => handleNavClick(link.href),
              }))}
              panelHeight={56}
              baseItemSize={42}
              magnification={58}
            />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.nav
            className="md:hidden py-4 sm:py-6 border-t border-border bg-background/95 backdrop-blur-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-base sm:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-1 bg-transparent border-none cursor-pointer text-left"
                >
                  {link.label}
                </button>
              ))}
              <Button variant="glow" size="default" className="mt-3 sm:mt-4 w-full" onClick={() => handleNavClick("/contact")}>
                Get Started
              </Button>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};
