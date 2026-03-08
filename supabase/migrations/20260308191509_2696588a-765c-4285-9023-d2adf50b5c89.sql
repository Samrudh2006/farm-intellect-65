
-- FIX: Prevent privilege escalation — only admins can write to user_roles
CREATE POLICY "Only admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- FIX: Merchants can only see farmer profiles they have orders with
DROP POLICY IF EXISTS "Merchants can view farmer profiles" ON public.profiles;
CREATE POLICY "Merchants can view farmer profiles with orders" ON public.profiles FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'merchant'::app_role) 
  AND EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.merchant_id = auth.uid() 
    AND orders.farmer_id = profiles.user_id
  )
);
