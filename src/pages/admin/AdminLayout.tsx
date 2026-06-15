import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const titles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/colis": "Shipments",
  "/admin/devis": "Quotes",
  "/admin/clients": "Clients",
  "/admin/blog": "Blog",
  "/admin/parametres": "Settings",
};

const AdminLayout = () => {
  const { user, isStaff, loading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate("/admin/login");
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  const title = Object.entries(titles).find(([k]) => pathname === k || (k !== "/admin" && pathname.startsWith(k)))?.[1] ?? "Admin";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[hsl(var(--surface-subtle))]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 sm:px-6">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <h1 className="font-display font-semibold text-foreground text-lg hidden sm:block">{title}</h1>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Quick search..." className="pl-9 w-64 h-9 bg-muted/40 border-border" />
              </div>
              <button className="relative h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-muted transition">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
              </button>
              <div className="h-9 w-9 rounded-full bg-primary/15 text-foreground flex items-center justify-center text-xs font-bold border border-primary/30">
                {(user.email ?? "A").slice(0, 2).toUpperCase()}
              </div>
            </div>
          </header>
          {!isStaff && (
            <div className="px-6 py-2 bg-warning/10 text-[hsl(var(--warning-foreground))] text-xs border-b border-warning/20">
              ⚠️ Restricted access — admin or staff role required for full features.
            </div>
          )}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
