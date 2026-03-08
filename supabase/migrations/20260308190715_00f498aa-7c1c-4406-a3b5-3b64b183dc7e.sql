
-- Fix 1: Expert consultation policies - restrict to assigned consultations
DROP POLICY IF EXISTS "Experts can view assigned consultations" ON public.consultations;
DROP POLICY IF EXISTS "Experts can update assigned consultations" ON public.consultations;

CREATE POLICY "Experts can view assigned consultations"
ON public.consultations FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'expert'::app_role) AND (auth.uid() = expert_id OR expert_id IS NULL));

CREATE POLICY "Experts can update assigned consultations"
ON public.consultations FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'expert'::app_role) AND (auth.uid() = expert_id OR expert_id IS NULL));

-- Fix 2: Merchant role visibility - only see farmer roles
DROP POLICY IF EXISTS "Merchants can view farmer roles" ON public.user_roles;

CREATE POLICY "Merchants can view farmer roles"
ON public.user_roles FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'merchant'::app_role) AND (role = 'farmer'::app_role));
