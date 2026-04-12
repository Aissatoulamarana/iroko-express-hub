import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";

interface StatItemProps {
  value: number;
  suffix: string;
  labelKey: string;
  delay?: number;
}

const StatItem = ({ value, suffix, labelKey, delay = 0 }: StatItemProps) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      let start = 0;
      const step = Math.ceil(value / (2000 / 16));
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
    <div ref={ref} className="text-center">
      <div className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-primary mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm md:text-base text-muted-foreground font-medium">{t(labelKey)}</div>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    { value: 2500, suffix: "+", labelKey: "stats.clients" },
    { value: 3, suffix: "", labelKey: "stats.countries" },
    { value: 12, suffix: "", labelKey: "stats.years" },
    { value: 15000, suffix: "+", labelKey: "stats.shipments" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <StatItem key={stat.labelKey} {...stat} delay={i * 200} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
