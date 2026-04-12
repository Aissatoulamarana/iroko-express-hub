import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Search, Ship, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    { icon: FileText, title: t("howItWorks.step1Title"), description: t("howItWorks.step1Desc") },
    { icon: Search, title: t("howItWorks.step2Title"), description: t("howItWorks.step2Desc") },
    { icon: Ship, title: t("howItWorks.step3Title"), description: t("howItWorks.step3Desc") },
    { icon: CheckCircle, title: t("howItWorks.step4Title"), description: t("howItWorks.step4Desc") },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {t("howItWorks.title")}
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            {t("howItWorks.subtitle")}
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-border" />
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.15 }} className="relative text-center">
              <div className="relative z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                <step.icon size={28} className="text-primary-foreground" />
              </div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary/20 animate-ping hidden lg:block" />
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
