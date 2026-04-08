import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Ship, PackageSearch, Globe, ShoppingCart, Truck,
  ArrowRight, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const services = [
  {
    icon: ShieldCheck,
    title: "Dédouanement",
    description:
      "Nous prenons en charge l'ensemble des formalités douanières pour vos marchandises en RDC, au Cameroun et en Chine. Déclarations, licences, conformité réglementaire — tout est géré.",
    steps: [
      "Analyse de la documentation commerciale",
      "Classification tarifaire et calcul des droits",
      "Soumission de la déclaration en douane",
      "Inspection et mainlevée des marchandises",
      "Livraison après dédouanement",
    ],
  },
  {
    icon: Ship,
    title: "Transit douanier",
    description:
      "Transport sécurisé de vos marchandises sous régime douanier, entre les ports, aéroports et entrepôts de la région. Suivi en temps réel inclus.",
    steps: [
      "Établissement du document de transit (T1/T2)",
      "Scellage et prise en charge du conteneur",
      "Acheminement vers le bureau de destination",
      "Suivi GPS en temps réel",
      "Apurement du transit à destination",
    ],
  },
  {
    icon: PackageSearch,
    title: "Import / Export",
    description:
      "De la Chine à Kinshasa, de Douala à Lubumbashi — nous organisons vos flux d'import et d'export de A à Z avec des tarifs compétitifs.",
    steps: [
      "Consultation et planification logistique",
      "Négociation des tarifs fret (mer/air/route)",
      "Gestion documentaire complète",
      "Coordination du transport multimodal",
      "Livraison porte-à-porte",
    ],
  },
  {
    icon: Globe,
    title: "Suivi d'expédition",
    description:
      "Suivez chaque étape de votre envoi grâce à notre plateforme de tracking en ligne. Notifications automatiques à chaque changement de statut.",
    steps: [
      "Attribution d'un numéro de suivi unique",
      "Mise à jour en temps réel du statut",
      "Notifications SMS et email",
      "Accès client à la plateforme de suivi",
      "Rapport de livraison avec preuve",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Sourcing Chine & Alibaba",
    description:
      "Nous sourçons vos produits directement auprès des fournisseurs chinois, vérifions la qualité et organisons l'expédition jusqu'à votre porte.",
    steps: [
      "Recherche et sélection de fournisseurs",
      "Négociation des prix et conditions",
      "Contrôle qualité en usine",
      "Consolidation et emballage export",
      "Expédition et suivi jusqu'à destination",
    ],
  },
  {
    icon: Truck,
    title: "Logistique internationale",
    description:
      "Solutions logistiques sur mesure : fret maritime, aérien et terrestre. Entreposage, groupage et distribution dans toute l'Afrique centrale.",
    steps: [
      "Étude des besoins et devis personnalisé",
      "Réservation du fret (FCL/LCL, air cargo)",
      "Gestion de l'entreposage et du groupage",
      "Coordination des transports locaux",
      "Livraison finale et confirmation",
    ],
  },
];

const ServicesPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* Hero */}
      <section className="section-dark relative overflow-hidden pt-32 pb-20">
        <div className="grain-overlay" />
        <div className="container mx-auto px-4 lg:px-8 relative z-20" ref={heroRef}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-primary font-semibold tracking-widest uppercase text-sm mb-4"
          >
            Ce que nous faisons
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl text-surface-foreground leading-tight mb-6"
          >
            Nos <span className="text-gradient-primary">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-surface-foreground/70 text-lg md:text-xl max-w-2xl"
          >
            Des solutions logistiques complètes pour vos opérations de transit,
            d'import/export et de dédouanement en Afrique et en Chine.
          </motion.p>
        </div>
      </section>

      {/* Services detail */}
      <section className="py-20 bg-background" ref={gridRef}>
        <div className="container mx-auto px-4 lg:px-8 space-y-16">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="grid md:grid-cols-2 gap-8 items-start"
              >
                {/* Card */}
                <div className="rounded-2xl border border-border bg-card p-8 hover-lift">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <Button variant="link" className="mt-4 px-0 text-primary" asChild>
                    <Link to="/devis">
                      Demander un devis <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                {/* Accordion process */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="process" className="border rounded-2xl px-6">
                    <AccordionTrigger className="font-display font-semibold text-lg hover:no-underline">
                      Processus détaillé
                    </AccordionTrigger>
                    <AccordionContent>
                      <ol className="space-y-3">
                        {service.steps.map((step, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-primary-foreground mb-4">
            Un projet en tête ?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Contactez-nous dès maintenant pour un devis gratuit et personnalisé.
          </p>
          <Button variant="secondary" size="xl" asChild>
            <Link to="/devis">Demander un devis</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
