
-- Create shipment status enum
CREATE TYPE public.shipment_status AS ENUM ('created', 'in_transit', 'customs', 'delivered', 'blocked');

-- Create shipments table
CREATE TABLE public.shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  cargo_type TEXT,
  weight_kg NUMERIC,
  status public.shipment_status NOT NULL DEFAULT 'created',
  estimated_delivery DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shipment_events table
CREATE TABLE public.shipment_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  status public.shipment_status NOT NULL,
  location TEXT,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;

-- Public SELECT on shipments (anyone can look up by tracking number)
CREATE POLICY "Anyone can view shipments"
  ON public.shipments FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public SELECT on shipment_events
CREATE POLICY "Anyone can view shipment events"
  ON public.shipment_events FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create public view that hides sensitive fields
CREATE VIEW public.shipments_public
WITH (security_invoker = on) AS
  SELECT id, tracking_number, client_name, origin, destination,
         cargo_type, weight_kg, status, estimated_delivery, created_at, updated_at
  FROM public.shipments;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_shipments_updated_at
  BEFORE UPDATE ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_shipments_tracking ON public.shipments(tracking_number);
CREATE INDEX idx_shipment_events_shipment ON public.shipment_events(shipment_id);
CREATE INDEX idx_shipment_events_timestamp ON public.shipment_events(timestamp DESC);
