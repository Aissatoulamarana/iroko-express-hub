import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Client = Tables<"clients">;

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", country: "" });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    setClients(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("clients").insert({
      name: form.name, company: form.company || null, email: form.email || null,
      phone: form.phone || null, country: form.country || null,
    });
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else { toast({ title: "Client ajouté" }); setCreating(false); setForm({ name: "", company: "", email: "", phone: "", country: "" }); load(); }
    setSaving(false);
  };

  const filtered = clients.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display font-bold text-2xl text-surface-foreground">Clients</h1>
        <Button onClick={() => setCreating(true)} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Nouveau client
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-foreground/40" />
        <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-surface-foreground/5 border-surface-foreground/10 text-surface-foreground" />
      </div>

      <Card className="bg-surface-foreground/5 border-surface-foreground/10 overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-6 h-6" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-surface-foreground/40 py-12">Aucun client.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-foreground/10 text-surface-foreground/50">
                    <th className="text-left p-4">Nom</th>
                    <th className="text-left p-4 hidden md:table-cell">Entreprise</th>
                    <th className="text-left p-4 hidden md:table-cell">Email</th>
                    <th className="text-left p-4 hidden lg:table-cell">Pays</th>
                    <th className="text-left p-4 hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-surface-foreground/5 hover:bg-surface-foreground/5 transition">
                      <td className="p-4 text-surface-foreground font-medium">{c.name}</td>
                      <td className="p-4 text-surface-foreground/60 hidden md:table-cell">{c.company || "—"}</td>
                      <td className="p-4 text-surface-foreground/60 hidden md:table-cell">{c.email || "—"}</td>
                      <td className="p-4 text-surface-foreground/60 hidden lg:table-cell">{c.country || "—"}</td>
                      <td className="p-4 text-surface-foreground/40 hidden lg:table-cell">{new Date(c.created_at).toLocaleDateString("fr")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={creating} onOpenChange={setCreating}>
        <SheetContent className="bg-surface border-surface-foreground/10 text-surface-foreground w-full sm:max-w-lg">
          <SheetHeader><SheetTitle className="text-surface-foreground font-display">Nouveau client</SheetTitle></SheetHeader>
          <form onSubmit={create} className="mt-6 space-y-4">
            {[
              { key: "name", label: "Nom *", required: true },
              { key: "company", label: "Entreprise" },
              { key: "email", label: "Email", type: "email" },
              { key: "phone", label: "Téléphone" },
              { key: "country", label: "Pays" },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-surface-foreground/60">{f.label}</Label>
                <Input type={f.type || "text"} value={(form as any)[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} className="bg-surface-foreground/5 border-surface-foreground/10 text-surface-foreground" required={f.required} />
              </div>
            ))}
            <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={saving}>
              {saving ? <Loader2 className="animate-spin mr-2" /> : null}
              {saving ? "Création..." : "Ajouter le client"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminClients;
