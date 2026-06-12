import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowUpRight, Linkedin, Instagram, Facebook } from "lucide-react";
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
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 lg:px-8 pt-20 pb-10">
        {/* Top: huge brand + newsletter */}
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-secondary-foreground/10">
          <div className="lg:col-span-7">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center font-display font-extrabold text-primary-foreground">IE</div>
              <span className="font-display text-2xl">Iroko<span className="text-primary">Express</span></span>
            </Link>
            <p className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight max-w-2xl">
              {t("footer.bigline", "Expédions ensemble — entre l'Asie, le Cameroun et la RDC.")}
            </p>
          </div>
          <div className="lg:col-span-5">
            <h4 className="font-display text-lg mb-3">{t("footer.newsletter")}</h4>
            <p className="text-secondary-foreground/60 text-sm mb-4">{t("footer.newsletterDesc")}</p>
            <form className="flex gap-2 mb-6" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 bg-secondary-foreground/5 border border-secondary-foreground/15 rounded-xl px-4 py-3 text-sm placeholder:text-secondary-foreground/40 focus:outline-none focus:border-primary/60 transition-colors"
              />
              <button className="bg-primary text-primary-foreground px-4 rounded-xl font-semibold hover:brightness-110 transition-all" aria-label="Subscribe">
                <ArrowUpRight size={18} />
              </button>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-secondary-foreground/70"><MapPin size={14} className="text-primary" />Kinshasa, RDC</div>
              <div className="flex items-center gap-2 text-secondary-foreground/70"><Phone size={14} className="text-primary" />+243 XXX XXX XXX</div>
              <div className="flex items-center gap-2 text-secondary-foreground/70 col-span-full"><Mail size={14} className="text-primary" />contact@irokoexpress.com</div>
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary-foreground/40 font-bold mb-4">{t("footer.services")}</p>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.services.map((l) => (
                <li key={l.label}><Link to={l.href} className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary-foreground/40 font-bold mb-4">{t("footer.company")}</p>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.company.map((l) => (
                <li key={l.label}><Link to={l.href} className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-secondary-foreground/40 font-bold mb-4">{t("footer.social", "Réseaux")}</p>
            <div className="flex gap-2">
              {[Linkedin, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl border border-secondary-foreground/15 flex items-center justify-center text-secondary-foreground/70 hover:text-primary hover:border-primary transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-secondary-foreground/40">© {new Date().getFullYear()} Iroko Express. {t("footer.rights")}</p>
          <div className="flex gap-6">
            {footerLinks.legal.map((l) => (
              <Link key={l.label} to={l.href} className="text-xs text-secondary-foreground/40 hover:text-primary transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
