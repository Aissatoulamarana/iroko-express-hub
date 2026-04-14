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
    <footer className="bg-primary pt-24 pb-12">
      {/* Giant brand name */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
          <div className="text-[12vw] lg:text-[10vw] font-bold leading-none tracking-tighter uppercase text-primary-foreground">
            Iroko
          </div>
          <div className="flex flex-col items-start lg:items-end gap-6">
            <Link
              to="/devis"
              className="px-12 py-6 bg-secondary text-secondary-foreground text-lg font-bold uppercase tracking-widest hover:bg-accent transition-colors duration-300 flex items-center gap-2"
            >
              {t("nav.quote")}
              <ArrowUpRight size={20} />
            </Link>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-primary-foreground/10">
          <div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6">{t("footer.description")}</p>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/60">
              <div className="flex items-center gap-2"><MapPin size={14} className="shrink-0" /><span>Kinshasa, RDC</span></div>
              <div className="flex items-center gap-2"><Phone size={14} className="shrink-0" /><span>+243 XXX XXX XXX</span></div>
              <div className="flex items-center gap-2"><Mail size={14} className="shrink-0" /><span>contact@irokoexpress.com</span></div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-primary-foreground text-xs uppercase tracking-widest mb-6">{t("footer.services")}</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.services.map((l) => (
                <li key={l.label}><Link to={l.href} className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary-foreground text-xs uppercase tracking-widest mb-6">{t("footer.company")}</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((l) => (
                <li key={l.label}><Link to={l.href} className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary-foreground text-xs uppercase tracking-widest mb-6">{t("footer.newsletter")}</h4>
            <p className="text-sm text-primary-foreground/50 mb-4">{t("footer.newsletterDesc")}</p>
            <form className="flex gap-0" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 bg-primary-foreground/5 border border-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-primary-foreground/30 transition-colors"
              />
              <button className="bg-secondary text-secondary-foreground px-4 py-3 font-bold text-sm hover:bg-accent transition-colors">
                <ArrowUpRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40 uppercase tracking-widest">© {new Date().getFullYear()} Iroko Express. {t("footer.rights")}</p>
          <div className="flex gap-8">
            {footerLinks.legal.map((l) => (
              <Link key={l.label} to={l.href} className="text-xs text-primary-foreground/40 hover:text-primary-foreground uppercase tracking-widest transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
