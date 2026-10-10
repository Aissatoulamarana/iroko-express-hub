import type { Database } from "@/integrations/supabase/types";

export type ShipmentStatus = Database["public"]["Enums"]["shipment_status"];
export type Tone = "neutral" | "info" | "warning" | "success" | "danger";

/** Professional lifecycle, in order. */
export const LIFECYCLE: ShipmentStatus[] = [
  "draft", "confirmed", "in_warehouse", "in_transit", "customs", "arrived", "out_for_delivery", "delivered",
];
/** Includes legacy values still stored on older rows. */
export const ALL_STATUSES: ShipmentStatus[] = [...LIFECYCLE, "blocked", "created"];

export const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon", confirmed: "Confirmé", in_warehouse: "En entrepôt", in_transit: "En transit",
  customs: "Dédouanement", arrived: "Arrivé", out_for_delivery: "En livraison", delivered: "Livré",
  blocked: "Bloqué", created: "Créé",
};
export const STATUS_TONES: Record<string, Tone> = {
  draft: "neutral", created: "neutral", confirmed: "info", in_warehouse: "info", in_transit: "info",
  customs: "warning", arrived: "success", out_for_delivery: "warning", delivered: "success", blocked: "danger",
};
export const ACTIVE_STATUSES: string[] = ["confirmed", "in_warehouse", "in_transit", "customs", "arrived", "out_for_delivery", "created"];

export const lifecycleIndex = (s: string) => {
  const i = LIFECYCLE.indexOf(s as ShipmentStatus);
  return s === "created" ? 1 : i;
};
export const nextStatus = (s: string): ShipmentStatus | null => {
  const i = lifecycleIndex(s);
  return i >= 0 && i < LIFECYCLE.length - 1 ? LIFECYCLE[i + 1] : null;
};

export const QUOTE_STATUSES = ["new", "under_review", "approved", "rejected", "converted"] as const;
export const QUOTE_LABELS: Record<string, string> = {
  new: "Nouveau", under_review: "En revue", approved: "Approuvé", rejected: "Rejeté", converted: "Converti en expédition",
  in_progress: "En revue", sent: "En revue", accepted: "Approuvé", refused: "Rejeté",
};
export const QUOTE_TONES: Record<string, Tone> = {
  new: "info", under_review: "warning", approved: "success", rejected: "danger", converted: "neutral",
  in_progress: "warning", sent: "warning", accepted: "success", refused: "danger",
};
/** Normalise legacy quote statuses to the new workflow. */
export const normQuote = (s: string) =>
  ({ in_progress: "under_review", sent: "under_review", accepted: "approved", refused: "rejected" } as Record<string, string>)[s] ?? s;

export const genTracking = () =>
  "IRK" + new Date().getFullYear().toString().slice(2) + Math.random().toString(36).slice(2, 8).toUpperCase();
