import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Quote = Tables<"quotes">;

const statusOptions = ["new", "in_progress", "sent", "accepted", "refused"];
const statusLabels: Record<string, string> = {
  new: "Nouveau", in_progress: "En cours", sent: "Envoyé", accepted: "Accepté", refused: "Refusé",
};
const statusColors: Record<string, string> = {
  new: "bg-primary/15 text-foreground border border-primary/30",
  in_progress: "bg-info/15 text-info border border-info/20",
  sent: "bg-warning/15 text-[hsl(var(--warning-foreground))] border border-warning/30",
  accepted: "bg-success/15 text-success border border-success/20",
  refused: "bg-destructive/15 text-destructive border border-destructive/20",
};

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Quote | null>(null);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });
    setQuotes(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openDetail = (q: Quote) => {
    setSelected(q);
    setNotes(q.admin_notes || "");
  };

  const updateQuote = async (id: string, updates: Partial<Quote>) => {
    await supabase.from("quotes").update(updates).eq("id", id);
    toast({ title: "Devis mis à jour" });
    load();
  };

  const filtered = quotes.filter((q) =>
    !search || q.name.toLowerCase().includes(search.toLowerCase()) || q.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-foreground">Devis reçus</h1>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher par nom ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border text-foreground" />
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-6 h-6" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Aucun devis.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-4">Nom</th>
                    <th className="text-left p-4 hidden md:table-cell">Type</th>
                    <th className="text-left p-4 hidden md:table-cell">Email</th>
                    <th className="text-left p-4">Statut</th>
                    <th className="text-left p-4 hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q) => (
                    <tr key={q.id} onClick={() => openDetail(q)} className="border-b border-border/60 hover:bg-card cursor-pointer transition">
                      <td className="p-4 text-foreground font-medium">{q.name}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell capitalize">{q.type}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{q.email}</td>
                      <td className="p-4"><Badge className={statusColors[q.status] || ""}>{statusLabels[q.status] || q.status}</Badge></td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell">{new Date(q.created_at).toLocaleDateString("fr")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="bg-background border-border text-foreground w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader><SheetTitle className="text-foreground font-display">Devis de {selected.name}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-muted-foreground">Type</span><p className="capitalize">{selected.type}</p></div>
                  <div><span className="text-muted-foreground">Urgence</span><p>{selected.urgency || "—"}</p></div>
                  <div><span className="text-muted-foreground">Origine</span><p>{selected.origin || "—"}</p></div>
                  <div><span className="text-muted-foreground">Destination</span><p>{selected.destination || "—"}</p></div>
                  <div><span className="text-muted-foreground">Cargo</span><p>{selected.cargo_type || "—"}</p></div>
                  <div><span className="text-muted-foreground">Poids</span><p>{selected.weight || "—"}</p></div>
                  <div><span className="text-muted-foreground">Email</span><p>{selected.email}</p></div>
                  <div><span className="text-muted-foreground">Téléphone</span><p>{selected.phone || "—"}</p></div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Statut</Label>
                  <Select value={selected.status} onValueChange={(v) => { updateQuote(selected.id, { status: v }); setSelected({ ...selected, status: v }); }}>
                    <SelectTrigger className="bg-card border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Notes internes</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-card border-border text-foreground" rows={4} />
                  <Button size="sm" onClick={() => updateQuote(selected.id, { admin_notes: notes })} className="bg-primary text-primary-foreground">Sauvegarder</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminQuotes;
