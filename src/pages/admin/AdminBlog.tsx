import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Post = Tables<"blog_posts">;

const AdminBlog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const emptyForm = { title: "", slug: "", content: "", excerpt: "", category: "", status: "draft", meta_title: "", meta_desc: "", cover_image_url: "" };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (p: Post) => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, content: p.content || "", excerpt: p.excerpt || "",
      category: p.category || "", status: p.status, meta_title: p.meta_title || "",
      meta_desc: p.meta_desc || "", cover_image_url: p.cover_image_url || "",
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title, slug: form.slug, content: form.content || null, excerpt: form.excerpt || null,
      category: form.category || null, status: form.status, meta_title: form.meta_title || null,
      meta_desc: form.meta_desc || null, cover_image_url: form.cover_image_url || null,
      published_at: form.status === "published" ? new Date().toISOString() : null,
    };

    if (editing) {
      await supabase.from("blog_posts").update(payload).eq("id", editing.id);
      toast({ title: "Article mis à jour" });
      setEditing(null);
    } else {
      await supabase.from("blog_posts").insert({ ...payload, author_id: user?.id });
      toast({ title: "Article créé" });
      setCreating(false);
    }
    setForm(emptyForm);
    load();
  };

  const isOpen = !!editing || creating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display font-bold text-2xl text-surface-foreground">Blog</h1>
        <Button onClick={() => { setCreating(true); setForm(emptyForm); }} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Nouvel article
        </Button>
      </div>

      <Card className="bg-surface-foreground/5 border-surface-foreground/10 overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary w-6 h-6" /></div>
          ) : posts.length === 0 ? (
            <p className="text-center text-surface-foreground/40 py-12">Aucun article.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-foreground/10 text-surface-foreground/50">
                    <th className="text-left p-4">Titre</th>
                    <th className="text-left p-4 hidden md:table-cell">Catégorie</th>
                    <th className="text-left p-4">Statut</th>
                    <th className="text-left p-4 hidden lg:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id} onClick={() => openEdit(p)} className="border-b border-surface-foreground/5 hover:bg-surface-foreground/5 cursor-pointer transition">
                      <td className="p-4 text-surface-foreground font-medium">{p.title}</td>
                      <td className="p-4 text-surface-foreground/60 hidden md:table-cell">{p.category || "—"}</td>
                      <td className="p-4">
                        <Badge className={p.status === "published" ? "bg-emerald-500/20 text-emerald-400" : "bg-surface-foreground/10 text-surface-foreground/60"}>
                          {p.status === "published" ? "Publié" : "Brouillon"}
                        </Badge>
                      </td>
                      <td className="p-4 text-surface-foreground/40 hidden lg:table-cell">{new Date(p.created_at).toLocaleDateString("fr")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={isOpen} onOpenChange={(o) => { if (!o) { setEditing(null); setCreating(false); } }}>
        <SheetContent className="bg-surface border-surface-foreground/10 text-surface-foreground w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-surface-foreground font-display">{editing ? "Modifier l'article" : "Nouvel article"}</SheetTitle>
          </SheetHeader>
          <form onSubmit={save} className="mt-6 space-y-4">
            {[
              { key: "title", label: "Titre *", required: true },
              { key: "slug", label: "Slug *", required: true },
              { key: "category", label: "Catégorie" },
              { key: "cover_image_url", label: "URL image de couverture" },
              { key: "meta_title", label: "Meta titre (SEO)" },
              { key: "meta_desc", label: "Meta description (SEO)" },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-surface-foreground/60">{f.label}</Label>
                <Input value={(form as any)[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} className="bg-surface-foreground/5 border-surface-foreground/10 text-surface-foreground" required={f.required} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-surface-foreground/60">Extrait</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} className="bg-surface-foreground/5 border-surface-foreground/10 text-surface-foreground" rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-surface-foreground/60">Contenu</Label>
              <Textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} className="bg-surface-foreground/5 border-surface-foreground/10 text-surface-foreground" rows={8} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-surface-foreground/60">Statut</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                <SelectTrigger className="bg-surface-foreground/5 border-surface-foreground/10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground">
              {editing ? "Mettre à jour" : "Créer l'article"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminBlog;
