import { useState } from "react";
import { MessageCircle, Phone, Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WHATSAPP = "243000000000";
const PHONE = "+243000000000";
const EMAIL = "contact@irokoexpress.com";

const ContactShortcuts = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const actions = [
    {
      label: t("shortcuts.whatsapp", "WhatsApp"),
      href: `https://wa.me/${WHATSAPP}`,
      bg: "#25D366",
      icon: MessageCircle,
      external: true,
    },
    {
      label: t("shortcuts.call", "Appeler"),
      href: `tel:${PHONE}`,
      bg: "hsl(var(--primary))",
      icon: Phone,
      external: true,
    },
    {
      label: t("shortcuts.email", "Email"),
      href: `mailto:${EMAIL}`,
      bg: "hsl(var(--secondary))",
      icon: Mail,
      external: true,
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2.5"
          >
            {actions.map((a) => (
              <li key={a.label} className="flex items-center gap-2.5 justify-end">
                <span className="text-xs font-semibold bg-card text-foreground px-3 py-1.5 rounded-lg shadow-soft-md border border-border">
                  {a.label}
                </span>
                <a
                  href={a.href}
                  target={a.external ? "_blank" : undefined}
                  rel={a.external ? "noopener noreferrer" : undefined}
                  aria-label={a.label}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-soft-lg text-white hover:scale-110 transition-transform"
                  style={{ backgroundColor: a.bg }}
                >
                  <a.icon size={20} />
                </a>
              </li>
            ))}
            <li className="flex items-center gap-2.5 justify-end">
              <span className="text-xs font-semibold bg-card text-foreground px-3 py-1.5 rounded-lg shadow-soft-md border border-border">
                {t("shortcuts.quote", "Demander un devis")}
              </span>
              <Link
                to="/devis"
                aria-label={t("shortcuts.quote", "Demander un devis")}
                className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-soft-lg hover:scale-110 transition-transform font-display font-bold"
              >
                €
              </Link>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("shortcuts.close", "Fermer") : t("shortcuts.open", "Nous contacter")}
        aria-expanded={open}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 text-white"
        style={{ backgroundColor: open ? "hsl(var(--secondary))" : "#25D366", boxShadow: "0 10px 30px -8px rgba(37, 211, 102, 0.5)" }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span key="m" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <MessageCircle size={26} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default ContactShortcuts;
