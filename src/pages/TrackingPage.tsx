import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
  Search, Package, MapPin, Clock, Weight, Truck, Loader2, AlertCircle,
  CheckCircle, Shield, Ban, ArrowRight, Calendar, User, Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import type { Database } from "@/integrations/supabase/types";

type ShipmentStatus = Database["public"]["Enums"]["shipment_status"];

interface Shipment {
  id: string; tracking_number: string; client_name: string; origin: string; destination: string;
  cargo_type: string | null; weight_kg: number | null; status: ShipmentStatus;
  estimated_delivery: string | null; created_at: string;
}
interface ShipmentEvent {
  id: string; status: ShipmentStatus; location: string | null;
  description: string | null; timestamp: string;
}

const statusConfig: Record<ShipmentStatus, { label: string; tone: string; icon: React.ElementType; progress: number }> = {
  created:    { label: "Créé",       tone: "info",        icon: Package,     progress: 15 },
  in_transit: { label: "En transit", tone: "warning",     icon: Truck,       progress: 55 },
  customs:    { label: "En douane",  tone: "warning",     icon: Shield,      progress: 75 },
  delivered:  { label: "Livré",      tone: "success",     icon: CheckCircle, progress: 100 },
  blocked:    { label: "Bloqué",     tone: "destructive", icon: Ban,         progress: 50 },
};

const toneClass = (tone: string) => {
  switch (tone) {
    case "success": return "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20";
    case "warning": return "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20";
    case "info":    return "bg-[hsl(var(--info))]/10 text-[hsl(var(--info))] border-[hsl(var(--info))]/20";
    case "destructive": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-foreground border-border";
  }
};

