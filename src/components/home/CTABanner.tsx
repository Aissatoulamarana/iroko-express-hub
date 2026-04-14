import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const CTABanner = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-40 bg-secondary relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-surface-foreground/5" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 lg:px-12 text-center relative z-10"
      >
        <div className="mb-8 inline-block px-4 py-1 border border-primary text-primary text-xs tracking-widest uppercase font-bold">
          {t("cta.title")}
        </div>
        <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-none text-surface-foreground mb-8">
          {t("cta.description")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            to="/devis"
            className="group inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-10 py-5 font-bold uppercase tracking-widest text-sm hover:bg-accent transition-colors duration-300"
          >
            {t("cta.button1")}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-3 border border-surface-foreground/20 text-surface-foreground px-10 py-5 font-bold uppercase tracking-widest text-sm hover:border-surface-foreground/50 transition-colors duration-300"
          >
            {t("cta.button2")}
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTABanner;
