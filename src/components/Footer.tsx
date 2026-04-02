import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

const footerLinks = {
  services: [
    { label: "Dédouanement", href: "/services" },
    { label: "Transit douanier", href: "/services" },
    { label: "Import / Export", href: "/services" },
    { label: "Suivi d'expédition", href: "/suivi" },
    { label: "Sourcing Chine", href: "/services" },
  ],
  company: [
    { label: "À propos", href: "/a-propos" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Demander un devis", href: "/devis" },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "Politique de confidentialité", href: "/politique-confidentialite" },
  ],
};

const Footer = () => {
  return (
    <footer className="section-dark">
      <div className="grain-overlay" />
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center font-display font-extrabold text-primary-foreground text-lg">
                IE
              </div>
              <span className="font-display font-bold text-xl text-surface-foreground">
                Iroko<span className="text-primary">Express</span>
              </span>
            </Link>
            <p className="text-surface-foreground/60 text-sm leading-relaxed mb-6">
              Votre partenaire de confiance pour le transit, l'import/export et le dédouanement entre la RDC, la Chine et le Cameroun.
            </p>
            <div className="flex flex-col gap-3 text-sm text-surface-foreground/60">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary shrink-0" />
                <span>Kinshasa, RDC</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary shrink-0" />
                <span>+243 XXX XXX XXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary shrink-0" />
                <span>contact@irokoexpress.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-surface-foreground mb-6">Services</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.services.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-surface-foreground/60 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-surface-foreground mb-6">Entreprise</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-surface-foreground/60 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold text-surface-foreground mb-6">Newsletter</h4>
            <p className="text-sm text-surface-foreground/60 mb-4">
              Restez informé de nos dernières actualités et offres.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 bg-surface-foreground/5 border border-surface-foreground/10 rounded-lg px-4 py-2.5 text-sm text-surface-foreground placeholder:text-surface-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold text-sm hover:brightness-110 transition-all">
                <ArrowUpRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-surface-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-surface-foreground/40">
            © {new Date().getFullYear()} Iroko Express. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((l) => (
              <Link key={l.label} to={l.href} className="text-xs text-surface-foreground/40 hover:text-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
