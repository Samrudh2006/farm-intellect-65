
CREATE TABLE public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT 'false'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can select settings"
  ON public.admin_settings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert settings"
  ON public.admin_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
  ON public.admin_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.admin_settings (key, value) VALUES
  ('enableRegistration', 'true'),
  ('enableNotifications', 'true'),
  ('enableMaintenance', 'false'),
  ('enableAnalytics', 'true'),
  ('autoApproveExperts', 'false'),
  ('enableEmailVerification', 'true'),
  ('sessionTimeout', '30'),
  ('maxLoginAttempts', '5'),
  ('minPasswordLength', '8'),
  ('smtpServer', '""'),
  ('smtpPort', '587'),
  ('fromEmail', '""');
