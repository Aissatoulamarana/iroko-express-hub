import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield, Truck, ArrowLeftRight, MapPin, ShoppingBag, Globe,
} from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "Dédouanement",
    description: "Procédures douanières simplifiées et rapides pour vos marchandises en RDC, Chine et Cameroun.",
    span: "md:col-span-1",
  },
  {
    icon: Truck,
    title: "Transit douanier",
    description: "Acheminement sécurisé de vos marchandises entre les bureaux de douane avec un suivi en temps réel.",
    span: "md:col-span-1",
  },
  {
    icon: ArrowLeftRight,
    title: "Import / Export",
    description: "Solutions complètes d'importation et d'exportation entre l'Afrique et l'Asie.",
    span: "md:col-span-1",
  },
  {
    icon: MapPin,
    title: "Suivi d'expédition",
    description: "Suivez vos colis en temps réel, de l'expédition à la livraison finale.",
    span: "md:col-span-1",
  },
  {
    icon: ShoppingBag,
    title: "Sourcing Chine & Alibaba",
    description: "Nous trouvons, négocions et expédions vos produits depuis la Chine et Alibaba.",
    span: "md:col-span-1",
  },
  {
    icon: Globe,
    title: "Logistique internationale",
    description: "Coordination logistique de bout en bout pour vos opérations internationales.",
    span: "md:col-span-1",
  },
];

const ServicesGrid = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 lg:py-28 section-light">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Nos Services
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Des solutions sur mesure
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            De la Chine à l'Afrique, nous gérons chaque étape de votre chaîne logistique.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group bg-card rounded-2xl p-8 border border-border hover-lift cursor-pointer ${service.span}`}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <service.icon size={26} className="text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
