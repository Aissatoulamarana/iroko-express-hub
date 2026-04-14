import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Target, Eye, Heart, Users, Award, Globe, TrendingUp, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const valuesRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInView = useInView(timelineRef, { once: true, margin: "-80px" });
  const teamRef = useRef<HTMLDivElement>(null);
  const teamInView = useInView(teamRef, { once: true, margin: "-80px" });

  const values = [
    { icon: Target, title: "Excellence", description: "Nous visons la perfection dans chaque opération logistique." },
    { icon: Eye, title: "Transparence", description: "Suivi en temps réel et communication claire à chaque étape." },
    { icon: Heart, title: "Engagement", description: "Votre satisfaction est notre priorité absolue, sans compromis." },
    { icon: Users, title: "Proximité", description: "Une équipe à votre écoute, disponible 7j/7 sur le terrain." },
  ];

  const milestones = [
    { year: "2015", title: "Création d'Iroko Express", description: "Lancement des activités de transit à Kinshasa." },
    { year: "2017", title: "Expansion Chine", description: "Ouverture d'un bureau de sourcing à Guangzhou." },
    { year: "2019", title: "Corridor Cameroun", description: "Partenariat stratégique avec le port de Douala." },
    { year: "2021", title: "Plateforme digitale", description: "Lancement du suivi en ligne pour tous les clients." },
    { year: "2023", title: "+5 000 expéditions", description: "Cap symbolique franchi avec un taux de satisfaction de 98%." },
    { year: "2025", title: "Leader régional", description: "Reconnaissance comme acteur majeur du transit en Afrique centrale." },
  ];

  const team = [
    { name: "Patrick Mbaya", role: "CEO & Fondateur", initials: "PM" },
    { name: "Li Wei", role: "Directrice Sourcing Chine", initials: "LW" },
    { name: "Aimée Tshimanga", role: "Responsable Douane", initials: "AT" },
    { name: "Jean-Claude Fouda", role: "Directeur Logistique Cameroun", initials: "JF" },
  ];

  const stats = [
    { icon: Award, value: "10+", label: t("stats.years") },
    { icon: Globe, value: "3", label: t("stats.countries") },
    { icon: TrendingUp, value: "5 000+", label: t("stats.shipments") },
    { icon: Users, value: "1 200+", label: t("stats.clients") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary relative overflow-hidden pt-40 pb-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-20" ref={heroRef}>
          <motion.span initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-accent text-xs font-bold uppercase tracking-widest block mb-6">
            {t("about_page.title")}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase text-surface-foreground leading-[0.85] mb-6">
            {t("about_page.title")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="text-surface-foreground/50 text-lg lg:text-xl max-w-2xl font-light">
            {t("about_page.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* Mission + Stats */}
      <section className="py-24 bg-background">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-accent text-xs font-bold uppercase tracking-widest block mb-4">Mission</span>
            <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-tighter text-foreground mb-6">{t("about_page.missionTitle")}</h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed">{t("about_page.missionDesc")}</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-background p-8 text-center">
                <p className="text-4xl font-bold tabular-nums text-foreground mb-1">{stat.value}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary" ref={valuesRef}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}} className="text-4xl lg:text-5xl font-bold uppercase tracking-tighter text-surface-foreground text-center mb-16">
            {t("about_page.valuesTitle")}
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-surface-foreground/5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="bg-surface-foreground/[0.02] p-10 text-center group hover:bg-primary transition-colors duration-500">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-5 group-hover:text-primary-foreground transition-colors" />
                  <h3 className="font-bold text-lg uppercase tracking-wider text-surface-foreground mb-2 group-hover:text-primary-foreground transition-colors">{v.title}</h3>
                  <p className="text-surface-foreground/50 text-sm group-hover:text-primary-foreground/70 transition-colors">{v.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-background" ref={timelineRef}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={timelineInView ? { opacity: 1, y: 0 } : {}} className="text-4xl lg:text-5xl font-bold uppercase tracking-tighter text-foreground text-center mb-20">
            {t("about_page.timelineTitle")}
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-0">
            {milestones.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, y: 20 }} animate={timelineInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="flex gap-8 py-8 border-b border-border group hover:bg-muted/50 px-4 -mx-4 transition-colors">
                <span className="text-3xl font-bold tabular-nums text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 w-20">
                  {m.year}
                </span>
                <div>
                  <h3 className="font-bold text-lg uppercase tracking-tight text-foreground">{m.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{m.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-secondary" ref={teamRef}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={teamInView ? { opacity: 1, y: 0 } : {}} className="text-4xl lg:text-5xl font-bold uppercase tracking-tighter text-surface-foreground text-center mb-16">
            {t("about_page.teamTitle")}
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-surface-foreground/5">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} animate={teamInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="bg-surface-foreground/[0.02] p-10 text-center group">
                <div className="w-20 h-20 border border-primary/30 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/10 transition-colors">
                  <span className="font-bold text-xl text-primary">{member.initials}</span>
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-surface-foreground">{member.name}</h3>
                <p className="text-surface-foreground/40 text-xs uppercase tracking-widest mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
