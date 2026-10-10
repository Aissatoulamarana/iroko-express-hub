ALTER TYPE public.shipment_status ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE public.shipment_status ADD VALUE IF NOT EXISTS 'confirmed';
ALTER TYPE public.shipment_status ADD VALUE IF NOT EXISTS 'in_warehouse';
ALTER TYPE public.shipment_status ADD VALUE IF NOT EXISTS 'arrived';
ALTER TYPE public.shipment_status ADD VALUE IF NOT EXISTS 'out_for_delivery';

ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS quote_id uuid REFERENCES public.quotes(id) ON DELETE SET NULL;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS converted_shipment_id uuid REFERENCES public.shipments(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_shipments_client ON public.shipments(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_client ON public.quotes(client_id);

CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  entity_type text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff view activity" ON public.activity_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Staff insert activity" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE INDEX idx_activity_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_created ON public.activity_logs(created_at DESC);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff view notifications" ON public.notifications FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Staff update notifications" ON public.notifications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "Staff delete notifications" ON public.notifications FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

CREATE OR REPLACE FUNCTION public.log_shipment_activity() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_logs(actor_id, entity_type, entity_id, action, summary, metadata)
    VALUES (auth.uid(), 'shipment', NEW.id, 'created', 'Expédition ' || NEW.tracking_number || ' créée', jsonb_build_object('tracking', NEW.tracking_number, 'client_id', NEW.client_id));
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO activity_logs(actor_id, entity_type, entity_id, action, summary, metadata)
    VALUES (auth.uid(), 'shipment', NEW.id, 'status_changed', NEW.tracking_number || ' : ' || OLD.status::text || ' → ' || NEW.status::text,
      jsonb_build_object('from', OLD.status::text, 'to', NEW.status::text, 'tracking', NEW.tracking_number, 'client_id', NEW.client_id));
    INSERT INTO notifications(type, title, body, link, entity_type, entity_id)
    VALUES ('shipment_status', 'Statut mis à jour', NEW.tracking_number || ' → ' || NEW.status::text, '/admin/colis/' || NEW.id, 'shipment', NEW.id);
  ELSIF NEW IS DISTINCT FROM OLD THEN
    INSERT INTO activity_logs(actor_id, entity_type, entity_id, action, summary, metadata)
    VALUES (auth.uid(), 'shipment', NEW.id, 'updated', 'Expédition ' || NEW.tracking_number || ' modifiée', jsonb_build_object('tracking', NEW.tracking_number, 'client_id', NEW.client_id));
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_shipment_activity AFTER INSERT OR UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.log_shipment_activity();

CREATE OR REPLACE FUNCTION public.log_quote_activity() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_logs(actor_id, entity_type, entity_id, action, summary, metadata)
    VALUES (auth.uid(), 'quote', NEW.id, 'created', 'Nouveau devis de ' || NEW.name, jsonb_build_object('email', NEW.email));
    INSERT INTO notifications(type, title, body, link, entity_type, entity_id)
    VALUES ('new_quote', 'Nouveau devis reçu', NEW.name || ' — ' || COALESCE(NEW.origin,'?') || ' → ' || COALESCE(NEW.destination,'?'), '/admin/devis/' || NEW.id, 'quote', NEW.id);
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO activity_logs(actor_id, entity_type, entity_id, action, summary, metadata)
    VALUES (auth.uid(), 'quote', NEW.id, 'status_changed', 'Devis de ' || NEW.name || ' : ' || OLD.status || ' → ' || NEW.status,
      jsonb_build_object('from', OLD.status, 'to', NEW.status, 'client_id', NEW.client_id));
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_quote_activity AFTER INSERT OR UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.log_quote_activity();

CREATE OR REPLACE FUNCTION public.log_client_activity() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO activity_logs(actor_id, entity_type, entity_id, action, summary, metadata)
  VALUES (auth.uid(), 'client', NEW.id, CASE WHEN TG_OP='INSERT' THEN 'created' ELSE 'updated' END,
    CASE WHEN TG_OP='INSERT' THEN 'Client ' || NEW.name || ' ajouté' ELSE 'Client ' || NEW.name || ' modifié' END,
    jsonb_build_object('client_id', NEW.id));
  RETURN NEW;
END $$;
CREATE TRIGGER trg_client_activity AFTER INSERT OR UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.log_client_activity();

CREATE OR REPLACE FUNCTION public.notify_contact_message() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO notifications(type, title, body, entity_type, entity_id)
  VALUES ('contact', 'Nouvelle demande client', NEW.name || ' : ' || left(NEW.message, 120), 'contact', NEW.id);
  RETURN NEW;
END $$;
CREATE TRIGGER trg_contact_notify AFTER INSERT ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.notify_contact_message();

REVOKE EXECUTE ON FUNCTION public.log_shipment_activity(), public.log_quote_activity(), public.log_client_activity(), public.notify_contact_message() FROM PUBLIC, anon, authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;