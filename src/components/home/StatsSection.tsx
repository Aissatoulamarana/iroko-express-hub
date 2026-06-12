import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useTranslation } from "react-i18next";

interface StatItemProps {
  value: number;
  suffix?: string;
  labelKey: string;
  fallback: string;
  delay?: number;
}

const StatItem = ({ value, suffix = "", labelKey, fallback, delay = 0 }: StatItemProps) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      let start = 0;
      const step = Math.max(1, Math.ceil(value / (1600 / 16)));
      const interval = setInterval(() => {
        start += step;
        if (start >= value) { setCount(value); clearInterval(interval); }
        else setCount(start);
      }, 16);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isInView, value, delay]);

  return (
    <div ref={ref} className="relative group">
      <div className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm md:text-base text-muted-foreground font-medium">{t(labelKey, fallback)}</div>
      <div className="mt-4 h-px w-12 bg-primary group-hover:w-24 transition-all duration-500" />
    </div>
  );
};

const StatsSection = () => {
  const { t } = useTranslation();
  const stats = [
    { value: 15000, suffix: "+", labelKey: "stats.shipments", fallback: "Colis livrés" },
    { value: 12, suffix: "+", labelKey: "stats.countries", fallback: "Pays desservis" },
    { value: 99, suffix: "%", labelKey: "stats.success", fallback: "Dédouanement réussi" },
    { value: 98, suffix: "%", labelKey: "stats.satisfaction", fallback: "Clients satisfaits" },
  ];

  return (
    <section className="py-16 lg:py-24 bg-surface-subtle border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">{t("stats.kicker", "Par les chiffres")}</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mt-3">
            {t("stats.title", "Une plateforme logistique en qui les pros ont confiance.")}
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {stats.map((stat, i) => (
            <StatItem key={stat.labelKey} {...stat} delay={i * 150} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
