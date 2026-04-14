import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Truck, ArrowLeftRight, MapPin, ShoppingBag, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const ServicesGrid = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    { icon: Shield, title: t("services.customs"), description: t("services.customsDesc"), phase: "01" },
    { icon: Truck, title: t("services.transit"), description: t("services.transitDesc"), phase: "02" },
    { icon: ArrowLeftRight, title: t("services.import"), description: t("services.importDesc"), phase: "03" },
    { icon: MapPin, title: t("services.tracking"), description: t("services.trackingDesc"), phase: "04" },
    { icon: ShoppingBag, title: t("services.sourcing"), description: t("services.sourcingDesc"), phase: "05" },
    { icon: Globe, title: t("services.logistics"), description: t("services.logisticsDesc"), phase: "06" },
  ];

  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-12 mb-16" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-4"
          >
            <span className="text-accent text-xs font-bold uppercase tracking-widest block mb-4">
              {t("services.sectionTitle")}
            </span>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tighter uppercase leading-none text-surface-foreground">
              {t("services.sectionDesc")}
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-foreground/5">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-surface-foreground/[0.02] backdrop-blur-xl border border-surface-foreground/5 p-10 lg:p-12 flex flex-col justify-between group hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-surface-foreground/30 group-hover:text-primary-foreground/50 transition-colors">
                  Phase {service.phase}
                </span>
              </div>
              <div className="mt-12">
                <service.icon
                  size={28}
                  className="text-primary mb-4 group-hover:text-primary-foreground transition-colors"
                />
                <h3 className="text-2xl font-bold uppercase mb-3 text-surface-foreground group-hover:text-primary-foreground transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-surface-foreground/50 leading-relaxed group-hover:text-primary-foreground/70 transition-colors">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
