import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, Edit2, Trash2, Clock, MapPin, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

type Shipment = Tables<"shipments">;
type Event = Tables<"shipment_events">;

const STATUS_LABELS: Record<string, string> = {
  created: "Created", in_transit: "In Transit", customs: "Customs", delivered: "Delivered", blocked: "Blocked",
};
const STATUS_TONES: Record<string, "neutral" | "info" | "warning" | "success" | "danger"> = {
  created: "neutral", in_transit: "info", customs: "warning", delivered: "success", blocked: "danger",
};
const ALL_STATUSES = ["created", "in_transit", "customs", "delivered", "blocked"] as const;

type EventForm = { status: string; location: string; description: string; timestamp: string };
const emptyEvent = (): EventForm => ({
  status: "in_transit", location: "", description: "",
  timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
});

const AdminShipmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [edits, setEdits] = useState<Partial<Shipment>>({});
  const [savingInfo, setSavingInfo] = useState(false);

  const [eventDialog, setEventDialog] = useState<{ open: boolean; mode: "create" | "edit"; data: EventForm; id?: string }>({
    open: false, mode: "create", data: emptyEvent(),
  });
  const [savingEvent, setSavingEvent] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const [shipRes, evRes] = await Promise.all([
      supabase.from("shipments").select("*").eq("id", id).maybeSingle(),
      supabase.from("shipment_events").select("*").eq("shipment_id", id).order("timestamp", { ascending: false }),
    ]);
    setShipment(shipRes.data);
    setEdits(shipRes.data ?? {});
    setEvents(evRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const saveInfo = async () => {
    if (!shipment) return;
    setSavingInfo(true);
    const { error } = await supabase.from("shipments").update({
      client_name: edits.client_name,
      client_email: edits.client_email,
      origin: edits.origin,
      destination: edits.destination,
      cargo_type: edits.cargo_type,
      weight_kg: edits.weight_kg,
      estimated_delivery: edits.estimated_delivery,
      status: edits.status as any,
      notes: edits.notes,
    }).eq("id", shipment.id);
    setSavingInfo(false);
    if (error) toast.error("Save failed", { description: error.message });
    else { toast.success("Shipment updated"); load(); }
  };

  const openCreateEvent = () => setEventDialog({ open: true, mode: "create", data: emptyEvent() });
  const openEditEvent = (ev: Event) => setEventDialog({
    open: true, mode: "edit", id: ev.id,
    data: {
      status: ev.status, location: ev.location ?? "", description: ev.description ?? "",
      timestamp: format(new Date(ev.timestamp), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const saveEvent = async () => {
    if (!id) return;
    setSavingEvent(true);
    const payload = {
      status: eventDialog.data.status as any,
      location: eventDialog.data.location || null,
      description: eventDialog.data.description || null,
      timestamp: new Date(eventDialog.data.timestamp).toISOString(),
    };
    const { error } = eventDialog.mode === "create"
      ? await supabase.from("shipment_events").insert({ ...payload, shipment_id: id })
      : await supabase.from("shipment_events").update(payload).eq("id", eventDialog.id!);
    setSavingEvent(false);
    if (error) toast.error("Event save failed", { description: error.message });
    else {
      toast.success(eventDialog.mode === "create" ? "Update added" : "Update edited");
      setEventDialog({ ...eventDialog, open: false });
      load();
    }
  };

  const deleteEvent = async (eventId: string) => {
    const { error } = await supabase.from("shipment_events").delete().eq("id", eventId);
    if (error) toast.error("Delete failed");
    else { toast.success("Update deleted"); load(); }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Shipment not found.</p>
        <Button asChild variant="link" className="mt-2"><Link to="/admin/colis">← Back to shipments</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/colis")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <p className="text-xs text-muted-foreground font-mono">SHIPMENT</p>
            <h2 className="font-display text-2xl font-bold text-foreground font-mono">{shipment.tracking_number}</h2>
          </div>
          <StatusBadge tone={STATUS_TONES[shipment.status]} dot pulse={shipment.status === "in_transit"} size="lg">
            {STATUS_LABELS[shipment.status]}
          </StatusBadge>
        </div>
        <Button onClick={saveInfo} disabled={savingInfo} className="bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]">
          {savingInfo ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Info */}
        <Card className="card-premium border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Shipment information</CardTitle>
            <CardDescription>Edit shipment fields and save when done.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <Field label="Client name"><Input value={edits.client_name ?? ""} onChange={(e) => setEdits({ ...edits, client_name: e.target.value })} /></Field>
            <Field label="Client email"><Input value={edits.client_email ?? ""} onChange={(e) => setEdits({ ...edits, client_email: e.target.value })} /></Field>
            <Field label="Origin"><Input value={edits.origin ?? ""} onChange={(e) => setEdits({ ...edits, origin: e.target.value })} /></Field>
            <Field label="Destination"><Input value={edits.destination ?? ""} onChange={(e) => setEdits({ ...edits, destination: e.target.value })} /></Field>
            <Field label="Cargo type"><Input value={edits.cargo_type ?? ""} onChange={(e) => setEdits({ ...edits, cargo_type: e.target.value })} /></Field>
            <Field label="Weight (kg)"><Input type="number" value={edits.weight_kg ?? ""} onChange={(e) => setEdits({ ...edits, weight_kg: e.target.value ? parseFloat(e.target.value) : null })} /></Field>
            <Field label="Estimated delivery"><Input type="date" value={edits.estimated_delivery ?? ""} onChange={(e) => setEdits({ ...edits, estimated_delivery: e.target.value })} /></Field>
            <Field label="Status">
              <Select value={edits.status} onValueChange={(v) => setEdits({ ...edits, status: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Internal notes">
                <Textarea rows={3} value={edits.notes ?? ""} onChange={(e) => setEdits({ ...edits, notes: e.target.value })} />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Meta */}
        <Card className="card-premium border-0">
          <CardHeader><CardTitle>Meta</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Meta label="Created" value={format(new Date(shipment.created_at), "PP · HH:mm")} />
            <Meta label="Last update" value={format(new Date(shipment.updated_at), "PP · HH:mm")} />
            <Meta label="Events" value={String(events.length)} />
          </CardContent>
        </Card>
      </div>

      {/* Timeline editor */}
      <Card className="card-premium border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tracking timeline</CardTitle>
            <CardDescription>Add, edit or delete tracking updates visible to the client.</CardDescription>
          </div>
          <Button onClick={openCreateEvent} className="bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]">
            <Plus className="w-4 h-4 mr-2" /> Add update
          </Button>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No tracking updates yet.</p>
              <Button onClick={openCreateEvent} variant="link" className="mt-2 text-primary">Create the first one</Button>
            </div>
          ) : (
            <ol className="relative space-y-0">
              {events.map((ev, i) => (
                <li key={ev.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {i !== events.length - 1 && (
                    <span className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
                  )}
                  <div className="relative z-10 shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 group">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge tone={STATUS_TONES[ev.status]} size="sm">{STATUS_LABELS[ev.status]}</StatusBadge>
                          <time className="text-xs text-muted-foreground font-mono">{format(new Date(ev.timestamp), "PP · HH:mm")}</time>
                        </div>
                        {ev.location && (
                          <p className="text-sm text-foreground mt-1 inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {ev.location}
                          </p>
                        )}
                        {ev.description && <p className="text-sm text-muted-foreground mt-1">{ev.description}</p>}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditEvent(ev)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this update?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove the tracking event. The client will no longer see it.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteEvent(ev.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      {/* Event dialog */}
      <Dialog open={eventDialog.open} onOpenChange={(o) => setEventDialog({ ...eventDialog, open: o })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{eventDialog.mode === "create" ? "Add tracking update" : "Edit tracking update"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Field label="Status">
              <Select value={eventDialog.data.status} onValueChange={(v) => setEventDialog({ ...eventDialog, data: { ...eventDialog.data, status: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Location">
              <Input value={eventDialog.data.location} onChange={(e) => setEventDialog({ ...eventDialog, data: { ...eventDialog.data, location: e.target.value } })} placeholder="Kinshasa, DRC" />
            </Field>
            <Field label="Date & time">
              <Input type="datetime-local" value={eventDialog.data.timestamp} onChange={(e) => setEventDialog({ ...eventDialog, data: { ...eventDialog.data, timestamp: e.target.value } })} />
            </Field>
            <Field label="Internal note / description">
              <Textarea rows={3} value={eventDialog.data.description} onChange={(e) => setEventDialog({ ...eventDialog, data: { ...eventDialog.data, description: e.target.value } })} placeholder="Cleared customs, awaiting truck pickup..." />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventDialog({ ...eventDialog, open: false })}>Cancel</Button>
            <Button onClick={saveEvent} disabled={savingEvent} className="bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]">
              {savingEvent && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {eventDialog.mode === "create" ? "Add update" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</Label>
    {children}
  </div>
);

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center border-b border-border pb-2 last:border-0">
    <span className="text-muted-foreground text-xs">{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);

export default AdminShipmentDetail;
