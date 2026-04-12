import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const CTABanner = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 lg:py-28 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>
      <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="container mx-auto px-4 lg:px-8 text-center relative z-10">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6">
          {t("cta.title")}
        </h2>
        <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          {t("cta.description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" size="xl" asChild className="group">
            <Link to="/devis">
              {t("cta.button1")}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/contact">{t("cta.button2")}</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTABanner;
