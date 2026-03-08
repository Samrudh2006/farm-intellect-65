-- Fix privilege escalation: Remove self-serve INSERT policy and add secure role assignment function

-- Drop the insecure INSERT policy that allows users to assign themselves any role
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;

-- Create a secure function for role assignment (only allows 'farmer' as default)
CREATE OR REPLACE FUNCTION public.assign_default_role(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only insert if user doesn't already have a role
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'farmer');
  END IF;
END;
$$;

-- Create a secure admin-only function to change roles
CREATE OR REPLACE FUNCTION public.admin_assign_role(_target_user_id uuid, _new_role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow admins to assign roles
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can assign roles';
  END IF;
  
  -- Update or insert the role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_target_user_id, _new_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;