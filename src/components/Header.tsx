import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 mix-blend-difference",
        scrolled ? "py-4" : "py-6 lg:py-8"
      )}
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <Link to="/" className="group">
          <span className="font-bold text-2xl tracking-tighter text-white uppercase">
            Iroko<span className="text-primary">—</span>Express
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium uppercase tracking-widest transition-all duration-300 text-white",
                location.pathname === link.href
                  ? "opacity-100"
                  : "opacity-50 hover:opacity-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + Language */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSelector />
          <Link
            to="/devis"
            className="px-6 py-3 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors duration-300"
          >
            {t("nav.quote")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSelector />
          <button
            className="text-white p-2"
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
            className="lg:hidden bg-secondary border-t border-surface-foreground/10"
            style={{ mixBlendMode: "normal" }}
          >
            <nav className="px-6 py-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-3 text-sm font-medium uppercase tracking-widest transition-all",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-surface-foreground/60 hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/devis"
                className="mt-4 px-6 py-4 bg-primary text-primary-foreground text-center text-sm font-bold uppercase tracking-widest"
              >
                {t("nav.quote")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
