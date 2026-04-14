import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = {
    services: [
      { label: t("services.customs"), href: "/services" },
      { label: t("services.transit"), href: "/services" },
      { label: t("services.import"), href: "/services" },
      { label: t("services.tracking"), href: "/suivi" },
      { label: t("services.sourcing"), href: "/services" },
    ],
    company: [
      { label: t("nav.about"), href: "/a-propos" },
      { label: t("nav.blog"), href: "/blog" },
      { label: t("nav.contact"), href: "/contact" },
      { label: t("nav.quote"), href: "/devis" },
    ],
    legal: [
      { label: t("footer.legal"), href: "/mentions-legales" },
      { label: t("footer.privacy"), href: "/politique-confidentialite" },
    ],
  };

  return (
    <footer className="section-dark">
      <div className="grain-overlay" />
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center font-display font-extrabold text-primary-foreground text-lg">IE</div>
              <span className="font-display font-bold text-xl text-surface-foreground">Iroko<span className="text-primary">Express</span></span>
            </Link>
            <p className="text-surface-foreground/60 text-sm leading-relaxed mb-6">{t("footer.description")}</p>
            <div className="flex flex-col gap-3 text-sm text-surface-foreground/60">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-primary shrink-0" /><span>Kinshasa, RDC</span></div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-primary shrink-0" /><span>+243 XXX XXX XXX</span></div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-primary shrink-0" /><span>contact@irokoexpress.com</span></div>
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-surface-foreground mb-6">{t("footer.services")}</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.services.map((l) => (
                <li key={l.label}><Link to={l.href} className="text-sm text-surface-foreground/60 hover:text-primary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-surface-foreground mb-6">{t("footer.company")}</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((l) => (
                <li key={l.label}><Link to={l.href} className="text-sm text-surface-foreground/60 hover:text-primary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-surface-foreground mb-6">{t("footer.newsletter")}</h4>
            <p className="text-sm text-surface-foreground/60 mb-4">{t("footer.newsletterDesc")}</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={t("footer.emailPlaceholder")} className="flex-1 bg-surface-foreground/5 border border-surface-foreground/10 rounded-lg px-4 py-2.5 text-sm text-surface-foreground placeholder:text-surface-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              <button className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold text-sm hover:brightness-110 transition-all"><ArrowUpRight size={18} /></button>
            </form>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-surface-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-surface-foreground/40">© {new Date().getFullYear()} Iroko Express. {t("footer.rights")}</p>
          <div className="flex gap-6">
            {footerLinks.legal.map((l) => (
              <Link key={l.label} to={l.href} className="text-xs text-surface-foreground/40 hover:text-primary transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