const TrackingPage = () => {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("n") ?? "");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<ShipmentEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async (trimmed: string) => {
    if (!trimmed) return;
    setLoading(true); setError(null); setShipment(null); setEvents([]); setSearched(true);
    try {
      const { data: shipmentData, error: shipErr } = await supabase
        .from("shipments_public").select("*").eq("tracking_number", trimmed).maybeSingle();
      if (shipErr) throw shipErr;
      if (!shipmentData) { setError(t("tracking_page.notFound")); setLoading(false); return; }
      setShipment(shipmentData as Shipment);
      const { data: eventsData, error: evErr } = await supabase
        .from("shipment_events").select("*").eq("shipment_id", shipmentData.id).order("timestamp", { ascending: true });
      if (evErr) throw evErr;
      setEvents((eventsData as ShipmentEvent[]) || []);
    } catch {
      setError(t("tracking_page.error"));
    } finally {
      setLoading(false);
    }
  };

  // Auto-search if ?n= param present
  useEffect(() => {
    const n = params.get("n");
    if (n) { setQuery(n.toUpperCase()); runSearch(n.trim().toUpperCase()); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    if (!trimmed) return;
    setParams({ n: trimmed });
    runSearch(trimmed);
  };

  const cfg = shipment ? statusConfig[shipment.status] : null;
  const reversedEvents = [...events].reverse();

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      {/* Search header */}
      <section className="relative overflow-hidden border-b border-border bg-surface-subtle">
        <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="container relative mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-foreground text-xs font-semibold uppercase tracking-wider">
              <span className="status-dot bg-success animate-pulse" />
              {t("tracking_page.live", "Suivi en temps réel")}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-5 leading-tight">
              {t("tracking_page.title")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mt-4">
              {t("tracking_page.subtitle")}
            </p>

            <form onSubmit={handleSearch} className="mt-8 p-2 bg-card border border-border rounded-2xl shadow-soft-lg flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search size={20} className="text-muted-foreground shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("tracking_page.placeholder")}
                  className="w-full bg-transparent py-3 text-base sm:text-lg font-mono-track tracking-wide text-foreground placeholder:text-muted-foreground/60 focus:outline-none uppercase"
                  autoFocus
                />
              </div>
              <Button type="submit" size="lg" disabled={loading || !query.trim()} className="rounded-xl">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>{t("tracking_page.search")} <ArrowRight size={18} /></>}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <AnimatePresence mode="wait">
          {/* Loading skeleton */}
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-6">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[0,1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
              </div>
              <Skeleton className="h-72 w-full rounded-2xl" />
            </motion.div>
          )}

          {/* Not found / error */}
          {error && !loading && (
            <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-md mx-auto text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={28} className="text-destructive" />
              </div>
              <h3 className="font-display text-2xl text-foreground mb-2">{t("tracking_page.notFound")}</h3>
              <p className="text-muted-foreground mb-6">{t("tracking_page.notFoundHelp", "Vérifiez le numéro et réessayez. Les numéros commencent généralement par IE-")}</p>
              <Button variant="outline" onClick={() => { setError(null); setSearched(false); setQuery(""); setParams({}); }}>
                {t("tracking_page.tryAgain", "Nouvelle recherche")}
              </Button>
            </motion.div>
          )}

          {/* Empty initial state */}
          {!searched && !loading && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Package size={28} className="text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">{t("tracking_page.startTitle", "Suivez votre expédition")}</h3>
              <p className="text-muted-foreground">{t("tracking_page.startDesc", "Entrez votre numéro de suivi ci-dessus pour voir le statut, l'historique complet et la livraison estimée.")}</p>
            </motion.div>
          )}

          {/* Result */}
          {shipment && cfg && !loading && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-8">

              {/* Hero card */}
              <div className="bg-card border border-border rounded-2xl shadow-soft-md overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t("tracking_page.trackingNumber", "Numéro de suivi")}</p>
                      <h2 className="font-mono-track text-2xl md:text-3xl text-foreground font-bold">{shipment.tracking_number}</h2>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5"><User size={13} />{shipment.client_name}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${toneClass(cfg.tone)}`}>
                      <cfg.icon size={14} />{cfg.label}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-mono-track text-muted-foreground mb-2">
                      <span>{shipment.origin}</span>
                      <span className="font-semibold text-foreground">{cfg.progress}%</span>
                      <span>{shipment.destination}</span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cfg.progress}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute inset-y-0 left-0 rounded-full ${cfg.tone === "destructive" ? "bg-destructive" : "bg-primary"}`}
                      />
                    </div>
                  </div>

                  {/* ETA + route */}
                  {shipment.estimated_delivery && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <Calendar size={20} className="text-primary shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t("tracking_page.estimated")}</p>
                        <p className="font-semibold text-foreground">
                          {new Date(shipment.estimated_delivery).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoCard icon={MapPin} label={t("tracking_page.origin")} value={shipment.origin} />
                <InfoCard icon={MapPin} label={t("tracking_page.destination")} value={shipment.destination} />
                <InfoCard icon={Box} label={t("tracking_page.type")} value={shipment.cargo_type || "—"} />
                <InfoCard icon={Weight} label={t("tracking_page.weight")} value={shipment.weight_kg ? `${shipment.weight_kg} kg` : "—"} />
              </div>

              {/* Timeline */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-display text-xl text-foreground">{t("tracking_page.timeline")}</h3>
                  <span className="text-xs text-muted-foreground font-mono-track">{events.length} {t("tracking_page.events", "événements")}</span>
                </div>

                {events.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-sm">{t("tracking_page.noEvents")}</div>
                ) : (
                  <ol className="relative">
                    {reversedEvents.map((event, i) => {
                      const evCfg = statusConfig[event.status];
                      const isFirst = i === 0;
                      const isLast = i === reversedEvents.length - 1;
                      return (
                        <motion.li
                          key={event.id}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.06 }}
                          className="relative flex gap-5 pb-8 last:pb-0"
                        >
                          {!isLast && (
                            <span aria-hidden className={`absolute left-[19px] top-10 bottom-0 w-px ${isFirst ? "bg-primary/30" : "bg-border"}`} />
                          )}
                          <div className="relative z-10 shrink-0">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                              isFirst
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-card border-border text-muted-foreground"
                            }`}>
                              <evCfg.icon size={16} strokeWidth={2.5} />
                            </div>
                            {isFirst && <span aria-hidden className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />}
                          </div>
                          <div className={`flex-1 pt-1.5 min-w-0 ${isFirst ? "" : "opacity-70"}`}>
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                              <h4 className={`text-sm sm:text-base font-semibold ${isFirst ? "text-foreground" : "text-muted-foreground"}`}>
                                {evCfg.label}
                              </h4>
                              <time className="text-xs font-mono-track text-muted-foreground tabular-nums">
                                {new Date(event.timestamp).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                                {" · "}
                                {new Date(event.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                              </time>
                            </div>
                            {event.location && (
                              <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
                                <MapPin size={12} />{event.location}
                              </p>
                            )}
                            {event.description && (
                              <p className="mt-2 text-sm text-foreground/80 bg-surface-muted rounded-lg px-3 py-2 border border-border">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </motion.li>
                      );
                    })}
                  </ol>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><Icon size={13} />{label}</div>
    <div className="font-semibold text-sm text-foreground truncate">{value}</div>
  </div>
);

export default TrackingPage;
