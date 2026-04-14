import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LanguageSelector from "@/components/LanguageSelector";

const Header = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.services"), href: "/services" },
    { label: t("nav.tracking"), href: "/suivi" },
    { label: t("nav.about"), href: "/a-propos" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-secondary/95 backdrop-blur-xl shadow-lg shadow-secondary/20 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center font-display font-extrabold text-primary-foreground text-lg group-hover:scale-105 transition-transform">
            IE
          </div>
          <span className="font-display font-bold text-xl text-surface-foreground tracking-tight">
            Iroko<span className="text-primary">Express</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-surface-foreground/70 hover:text-primary hover:bg-primary/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + Language */}
        <div className="hidden lg:flex items-center gap-2">
          <LanguageSelector />
          <Button variant="hero" size="default" asChild>
            <Link to="/devis">{t("nav.quote")}</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-1">
          <LanguageSelector />
          <button
            className="text-surface-foreground p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-secondary/98 backdrop-blur-xl border-t border-surface-foreground/10"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-base font-medium transition-all",
                    location.pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-surface-foreground/70 hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="hero" size="lg" className="mt-4" asChild>
                <Link to="/devis">{t("nav.quote")}</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
