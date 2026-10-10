import { useState } from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LIFECYCLE, STATUS_LABELS, lifecycleIndex, nextStatus, type ShipmentStatus } from "@/lib/logistics";
import { cn } from "@/lib/utils";

interface Props {
  shipmentId: string;
  status: string;
  location?: string | null;
  onChange: () => void;
}

/** Visual 8-stage lifecycle; click a stage or "advance" to move the shipment and log a tracking event. */
export default function LifecycleStepper({ shipmentId, status, location, onChange }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const current = lifecycleIndex(status);
  const next = nextStatus(status);

  const moveTo = async (s: ShipmentStatus) => {
    setBusy(s);
    const { error } = await supabase.from("shipments").update({ status: s }).eq("id", shipmentId);
    if (!error) {
      await supabase.from("shipment_events").insert({
        shipment_id: shipmentId, status: s, location: location ?? null, description: STATUS_LABELS[s],
      });
    }
    setBusy(null);
    if (error) toast.error("Mise à jour impossible", { description: error.message });
    else { toast.success(`Statut : ${STATUS_LABELS[s]}`); onChange(); }
  };

  return (
    <Card className="card-premium border-0">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Cycle de vie</p>
            <p className="font-semibold text-foreground">{status === "blocked" ? "Bloqué — choisissez une étape pour reprendre" : `Étape ${current + 1} / ${LIFECYCLE.length}`}</p>
          </div>
          {next && (
            <Button size="sm" onClick={() => moveTo(next)} disabled={!!busy}>
              {busy === next ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
              Passer à : {STATUS_LABELS[next]}
            </Button>
          )}
        </div>
        <ol className="grid grid-cols-4 lg:grid-cols-8 gap-2">
          {LIFECYCLE.map((s, i) => {
            const done = i < current, active = i === current;
            return (
              <li key={s}>
                <button
                  type="button"
                  disabled={!!busy || active}
                  onClick={() => moveTo(s)}
                  className={cn(
                    "w-full rounded-lg border p-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    done && "border-success/30 bg-success/10",
                    active && "border-primary bg-primary/15",
                    !done && !active && "border-border bg-muted/40 hover:bg-muted",
                  )}
                >
                  <span className={cn(
                    "mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    done ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}>
                    {busy === s ? <Loader2 className="w-3 h-3 animate-spin" /> : done ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className={cn("block text-[11px] leading-tight", active ? "font-semibold text-foreground" : "text-muted-foreground")}>
                    {STATUS_LABELS[s]}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
