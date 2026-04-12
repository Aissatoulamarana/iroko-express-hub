import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Truck, ArrowLeftRight, MapPin, ShoppingBag, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const ServicesGrid = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    { icon: Shield, title: t("services.customs"), description: t("services.customsDesc") },
    { icon: Truck, title: t("services.transit"), description: t("services.transitDesc") },
    { icon: ArrowLeftRight, title: t("services.import"), description: t("services.importDesc") },
    { icon: MapPin, title: t("services.tracking"), description: t("services.trackingDesc") },
    { icon: ShoppingBag, title: t("services.sourcing"), description: t("services.sourcingDesc") },
    { icon: Globe, title: t("services.logistics"), description: t("services.logisticsDesc") },
  ];

  return (
    <section className="py-20 lg:py-28 section-light">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {t("services.sectionTitle")}
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            {t("services.sectionDesc")}
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} className="group bg-card rounded-2xl p-8 border border-border hover-lift cursor-pointer">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <service.icon size={26} className="text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
