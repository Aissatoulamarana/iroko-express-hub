import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-logistics.jpg";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-secondary">
      {/* Background image with grayscale */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Global logistics network"
          className="w-full h-full object-cover grayscale opacity-40"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-20 pb-24 pt-48 w-full">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-6 block">
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[11vw] lg:text-[8vw] leading-[0.85] font-bold tracking-tighter uppercase text-surface-foreground mb-8"
            >
              {t("hero.title")}{" "}
              <span className="text-primary">{t("hero.titleHighlight")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-surface-foreground/50 text-lg lg:text-xl max-w-[45ch] font-light leading-relaxed mb-10"
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/devis"
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-accent transition-colors duration-300"
              >
                {t("hero.cta1")}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/suivi"
                className="inline-flex items-center gap-3 border border-surface-foreground/20 text-surface-foreground px-8 py-4 font-bold uppercase tracking-widest text-sm hover:border-surface-foreground/50 transition-colors duration-300"
              >
                {t("hero.cta2")}
              </Link>
            </motion.div>
          </div>

          {/* Right side data panel */}
          <div className="col-span-12 lg:col-span-5 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-secondary border border-surface-foreground/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="absolute top-8 left-8 right-8 bottom-8 border border-surface-foreground/5 flex items-center justify-center">
                  <div className="w-32 h-32 bg-primary shadow-[30px_30px_0px_0px_rgba(0,0,0,0.4)] rotate-12 hover:rotate-0 transition-transform duration-700" />
                </div>
                <div className="absolute bottom-8 left-8 text-surface-foreground">
                  <p className="text-3xl font-bold tabular-nums">4.3210° S</p>
                  <p className="text-xs tracking-widest uppercase opacity-40 mt-1">Origin: Kinshasa Terminal</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-surface-foreground/30">Scroll</span>
          <div className="w-px h-12 bg-surface-foreground/20 relative overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-full h-1/3 bg-primary"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
