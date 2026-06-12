import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Target, Eye, Sparkles, ArrowRight, Handshake, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const pillars = [
    {
      icon: Target,
      label: t("about.missionLabel", "Mission"),
      title: t("about.missionTitle", "Connecter l'Afrique au commerce mondial"),
      description: t("about.missionDesc", "Fluidifier les flux d'import-export entre la Chine, le Cameroun et la RDC avec des standards qui rivalisent avec DHL et FedEx."),
    },
    {
      icon: Eye,
      label: t("about.visionLabel", "Vision"),
      title: t("about.visionTitle", "Devenir la référence du transit premium en Afrique Centrale"),
      description: t("about.visionDesc", "Une plateforme digitale, transparente et fiable où chaque expédition est tracée, certifiée et livrée en confiance."),
    },
    {
      icon: Sparkles,
      label: t("about.valuesLabel", "Valeurs"),
      title: t("about.valuesTitle", "Transparence, rapidité, excellence"),
      description: t("about.valuesDesc", "Nous traitons chaque colis comme s'il était le nôtre : tarifs clairs, délais respectés, accompagnement humain."),
    },
  ];

  const values = [
    { icon: Handshake, label: t("about.value1", "Engagement client") },
    { icon: Zap, label: t("about.value2", "Exécution rapide") },
    { icon: ShieldCheck, label: t("about.value3", "Conformité totale") },
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary text-secondary-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 relative" ref={ref}>
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 lg:sticky lg:top-28"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">{t("about.kicker", "À propos d'Iroko Express")}</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-3 leading-tight">
              {t("about.headline", "Un partenaire logistique pensé pour l'Afrique moderne.")}
            </h2>
            <p className="mt-6 text-secondary-foreground/70 text-lg leading-relaxed">
              {t("about.intro", "Iroko Express orchestre des opérations import-export rapides et sécurisées, avec une équipe locale au Cameroun, en RDC et en Chine.")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {values.map((v) => (
                <span key={v.label} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-foreground/5 border border-secondary-foreground/10 text-sm">
                  <v.icon size={14} className="text-primary" />
                  {v.label}
                </span>
              ))}
            </div>

            <Button variant="default" size="lg" asChild className="mt-10">
              <Link to="/a-propos">
                {t("about.cta", "Découvrir notre histoire")}
                <ArrowRight size={16} />
              </Link>
            </Button>
          </motion.div>

          <div className="lg:col-span-7 space-y-4">
            {pillars.map((p, i) => (
              <motion.article
                key={p.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className="group relative p-6 lg:p-8 rounded-2xl bg-secondary-foreground/[0.04] border border-secondary-foreground/10 hover:bg-secondary-foreground/[0.06] hover:border-primary/40 transition-all"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <p.icon size={22} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">{p.label}</p>
                    <h3 className="font-display text-xl lg:text-2xl mb-2">{p.title}</h3>
                    <p className="text-secondary-foreground/70 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
