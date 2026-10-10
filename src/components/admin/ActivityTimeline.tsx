import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Package, FileText, User, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tables } from "@/integrations/supabase/types";

type Log = Tables<"activity_logs">;
const ICONS: Record<string, React.ElementType> = { shipment: Package, quote: FileText, client: User };

interface Props {
  /** Restrict to one entity. */
  entityType?: string;
  entityId?: string;
  /** Show everything tied to a client (their shipments/quotes too). */
  clientId?: string;
  limit?: number;
}

export default function ActivityTimeline({ entityType, entityId, clientId, limit = 30 }: Props) {
  const [logs, setLogs] = useState<Log[] | null>(null);

  useEffect(() => {
    let q = supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(limit);
    if (clientId) q = q.or(`entity_id.eq.${clientId},metadata->>client_id.eq.${clientId}`);
    else if (entityId) q = q.eq("entity_id", entityId);
    if (entityType && !clientId) q = q.eq("entity_type", entityType);
    q.then(({ data }) => setLogs(data ?? []));
  }, [entityType, entityId, clientId, limit]);

  if (!logs) return <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12" />)}</div>;
  if (logs.length === 0)
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        <Activity className="w-6 h-6 mx-auto mb-2 opacity-50" />Aucune activité enregistrée.
      </div>
    );

  return (
    <ol className="relative border-l border-border ml-3 space-y-5">
      {logs.map((l) => {
        const Icon = ICONS[l.entity_type] ?? Activity;
        return (
          <li key={l.id} className="ml-6">
            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border">
              <Icon className="w-3 h-3 text-muted-foreground" />
            </span>
            <p className="text-sm text-foreground">{l.summary ?? l.action}</p>
            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(l.created_at), { addSuffix: true, locale: fr })}</p>
          </li>
        );
      })}
    </ol>
  );
}
