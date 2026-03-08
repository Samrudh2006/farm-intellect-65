
-- FIX: Expert consultations — remove NULL branch so experts only see assigned
DROP POLICY IF EXISTS "Experts can view assigned consultations" ON public.consultations;
DROP POLICY IF EXISTS "Experts can update assigned consultations" ON public.consultations;

CREATE POLICY "Experts can view assigned consultations" ON public.consultations FOR SELECT TO authenticated USING (has_role(auth.uid(), 'expert'::app_role) AND auth.uid() = expert_id);
CREATE POLICY "Experts can update assigned consultations" ON public.consultations FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'expert'::app_role) AND auth.uid() = expert_id);
