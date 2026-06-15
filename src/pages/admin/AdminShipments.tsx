import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";
import {
  Plus, Search, Loader2, ArrowUpDown, ChevronLeft, ChevronRight, Package, ExternalLink,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

type Shipment = Tables<"shipments">;

const STATUS_LABELS: Record<string, string> = {
  created: "Created", in_transit: "In Transit", customs: "Customs", delivered: "Delivered", blocked: "Blocked",
};
const STATUS_TONES: Record<string, "neutral" | "info" | "warning" | "success" | "danger"> = {
  created: "neutral", in_transit: "info", customs: "warning", delivered: "success", blocked: "danger",
};
const ALL_STATUSES = ["created", "in_transit", "customs", "delivered", "blocked"] as const;
const PAGE_SIZE = 10;

type SortKey = "created_at" | "tracking_number" | "client_name" | "destination" | "status";

const AdminShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newForm, setNewForm] = useState({
    tracking_number: "", client_name: "", client_email: "", origin: "", destination: "",
    cargo_type: "", weight_kg: "", estimated_delivery: "", notes: "",
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("shipments").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Failed to load shipments");
    setShipments(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { setPage(1); }, [search, filterStatus]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const out = shipments.filter((s) => {
      const matchSearch = !q || s.tracking_number.toLowerCase().includes(q) ||
        s.client_name.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || s.status === filterStatus;
      return matchSearch && matchStatus;
    });
    out.sort((a: any, b: any) => {
      const av = a[sortKey] ?? ""; const bv = b[sortKey] ?? "";
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return out;
  }, [shipments, search, filterStatus, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
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
    if (error) toast.error("Error creating shipment", { description: error.message });
    else {
      toast.success("Shipment created");
      setCreating(false);
      setNewForm({ tracking_number: "", client_name: "", client_email: "", origin: "", destination: "", cargo_type: "", weight_kg: "", estimated_delivery: "", notes: "" });
      load();
    }
    setSaving(false);
  };

  const SortHeader = ({ k, children }: { k: SortKey; children: React.ReactNode }) => (
    <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-foreground transition">
      {children} <ArrowUpDown className={`w-3 h-3 ${sortKey === k ? "text-primary" : "opacity-50"}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Shipments</h2>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} total · manage tracking, status and customers</p>
        </div>
        <Button onClick={() => setCreating(true)} className="bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]">
          <Plus className="w-4 h-4 mr-2" /> New shipment
        </Button>
      </div>

      {/* Filters */}
      <Card className="card-premium border-0">
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tracking, client, route..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-background" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-44 bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="card-premium border-0 overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Package} title="No shipments" description="Create your first shipment to start tracking." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium"><SortHeader k="tracking_number">Tracking</SortHeader></th>
                    <th className="text-left px-4 py-3 font-medium"><SortHeader k="client_name">Client</SortHeader></th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Route</th>
                    <th className="text-left px-4 py-3 font-medium"><SortHeader k="status">Status</SortHeader></th>
                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell"><SortHeader k="created_at">Created</SortHeader></th>
                    <th className="w-12 px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                      <td className="px-4 py-3">
                        <Link to={`/admin/colis/${s.id}`} className="font-mono text-xs font-semibold text-foreground hover:text-primary">
                          {s.tracking_number}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-foreground">{s.client_name}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                        {s.origin} → {s.destination}
                      </td>
                      <td className="px-4 py-3"><StatusBadge tone={STATUS_TONES[s.status]} dot>{STATUS_LABELS[s.status]}</StatusBadge></td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell text-xs">
                        {format(new Date(s.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/colis/${s.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm">
              <p className="text-muted-foreground text-xs">
                Page {page} of {totalPages} · {filtered.length} results
              </p>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create */}
      <Sheet open={creating} onOpenChange={setCreating}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-display">New shipment</SheetTitle>
          </SheetHeader>
          <form onSubmit={createShipment} className="mt-6 space-y-4">
            {[
              { key: "tracking_number", label: "Tracking number", required: true },
              { key: "client_name", label: "Client name", required: true },
              { key: "client_email", label: "Client email" },
              { key: "origin", label: "Origin", required: true },
              { key: "destination", label: "Destination", required: true },
              { key: "cargo_type", label: "Cargo type" },
              { key: "weight_kg", label: "Weight (kg)", type: "number" },
              { key: "estimated_delivery", label: "Estimated delivery", type: "date" },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label>{f.label}{f.required && " *"}</Label>
                <Input type={(f as any).type || "text"} value={(newForm as any)[f.key]}
                  onChange={(e) => setNewForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  required={(f as any).required} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea value={newForm.notes} onChange={(e) => setNewForm((p) => ({ ...p, notes: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]" disabled={saving}>
              {saving && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
              {saving ? "Creating..." : "Create shipment"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminShipments;
