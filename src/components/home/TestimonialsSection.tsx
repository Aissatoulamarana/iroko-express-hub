import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const testimonials = [
  { name: "Jean-Marie Kabongo", company: "KaboTech SARL", text: "Iroko Express a transformé notre chaîne d'approvisionnement. Le dédouanement qui prenait des semaines ne prend plus que quelques jours.", rating: 5 },
  { name: "Li Wei", company: "Guangzhou Trading Co.", text: "Excellent service de sourcing depuis la Chine. L'équipe est réactive et professionnelle, nos livraisons arrivent toujours à temps.", rating: 5 },
  { name: "Marie-Claire Bopda", company: "Import Douala", text: "Le suivi en temps réel est un vrai plus. Je recommande Iroko Express à tous les importateurs du Cameroun.", rating: 5 },
];

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);
  const next = () => setActive((p) => (p + 1) % testimonials.length);
  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 lg:py-28 section-dark overflow-hidden">
      <div className="grain-overlay" />
      <div className="container mx-auto px-4 lg:px-8 relative z-20">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {t("testimonials.subtitle")}
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-surface-foreground mb-4">
            {t("testimonials.title")}
          </h2>
        </motion.div>
        <div className="max-w-3xl mx-auto">
          <motion.div key={active} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="glass-card p-8 md:p-12 text-center">
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                <Star key={i} size={20} className="fill-primary text-primary" />
              ))}
            </div>
            <p className="text-surface-foreground/90 text-lg md:text-xl leading-relaxed mb-8 italic">"{testimonials[active].text}"</p>
            <div>
              <div className="font-display font-bold text-surface-foreground text-lg">{testimonials[active].name}</div>
              <div className="text-surface-foreground/50 text-sm">{testimonials[active].company}</div>
            </div>
          </motion.div>
          <div className="flex justify-center gap-4 mt-8">
            <button onClick={prev} className="w-12 h-12 rounded-full border border-surface-foreground/20 flex items-center justify-center text-surface-foreground/60 hover:text-primary hover:border-primary transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="w-12 h-12 rounded-full border border-surface-foreground/20 flex items-center justify-center text-surface-foreground/60 hover:text-primary hover:border-primary transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
