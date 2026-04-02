import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Search, Ship, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Demande de devis",
    description: "Remplissez notre formulaire avec les détails de votre expédition.",
  },
  {
    icon: Search,
    title: "Étude & Proposition",
    description: "Notre équipe analyse votre demande et vous envoie une offre personnalisée.",
  },
  {
    icon: Ship,
    title: "Expédition & Suivi",
    description: "Nous prenons en charge l'expédition avec un suivi en temps réel.",
  },
  {
    icon: CheckCircle,
    title: "Livraison & Dédouanement",
    description: "Vos marchandises sont livrées après un dédouanement rapide et conforme.",
  },
];

const HowItWorks = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Comment ça marche
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Simple. Rapide. Fiable.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-border" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
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
