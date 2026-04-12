import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, MapPin, Clock, Weight, Truck, Loader2, AlertCircle, CheckCircle, Shield, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import type { Database } from "@/integrations/supabase/types";

type ShipmentStatus = Database["public"]["Enums"]["shipment_status"];

interface Shipment {
  id: string; tracking_number: string; client_name: string; origin: string; destination: string;
  cargo_type: string | null; weight_kg: number | null; status: ShipmentStatus; estimated_delivery: string | null; created_at: string;
}

interface ShipmentEvent {
  id: string; status: ShipmentStatus; location: string | null; description: string | null; timestamp: string;
}

const statusConfig: Record<ShipmentStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  created: { label: "Créé", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30", icon: Package },
  in_transit: { label: "En transit", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30", icon: Truck },
  customs: { label: "En douane", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30", icon: Shield },
  delivered: { label: "Livré", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", icon: CheckCircle },
  blocked: { label: "Bloqué", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", icon: Ban },
};

const TrackingPage = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<ShipmentEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true); setError(null); setShipment(null); setEvents([]); setSearched(true);
    try {
      const { data: shipmentData, error: shipErr } = await supabase.from("shipments_public").select("*").eq("tracking_number", trimmed).maybeSingle();
      if (shipErr) throw shipErr;
      if (!shipmentData) { setError(t("tracking_page.notFound")); setLoading(false); return; }
      setShipment(shipmentData as Shipment);
      const { data: eventsData, error: evErr } = await supabase.from("shipment_events").select("*").eq("shipment_id", shipmentData.id).order("timestamp", { ascending: true });
      if (evErr) throw evErr;
      setEvents((eventsData as ShipmentEvent[]) || []);
    } catch {
      setError(t("tracking_page.error"));
    } finally {
      setLoading(false);
    }
  };

  const cfg = shipment ? statusConfig[shipment.status] : null;

  return (
    <section className="min-h-screen pt-28 pb-20">
      <div className="section-dark py-16 lg:py-24 relative">
        <div className="grain-overlay" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
              <MapPin size={14} />
              {t("tracking_page.title")}
            </span>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-surface-foreground mb-4">
              {t("tracking_page.title")}
            </h1>
            <p className="text-surface-foreground/60 text-lg max-w-xl mx-auto">{t("tracking_page.subtitle")}</p>
          </motion.div>
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-foreground/30" />
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("tracking_page.placeholder")} className="w-full bg-surface-foreground/5 border border-surface-foreground/10 rounded-xl pl-12 pr-4 py-4 text-lg font-mono text-surface-foreground placeholder:text-surface-foreground/25 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <Button type="submit" variant="hero" size="xl" disabled={loading || !query.trim()}>
                {loading ? <Loader2 size={20} className="animate-spin" /> : t("tracking_page.search")}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-20">
              <Loader2 size={40} className="animate-spin text-primary" />
            </motion.div>
          )}
          {error && !loading && (
            <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-lg mx-auto text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6"><AlertCircle size={32} className="text-accent" /></div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2">{t("tracking_page.notFound")}</h3>
              <p className="text-muted-foreground">{error}</p>
            </motion.div>
          )}
          {shipment && !loading && cfg && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="font-mono font-bold text-2xl text-foreground">{shipment.tracking_number}</h2>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-semibold ${cfg.bg} ${cfg.color}`}><cfg.icon size={14} />{cfg.label}</span>
                    </div>
                    <p className="text-muted-foreground">{shipment.client_name}</p>
                  </div>
                  {shipment.estimated_delivery && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-4 py-2">
                      <Clock size={16} />
                      <span>{t("tracking_page.estimated")}: <strong className="text-foreground">{new Date(shipment.estimated_delivery).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong></span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InfoCard icon={MapPin} label={t("tracking_page.origin")} value={shipment.origin} />
                  <InfoCard icon={MapPin} label={t("tracking_page.destination")} value={shipment.destination} />
                  <InfoCard icon={Package} label={t("tracking_page.type")} value={shipment.cargo_type || "—"} />
                  <InfoCard icon={Weight} label={t("tracking_page.weight")} value={shipment.weight_kg ? `${shipment.weight_kg} kg` : "—"} />
                </div>
              </div>
              {events.length > 0 && (
                <div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-8">{t("tracking_page.timeline")}</h3>
                  <div className="relative">
                    <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-border" />
                    <div className="space-y-0">
                      {[...events].reverse().map((event, i) => {
                        const evCfg = statusConfig[event.status];
                        const isLatest = i === 0;
                        return (
                          <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} className="relative flex gap-6 pb-8 last:pb-0">
                            <div className={`relative z-10 mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isLatest ? "bg-primary shadow-lg shadow-primary/30" : "bg-muted border border-border"}`}>
                              <evCfg.icon size={18} className={isLatest ? "text-primary-foreground" : evCfg.color} />
                            </div>
                            <div className={`flex-1 rounded-xl p-4 ${isLatest ? "bg-primary/5 border border-primary/20" : "bg-muted/50"}`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                <span className={`font-semibold text-sm ${isLatest ? "text-primary" : "text-foreground"}`}>{evCfg.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(event.timestamp).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                                  {" · "}
                                  {new Date(event.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                              {event.location && <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1"><MapPin size={12} />{event.location}</div>}
                              {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          {searched && !loading && !error && !shipment && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-muted-foreground">
              {t("tracking_page.noEvents")}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const InfoCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="bg-muted/50 rounded-xl p-4">
    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Icon size={14} />{label}</div>
    <div className="font-semibold text-sm text-foreground">{value}</div>
  </div>
);

export default TrackingPage;
