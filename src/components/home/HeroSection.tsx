import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, ShieldCheck, Clock4, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState("");

  const onTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const q = tracking.trim();
    navigate(q ? `/suivi?n=${encodeURIComponent(q)}` : "/suivi");
  };

  const trust = [
    { icon: ShieldCheck, label: t("hero.trust1", "Dédouanement certifié") },
    { icon: Clock4, label: t("hero.trust2", "Suivi temps réel 24/7") },
    { icon: Globe2, label: t("hero.trust3", "Réseau Asie · Afrique") },
  ];

  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-background">
      {/* Decorative grid + glow */}
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="absolute -top-40 right-0 w-[40rem] h-[40rem] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-32 w-[30rem] h-[30rem] rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

      <div className="container relative mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left: copy + tracking */}
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/5 border border-border text-secondary text-xs font-semibold uppercase tracking-wider"
            >
              <span className="status-dot bg-success animate-pulse" />
              {t("hero.badge")}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display text-foreground mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.02]"
            >
              {t("hero.title")} <span className="text-gradient-primary">{t("hero.titleHighlight")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-6 text-muted-foreground text-lg lg:text-xl max-w-xl leading-relaxed"
            >
              {t("hero.description")}
            </motion.p>

            {/* Tracking search */}
            <motion.form
              onSubmit={onTrack}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 p-2 bg-card border border-border rounded-2xl shadow-soft-lg flex flex-col sm:flex-row gap-2 max-w-xl"
            >
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search size={18} className="text-muted-foreground shrink-0" />
                <input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder={t("tracking_page.placeholder")}
                  className="w-full bg-transparent py-3 text-base font-mono-track tracking-wide text-foreground placeholder:text-muted-foreground/60 focus:outline-none uppercase"
                />
              </div>
              <Button type="submit" variant="default" size="lg" className="rounded-xl">
                {t("hero.cta2")}
                <ArrowRight size={18} />
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-6 flex flex-wrap gap-x-6 gap-y-3"
            >
              <Button variant="outline" size="default" asChild>
                <Link to="/devis">{t("hero.cta1")}</Link>
              </Button>
              {trust.map((it) => (
                <div key={it.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <it.icon size={16} className="text-primary" />
                  <span className="font-medium text-foreground/80">{it.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: visual mock card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              {/* Floating cards stack */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-3xl rotate-3" />
              <div className="absolute inset-0 bg-secondary rounded-3xl -rotate-2 shadow-soft-xl" />
              <div className="absolute inset-0 bg-card rounded-3xl shadow-soft-xl border border-border p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center font-display text-primary-foreground">IE</div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("hero.mockLabel", "Suivi en direct")}</p>
                      <p className="font-mono-track text-sm font-semibold text-foreground">IE-2026-08421</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-[hsl(var(--success))] text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                    {t("hero.mockStatus", "En transit")}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("tracking_page.origin")}</p>
                    <p className="font-semibold text-foreground mt-1">Guangzhou 🇨🇳</p>
                  </div>
                  <div className="flex-1 mx-4 relative h-px bg-border">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 2, delay: 0.6 }}
                      className="absolute top-0 left-0 h-px bg-primary"
                    />
                    <motion.div
                      initial={{ left: "0%" }}
                      animate={{ left: "65%" }}
                      transition={{ duration: 2, delay: 0.6 }}
                      className="absolute -top-1.5 w-3 h-3 rounded-full bg-primary shadow-glow"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("tracking_page.destination")}</p>
                    <p className="font-semibold text-foreground mt-1">Kinshasa 🇨🇩</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {[
                    { k: t("hero.mockEta", "Livraison"), v: "12 jun" },
                    { k: t("tracking_page.weight"), v: "248 kg" },
                    { k: t("tracking_page.type"), v: "Cargo" },
                  ].map((s) => (
                    <div key={s.k} className="bg-surface-muted rounded-xl p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</p>
                      <p className="font-mono-track text-sm font-semibold text-foreground mt-0.5">{s.v}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex-1 space-y-3">
                  {[
                    { label: t("hero.step1", "Pris en charge"), done: true, time: "08 jun · 09:42" },
                    { label: t("hero.step2", "Dédouanement Shenzhen"), done: true, time: "09 jun · 14:10" },
                    { label: t("hero.step3", "En transit aérien"), done: true, time: "10 jun · 22:55", active: true },
                    { label: t("hero.step4", "Arrivée Kinshasa"), done: false, time: "12 jun" },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`relative w-2.5 h-2.5 rounded-full shrink-0 ${s.done ? "bg-primary" : "bg-border"}`}>
                        {s.active && <span className="absolute inset-0 rounded-full bg-primary animate-ping" />}
                      </div>
                      <div className="flex-1 flex items-center justify-between gap-2">
                        <p className={`text-xs ${s.done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s.label}</p>
                        <p className="text-[10px] font-mono-track text-muted-foreground">{s.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
