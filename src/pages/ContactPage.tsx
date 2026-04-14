import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", service: "", message: "" });

  const contactInfo = [
    { icon: MapPin, label: t("contact_page.address"), value: "123 Av. de la Libération, Kinshasa, RDC" },
    { icon: Phone, label: t("contact_page.phone"), value: "+243 81 234 5678" },
    { icon: Mail, label: t("contact_page.email"), value: "contact@irokoexpress.com" },
    { icon: Clock, label: t("contact_page.hours"), value: "Lun - Sam : 08h00 - 18h00" },
  ];

  const handleChange = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Erreur", description: "Veuillez remplir les champs obligatoires.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name.trim(), company: form.company.trim() || null, email: form.email.trim(),
        phone: form.phone.trim() || null, service: form.service || null, message: form.message.trim(),
      });
      if (error) throw error;
      toast({ title: "Message envoyé !", description: "Nous vous répondrons dans les plus brefs délais." });
      setForm({ name: "", company: "", email: "", phone: "", service: "", message: "" });
    } catch {
      toast({ title: "Erreur", description: "Une erreur est survenue. Réessayez.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary relative overflow-hidden pt-40 pb-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-20" ref={heroRef}>
          <motion.span initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-accent text-xs font-bold uppercase tracking-widest block mb-6">
            {t("contact_page.title")}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl font-bold tracking-tighter uppercase text-surface-foreground leading-[0.85] mb-6">
            <span className="text-primary">{t("contact_page.title")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="text-surface-foreground/50 text-lg lg:text-xl max-w-2xl font-light">
            {t("contact_page.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-24 bg-background">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold">{t("contact_page.name")} *</Label>
                  <Input id="name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} maxLength={100} className="border-border bg-muted/50 focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-xs uppercase tracking-widest font-bold">{t("contact_page.company")}</Label>
                  <Input id="company" value={form.company} onChange={(e) => handleChange("company", e.target.value)} maxLength={100} className="border-border bg-muted/50 focus:border-primary" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold">{t("contact_page.email")} *</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} maxLength={255} className="border-border bg-muted/50 focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs uppercase tracking-widest font-bold">{t("contact_page.phone")}</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} maxLength={20} className="border-border bg-muted/50 focus:border-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-bold">{t("contact_page.service")}</Label>
                <Select value={form.service} onValueChange={(v) => handleChange("service", v)}>
                  <SelectTrigger className="border-border bg-muted/50"><SelectValue placeholder={t("contact_page.selectService")} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dedouanement">{t("services.customs")}</SelectItem>
                    <SelectItem value="transit">{t("services.transit")}</SelectItem>
                    <SelectItem value="import-export">{t("services.import")}</SelectItem>
                    <SelectItem value="sourcing">{t("services.sourcing")}</SelectItem>
                    <SelectItem value="logistique">{t("services.logistics")}</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs uppercase tracking-widest font-bold">{t("contact_page.message")} *</Label>
                <Textarea id="message" value={form.message} onChange={(e) => handleChange("message", e.target.value)} rows={5} maxLength={2000} className="border-border bg-muted/50 focus:border-primary" />
              </div>
              <Button type="submit" variant="default" size="lg" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-4 h-4" />}
                {loading ? t("contact_page.sending") : t("contact_page.send")}
              </Button>
            </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="flex items-start gap-4 p-6 border border-border">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="font-bold text-foreground text-xs uppercase tracking-widest">{info.label}</p>
                    <p className="text-muted-foreground text-sm mt-1">{info.value}</p>
                  </div>
                </div>
              );
            })}
            <div className="border border-border overflow-hidden h-64 bg-muted">
              <iframe title="Iroko Express Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254231.6001482!2d15.2!3d-4.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a313c4c8f7d63%3A0x6a3b6b2b9e8f30c6!2sKinshasa!5e0!3m2!1sfr!2scd!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
