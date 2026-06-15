import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Truck, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import { StatWidget } from "@/components/ui/stat-widget";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  created: "hsl(220 9% 46%)",
  in_transit: "hsl(217 91% 60%)",
  customs: "hsl(38 92% 50%)",
  delivered: "hsl(152 76% 36%)",
  blocked: "hsl(0 84% 60%)",
};
const STATUS_LABELS: Record<string, string> = {
  created: "Created", in_transit: "In Transit", customs: "Customs", delivered: "Delivered", blocked: "Blocked",
};
const STATUS_TONES: Record<string, "neutral" | "info" | "warning" | "success" | "danger"> = {
  created: "neutral", in_transit: "info", customs: "warning", delivered: "success", blocked: "danger",
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [shipRes, eventsRes] = await Promise.all([
        supabase.from("shipments").select("*").order("created_at", { ascending: false }),
        supabase.from("shipment_events").select("*, shipments(tracking_number, client_name)").order("timestamp", { ascending: false }).limit(8),
      ]);
      setShipments(shipRes.data ?? []);
      setRecentEvents(eventsRes.data ?? []);
      setLoading(false);
    })();
  }, []);

  const total = shipments.length;
  const active = shipments.filter((s) => s.status === "in_transit").length;
  const delivered = shipments.filter((s) => s.status === "delivered").length;
  const customs = shipments.filter((s) => s.status === "customs").length;

  // Monthly chart — last 6 months
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = startOfMonth(subMonths(new Date(), 5 - i));
    return { key: format(d, "yyyy-MM"), label: format(d, "MMM"), count: 0, delivered: 0 };
  });
  shipments.forEach((s) => {
    const k = format(new Date(s.created_at), "yyyy-MM");
    const m = months.find((x) => x.key === k);
    if (m) {
      m.count += 1;
      if (s.status === "delivered") m.delivered += 1;
    }
  });

  // Status distribution
  const statusData = ["created", "in_transit", "customs", "delivered", "blocked"].map((s) => ({
    name: STATUS_LABELS[s], value: shipments.filter((x) => x.status === s).length, color: STATUS_COLORS[s],
  })).filter((d) => d.value > 0);

  // Top destinations
  const destMap = new Map<string, number>();
  shipments.forEach((s) => destMap.set(s.destination, (destMap.get(s.destination) ?? 0) + 1));
  const topDest = Array.from(destMap.entries()).map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Welcome back 👋</h2>
        <p className="text-muted-foreground text-sm mt-1">Here's a snapshot of your logistics activity.</p>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatWidget label="Total Shipments" value={loading ? "—" : total} icon={Package} tone="brand" loading={loading} />
        <StatWidget label="Active Shipments" value={loading ? "—" : active} icon={Truck} tone="info" loading={loading} />
        <StatWidget label="Delivered" value={loading ? "—" : delivered} icon={CheckCircle2} tone="success" loading={loading} />
        <StatWidget label="Pending Customs" value={loading ? "—" : customs} icon={AlertCircle} tone="warning" loading={loading} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 card-premium border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Shipments — last 6 months</CardTitle>
            <CardDescription>Created vs Delivered</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {loading ? <Skeleton className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={months} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(45 100% 51%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(45 100% 51%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(152 76% 36%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(152 76% 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(45 100% 51%)" strokeWidth={2.5} fill="url(#gPrimary)" name="Created" />
                  <Area type="monotone" dataKey="delivered" stroke="hsl(152 76% 36%)" strokeWidth={2} fill="url(#gSuccess)" name="Delivered" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="card-premium border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Status distribution</CardTitle>
            <CardDescription>Live breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex items-center">
            {loading ? <Skeleton className="w-full h-full" /> : statusData.length === 0 ? (
              <p className="text-muted-foreground text-sm m-auto">No shipments yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" innerRadius={50} outerRadius={85} paddingAngle={2} strokeWidth={0}>
                    {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 card-premium border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Top destinations</CardTitle>
            <CardDescription>Where your cargo goes the most</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {loading ? <Skeleton className="w-full h-full" /> : topDest.length === 0 ? (
              <p className="text-muted-foreground text-sm">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topDest} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} cursor={{ fill: "hsl(var(--muted) / 0.4)" }} />
                  <Bar dataKey="count" fill="hsl(45 100% 51%)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="card-premium border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Recent activity</CardTitle>
              <CardDescription>Latest tracking events</CardDescription>
            </div>
            <Link to="/admin/colis" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
            ) : recentEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentEvents.map((ev) => (
                  <li key={ev.id} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-foreground">{ev.shipments?.tracking_number}</span>
                        <StatusBadge tone={STATUS_TONES[ev.status]} size="sm">{STATUS_LABELS[ev.status]}</StatusBadge>
                      </div>
                      <p className="text-muted-foreground text-xs mt-0.5 truncate">{ev.location ?? "—"} · {format(new Date(ev.timestamp), "MMM d, HH:mm")}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
