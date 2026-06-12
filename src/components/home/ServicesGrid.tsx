import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Shield, Truck, ArrowLeftRight, MapPin, Package, Compass, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const ServicesGrid = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    { icon: Shield, title: t("services.customs"), description: t("services.customsDesc"), tag: "01" },
    { icon: ArrowLeftRight, title: t("services.import"), description: t("services.importDesc"), tag: "02" },
    { icon: Truck, title: t("services.transit"), description: t("services.transitDesc"), tag: "03" },
    { icon: MapPin, title: t("services.tracking"), description: t("services.trackingDesc"), tag: "04" },
    { icon: Package, title: t("services.logistics"), description: t("services.logisticsDesc"), tag: "05" },
    { icon: Compass, title: t("services.sourcing"), description: t("services.sourcingDesc"), tag: "06" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">{t("services.sectionTitle")}</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mt-3 leading-tight">
              {t("services.sectionDesc")}
            </h2>
          </div>
          <Link to="/services" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors">
            {t("services.seeAll", "Voir tous les services")}
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden border border-border">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative bg-card p-8 lg:p-10 hover:bg-surface-subtle transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <service.icon size={22} className="text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="font-mono-track text-xs text-muted-foreground">{service.tag}</span>
              </div>
              <h3 className="font-display text-xl text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>
              <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {t("services.learnMore", "En savoir plus")}
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
