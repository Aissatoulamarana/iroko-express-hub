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
      <section className="section-dark relative overflow-hidden pt-32 pb-20">
        <div className="grain-overlay" />
        <div className="container mx-auto px-4 lg:px-8 relative z-20" ref={heroRef}>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-primary font-semibold tracking-widest uppercase text-sm mb-4">
            {t("about_page.title")}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl text-surface-foreground leading-tight mb-6">
            {t("about_page.title")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="text-surface-foreground/70 text-lg md:text-xl max-w-2xl">
            {t("about_page.subtitle")}
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-6">{t("about_page.missionTitle")}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">{t("about_page.missionDesc")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-6 text-center hover-lift">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="font-display font-extrabold text-3xl text-foreground">{stat.value}</p>
                  <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-light py-20" ref={valuesRef}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}} className="font-display font-bold text-3xl md:text-4xl text-foreground text-center mb-12">
            {t("about_page.valuesTitle")}
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-8 text-center hover-lift">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5"><Icon className="w-7 h-7 text-primary" /></div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm">{v.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background" ref={timelineRef}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={timelineInView ? { opacity: 1, y: 0 } : {}} className="font-display font-bold text-3xl md:text-4xl text-foreground text-center mb-16">
            {t("about_page.timelineTitle")}
          </motion.h2>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
            {milestones.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} animate={timelineInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.12 }} className={`relative flex items-start mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1/2 mt-2 z-10" />
                <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:mr-auto md:pr-8 md:text-right" : "md:ml-auto md:pl-8"}`}>
                  <span className="inline-flex items-center gap-1 text-primary font-mono-track font-semibold text-sm mb-1"><Calendar className="w-3.5 h-3.5" /> {m.year}</span>
                  <h3 className="font-display font-bold text-lg text-foreground">{m.title}</h3>
                  <p className="text-muted-foreground text-sm">{m.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark py-20 relative overflow-hidden" ref={teamRef}>
        <div className="grain-overlay" />
        <div className="container mx-auto px-4 lg:px-8 relative z-20">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={teamInView ? { opacity: 1, y: 0 } : {}} className="font-display font-bold text-3xl md:text-4xl text-surface-foreground text-center mb-12">
            {t("about_page.teamTitle")}
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} animate={teamInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="glass-card p-8 text-center group">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                  <span className="font-display font-bold text-xl text-primary">{member.initials}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-surface-foreground">{member.name}</h3>
                <p className="text-surface-foreground/60 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
