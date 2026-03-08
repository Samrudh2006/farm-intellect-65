
-- Notifications table for all roles
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
ON public.notifications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications"
ON public.notifications FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Consultations table for expert queue
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL,
  expert_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  category TEXT DEFAULT 'general',
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can view own consultations"
ON public.consultations FOR SELECT TO authenticated
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can insert own consultations"
ON public.consultations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Experts can view assigned consultations"
ON public.consultations FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'expert'));

CREATE POLICY "Experts can update assigned consultations"
ON public.consultations FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'expert'));

CREATE POLICY "Admins can view all consultations"
ON public.consultations FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Orders table for merchant workflow
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL,
  farmer_id UUID,
  crop_name TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL DEFAULT 0,
  price_per_kg NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC GENERATED ALWAYS AS (quantity_kg * price_per_kg) STORED,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own orders"
ON public.orders FOR SELECT TO authenticated
USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can insert own orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update own orders"
ON public.orders FOR UPDATE TO authenticated
USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can delete own orders"
ON public.orders FOR DELETE TO authenticated
USING (auth.uid() = merchant_id);

CREATE POLICY "Farmers can view their orders"
ON public.orders FOR SELECT TO authenticated
USING (auth.uid() = farmer_id);

CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
