import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, FileText, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  shipmentsInTransit: number;
  pendingQuotes: number;
  totalClients: number;
  totalShipments: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ shipmentsInTransit: 0, pendingQuotes: 0, totalClients: 0, totalShipments: 0 });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [shipRes, quoteRes, clientRes, recentRes] = await Promise.all([
        supabase.from("shipments").select("id, status"),
        supabase.from("quotes").select("id, status"),
        supabase.from("clients").select("id"),
        supabase.from("quotes").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        totalShipments: shipRes.data?.length ?? 0,
        shipmentsInTransit: shipRes.data?.filter((s) => s.status === "in_transit" || s.status === "customs").length ?? 0,
        pendingQuotes: quoteRes.data?.filter((q) => q.status === "new").length ?? 0,
        totalClients: clientRes.data?.length ?? 0,
      });
      setRecentQuotes(recentRes.data ?? []);
    };
    load();
  }, []);

  const kpis = [
    { label: "Colis en transit", value: stats.shipmentsInTransit, icon: Package, color: "text-primary" },
    { label: "Devis en attente", value: stats.pendingQuotes, icon: FileText, color: "text-accent" },
    { label: "Clients actifs", value: stats.totalClients, icon: Users, color: "text-emerald-400" },
    { label: "Total expéditions", value: stats.totalShipments, icon: TrendingUp, color: "text-sky-400" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-2xl text-surface-foreground">Dashboard</h1>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="bg-surface-foreground/5 border-surface-foreground/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-surface-foreground/60">{kpi.label}</CardTitle>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <p className="font-display font-extrabold text-3xl text-surface-foreground">{kpi.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent quotes */}
      <Card className="bg-surface-foreground/5 border-surface-foreground/10">
        <CardHeader>
          <CardTitle className="text-surface-foreground">Derniers devis reçus</CardTitle>
        </CardHeader>
        <CardContent>
          {recentQuotes.length === 0 ? (
            <p className="text-surface-foreground/40 text-sm">Aucun devis pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {recentQuotes.map((q) => (
                <div key={q.id} className="flex items-center justify-between py-2 border-b border-surface-foreground/10 last:border-0">
                  <div>
                    <p className="text-surface-foreground font-medium text-sm">{q.name}</p>
                    <p className="text-surface-foreground/50 text-xs">{q.type} — {q.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    q.status === "new" ? "bg-primary/20 text-primary" : "bg-surface-foreground/10 text-surface-foreground/60"
                  }`}>
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
