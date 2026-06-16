import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminSettings = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Erreur", description: "Le mot de passe doit comporter au moins 6 caractères.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Mot de passe mis à jour !" });
      setPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display font-bold text-2xl text-foreground">Paramètres</h1>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Changer le mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={changePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground">Nouveau mot de passe</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-card border-border text-foreground" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground">Confirmer le mot de passe</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-card border-border text-foreground" required />
            </div>
            <Button type="submit" className="bg-primary text-primary-foreground" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2" />}
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Informations de l'entreprise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Nom :</strong> Iroko Express</p>
          <p><strong className="text-foreground">Adresse :</strong> 123 Av. de la Libération, Kinshasa, RDC</p>
          <p><strong className="text-foreground">Téléphone :</strong> +243 81 234 5678</p>
          <p><strong className="text-foreground">Email :</strong> contact@irokoexpress.com</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
