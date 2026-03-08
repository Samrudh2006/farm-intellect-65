
-- Allow merchants to view farmer profiles (for partner network)
CREATE POLICY "Merchants can view farmer profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'merchant') 
    AND EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_roles.user_id = profiles.user_id AND user_roles.role = 'farmer'
    )
  );

-- Allow merchants to read farmer roles (to identify farmers)
CREATE POLICY "Merchants can view farmer roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'merchant'));
