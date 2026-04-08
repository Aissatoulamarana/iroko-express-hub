import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Shipment = Tables<"shipments">;
type ShipmentEvent = Tables<"shipment_events">;

const statusColors: Record<string, string> = {
  created: "bg-muted text-muted-foreground",
  in_transit: "bg-sky-500/20 text-sky-400",
  customs: "bg-amber-500/20 text-amber-400",
  delivered: "bg-emerald-500/20 text-emerald-400",
  blocked: "bg-red-500/20 text-red-400",
};
const statusLabels: Record<string, string> = {
  created: "Créé", in_transit: "En transit", customs: "En douane", delivered: "Livré", blocked: "Bloqué",
};
const allStatuses = ["created", "in_transit", "customs", "delivered", "blocked"] as const;

const AdminShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<ShipmentEvent[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // New shipment form
  const [newForm, setNewForm] = useState({
    tracking_number: "", client_name: "", client_email: "", origin: "", destination: "",
    cargo_type: "", weight_kg: "", estimated_delivery: "", notes: "",
  });

  const loadShipments = async () => {
    setLoading(true);
    const { data } = await supabase.from("shipments").select("*").order("created_at", { ascending: false });
    setShipments(data ?? []);
    setLoading(false);
  };

  useEffect(() => { loadShipments(); }, []);

  const openDetail = async (s: Shipment) => {
    setSelected(s);
    setDrawerOpen(true);
    const { data } = await supabase.from("shipment_events").select("*").eq("shipment_id", s.id).order("timestamp", { ascending: false });
    setEvents(data ?? []);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("shipments").update({ status: status as any }).eq("id", id);
    toast({ title: "Statut mis à jour" });
    loadShipments();
    if (selected?.id === id) setSelected({ ...selected, status: status as any });
  };

  const createShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("shipments").insert({
      tracking_number: newForm.tracking_number,
      client_name: newForm.client_name,
      client_email: newForm.client_email || null,
      origin: newForm.origin,
      destination: newForm.destination,
      cargo_type: newForm.cargo_type || null,
      weight_kg: newForm.weight_kg ? parseFloat(newForm.weight_kg) : null,
      estimated_delivery: newForm.estimated_delivery || null,
      notes: newForm.notes || null,
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Colis créé !" });
      setCreating(false);
      setNewForm({ tracking_number: "", client_name: "", client_email: "", origin: "", destination: "", cargo_type: "", weight_kg: "", estimated_delivery: "", notes: "" });
      loadShipments();
    }
    setSaving(false);
  };

  const filtered = shipments.filter((s) => {
    const matchSearch = !search || s.tracking_number.toLowerCase().includes(search.toLowerCase()) || s.client_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display font-bold text-2xl text-surface-foreground">Colis & Suivi</h1>
        <Button onClick={() => setCreating(true)} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Nouveau colis
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-foreground/40" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-surface-foreground/5 border-surface-foreground/10 text-surface-foreground"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterStatus("all")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${filterStatus === "all" ? "bg-primary text-primary-foreground" : "bg-surface-foreground/10 text-surface-foreground/60"}`}>Tous</button>
          {allStatuses.map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-surface-foreground/10 text-surface-foreground/60"}`}>
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="bg-surface-foreground/5 border-surface-foreground/10 overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-6 h-6" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-surface-foreground/40 py-12">Aucun colis trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-foreground/10 text-surface-foreground/50">
                    <th className="text-left p-4">Tracking</th>
                    <th className="text-left p-4">Client</th>
                    <th className="text-left p-4 hidden md:table-cell">Origine</th>
                    <th className="text-left p-4 hidden md:table-cell">Destination</th>
                    <th className="text-left p-4">Statut</th>
                    <th className="text-left p-4 hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} onClick={() => openDetail(s)} className="border-b border-surface-foreground/5 hover:bg-surface-foreground/5 cursor-pointer transition">
                      <td className="p-4 font-mono text-primary font-semibold text-xs">{s.tracking_number}</td>
                      <td className="p-4 text-surface-foreground">{s.client_name}</td>
                      <td className="p-4 text-surface-foreground/60 hidden md:table-cell">{s.origin}</td>
                      <td className="p-4 text-surface-foreground/60 hidden md:table-cell">{s.destination}</td>
                      <td className="p-4"><Badge className={statusColors[s.status]}>{statusLabels[s.status]}</Badge></td>
                      <td className="p-4 text-surface-foreground/40 hidden lg:table-cell">{new Date(s.created_at).toLocaleDateString("fr")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="bg-surface border-surface-foreground/10 text-surface-foreground w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-surface-foreground font-display">{selected.tracking_number}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-surface-foreground/50">Client</span><p>{selected.client_name}</p></div>
                  <div><span className="text-surface-foreground/50">Email</span><p>{selected.client_email || "—"}</p></div>
                  <div><span className="text-surface-foreground/50">Origine</span><p>{selected.origin}</p></div>
                  <div><span className="text-surface-foreground/50">Destination</span><p>{selected.destination}</p></div>
                  <div><span className="text-surface-foreground/50">Type cargo</span><p>{selected.cargo_type || "—"}</p></div>
                  <div><span className="text-surface-foreground/50">Poids</span><p>{selected.weight_kg ? `${selected.weight_kg} kg` : "—"}</p></div>
                </div>

                <div className="space-y-2">
                  <Label className="text-surface-foreground/60">Mettre à jour le statut</Label>
                  <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v)}>
                    <SelectTrigger className="bg-surface-foreground/5 border-surface-foreground/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allStatuses.map((s) => (
                        <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-lg mb-3">Historique</h3>
                  {events.length === 0 ? (
                    <p className="text-surface-foreground/40 text-sm">Aucun événement.</p>
                  ) : (
                    <div className="space-y-3">
                      {events.map((ev) => (
                        <div key={ev.id} className="flex gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <p className="text-surface-foreground">{ev.description}</p>
                            <p className="text-surface-foreground/40 text-xs">{ev.location} — {new Date(ev.timestamp).toLocaleString("fr")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create modal */}
      <Sheet open={creating} onOpenChange={setCreating}>
        <SheetContent className="bg-surface border-surface-foreground/10 text-surface-foreground w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-surface-foreground font-display">Nouveau colis</SheetTitle>
          </SheetHeader>
          <form onSubmit={createShipment} className="mt-6 space-y-4">
            {[
              { key: "tracking_number", label: "N° de suivi", required: true },
              { key: "client_name", label: "Nom du client", required: true },
              { key: "client_email", label: "Email client" },
              { key: "origin", label: "Origine", required: true },
              { key: "destination", label: "Destination", required: true },
              { key: "cargo_type", label: "Type de cargo" },
              { key: "weight_kg", label: "Poids (kg)", type: "number" },
              { key: "estimated_delivery", label: "Livraison estimée", type: "date" },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-surface-foreground/60">{f.label}{f.required && " *"}</Label>
                <Input
                  type={f.type || "text"}
                  value={(newForm as any)[f.key]}
                  onChange={(e) => setNewForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  className="bg-surface-foreground/5 border-surface-foreground/10 text-surface-foreground"
                  required={f.required}
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-surface-foreground/60">Notes</Label>
              <Textarea
                value={newForm.notes}
                onChange={(e) => setNewForm((p) => ({ ...p, notes: e.target.value }))}
                className="bg-surface-foreground/5 border-surface-foreground/10 text-surface-foreground"
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={saving}>
              {saving ? <Loader2 className="animate-spin mr-2" /> : null}
              {saving ? "Création..." : "Créer le colis"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminShipments;
