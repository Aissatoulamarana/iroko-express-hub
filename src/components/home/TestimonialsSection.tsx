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
    <section className="py-32 bg-muted overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-12 items-center" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-5"
          >
            <span className="text-accent text-xs font-bold uppercase tracking-widest block mb-4">
              {t("testimonials.subtitle")}
            </span>
            <h2 className="text-5xl font-bold uppercase tracking-tighter leading-[0.9] text-foreground mb-8">
              {t("testimonials.title")}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={prev}
                className="w-12 h-12 border border-foreground/20 flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 border border-foreground/20 flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-background border border-border p-10 lg:p-12"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground text-xl lg:text-2xl leading-relaxed font-light mb-10 italic">
                "{testimonials[active].text}"
              </p>
              <div className="border-t border-border pt-6">
                <div className="font-bold text-foreground uppercase tracking-wider text-sm">
                  {testimonials[active].name}
                </div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest mt-1">
                  {testimonials[active].company}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
