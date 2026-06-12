import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-3 lg:pt-5 px-3 lg:px-6">
      <div
        className={cn(
          "container mx-auto rounded-2xl border transition-all duration-300",
          scrolled
            ? "bg-background/85 backdrop-blur-xl border-border shadow-soft-md"
            : "bg-background/60 backdrop-blur-md border-transparent"
        )}
      >
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center font-display font-extrabold text-primary-foreground group-hover:scale-105 transition-transform">
              IE
            </div>
            <span className="font-display text-lg text-foreground tracking-tight">
              Iroko<span className="text-primary">Express</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 bg-surface-muted rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <LanguageSelector />
            <Button variant="default" size="default" asChild className="rounded-lg">
              <Link to="/devis">{t("nav.quote")}<ArrowUpRight size={16} /></Link>
            </Button>
          </div>

          <div className="lg:hidden flex items-center gap-1">
            <LanguageSelector />
            <button
              aria-label="Menu"
              className="text-foreground p-2 rounded-lg hover:bg-surface-muted"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-border"
            >
              <nav className="px-4 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                      location.pathname === link.href
                        ? "bg-surface-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button variant="default" size="lg" className="mt-3" asChild>
                  <Link to="/devis">{t("nav.quote")}<ArrowUpRight size={16} /></Link>
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
