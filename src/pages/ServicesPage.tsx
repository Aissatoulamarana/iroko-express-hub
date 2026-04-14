import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Ship, PackageSearch, Globe, ShoppingCart, Truck, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

const ServicesPage = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  const services = [
    { icon: ShieldCheck, title: t("services.customs"), description: t("services.customsDesc"), phase: "01", steps: ["Analyse de la documentation commerciale", "Classification tarifaire et calcul des droits", "Soumission de la déclaration en douane", "Inspection et mainlevée des marchandises", "Livraison après dédouanement"] },
    { icon: Ship, title: t("services.transit"), description: t("services.transitDesc"), phase: "02", steps: ["Établissement du document de transit (T1/T2)", "Scellage et prise en charge du conteneur", "Acheminement vers le bureau de destination", "Suivi GPS en temps réel", "Apurement du transit à destination"] },
    { icon: PackageSearch, title: t("services.import"), description: t("services.importDesc"), phase: "03", steps: ["Consultation et planification logistique", "Négociation des tarifs fret (mer/air/route)", "Gestion documentaire complète", "Coordination du transport multimodal", "Livraison porte-à-porte"] },
    { icon: Globe, title: t("services.tracking"), description: t("services.trackingDesc"), phase: "04", steps: ["Attribution d'un numéro de suivi unique", "Mise à jour en temps réel du statut", "Notifications SMS et email", "Accès client à la plateforme de suivi", "Rapport de livraison avec preuve"] },
    { icon: ShoppingCart, title: t("services.sourcing"), description: t("services.sourcingDesc"), phase: "05", steps: ["Recherche et sélection de fournisseurs", "Négociation des prix et conditions", "Contrôle qualité en usine", "Consolidation et emballage export", "Expédition et suivi jusqu'à destination"] },
    { icon: Truck, title: t("services.logistics"), description: t("services.logisticsDesc"), phase: "06", steps: ["Étude des besoins et devis personnalisé", "Réservation du fret (FCL/LCL, air cargo)", "Gestion de l'entreposage et du groupage", "Coordination des transports locaux", "Livraison finale et confirmation"] },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary relative overflow-hidden pt-40 pb-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-20" ref={heroRef}>
          <motion.span initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-accent text-xs font-bold uppercase tracking-widest block mb-6">
            {t("services.sectionTitle")}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase text-surface-foreground leading-[0.85] mb-6">
            {t("services.sectionTitle")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="text-surface-foreground/50 text-lg lg:text-xl max-w-2xl font-light">
            {t("services.sectionDesc")}
          </motion.p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-24 bg-background" ref={gridRef}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 space-y-0">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={gridInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }} className="grid md:grid-cols-2 gap-8 py-12 border-b border-border items-start">
                <div className="flex gap-8">
                  <span className="text-4xl font-bold tabular-nums text-muted-foreground/20">{service.phase}</span>
                  <div>
                    <Icon className="w-6 h-6 text-primary mb-4" />
                    <h2 className="font-bold text-2xl md:text-3xl uppercase tracking-tight text-foreground mb-3">{service.title}</h2>
                    <p className="text-muted-foreground leading-relaxed font-light">{service.description}</p>
                    <Button variant="link" className="mt-4 px-0 text-primary" asChild>
                      <Link to="/devis">{t("nav.quote")} <ArrowRight className="ml-1 w-4 h-4" /></Link>
                    </Button>
                  </div>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="process" className="border px-6">
                    <AccordionTrigger className="font-bold text-sm uppercase tracking-widest hover:no-underline">Processus détaillé</AccordionTrigger>
                    <AccordionContent>
                      <ol className="space-y-3">
                        {service.steps.map((step, j) => (
                          <li key={j} className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /><span className="text-muted-foreground text-sm">{step}</span></li>
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
      <section className="bg-primary py-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row justify-between items-center gap-8">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-primary-foreground">{t("cta.title")}</h2>
          <Link to="/devis" className="px-10 py-5 bg-secondary text-secondary-foreground font-bold uppercase tracking-widest hover:bg-accent transition-colors duration-300">
            {t("nav.quote")}
          </Link>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
