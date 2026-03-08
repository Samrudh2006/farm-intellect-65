
-- ============================================================
-- FIX: Convert ALL 52 RESTRICTIVE policies to PERMISSIVE
-- RESTRICTIVE = AND logic (all must pass) — BREAKS multi-policy tables
-- PERMISSIVE = OR logic (any can pass) — CORRECT behavior
-- ============================================================

-- ==================== activity_log ====================
DROP POLICY IF EXISTS "Admins can view all activity" ON public.activity_log;
DROP POLICY IF EXISTS "Users can insert own activity" ON public.activity_log;
DROP POLICY IF EXISTS "Users can view own activity" ON public.activity_log;

CREATE POLICY "Admins can view all activity" ON public.activity_log FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own activity" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own activity" ON public.activity_log FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ==================== admin_settings ====================
DROP POLICY IF EXISTS "Admins can insert settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Admins can select settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Admins can update settings" ON public.admin_settings;

CREATE POLICY "Admins can insert settings" ON public.admin_settings FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can select settings" ON public.admin_settings FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update settings" ON public.admin_settings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ==================== consultations ====================
DROP POLICY IF EXISTS "Admins can view all consultations" ON public.consultations;
DROP POLICY IF EXISTS "Experts can update assigned consultations" ON public.consultations;
DROP POLICY IF EXISTS "Experts can view assigned consultations" ON public.consultations;
DROP POLICY IF EXISTS "Farmers can insert own consultations" ON public.consultations;
DROP POLICY IF EXISTS "Farmers can view own consultations" ON public.consultations;

CREATE POLICY "Admins can view all consultations" ON public.consultations FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Experts can update assigned consultations" ON public.consultations FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'expert'::app_role) AND (auth.uid() = expert_id OR expert_id IS NULL));
CREATE POLICY "Experts can view assigned consultations" ON public.consultations FOR SELECT TO authenticated USING (has_role(auth.uid(), 'expert'::app_role) AND (auth.uid() = expert_id OR expert_id IS NULL));
CREATE POLICY "Farmers can insert own consultations" ON public.consultations FOR INSERT TO authenticated WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmers can view own consultations" ON public.consultations FOR SELECT TO authenticated USING (auth.uid() = farmer_id);

-- ==================== crop_plans ====================
DROP POLICY IF EXISTS "Users can delete own crop plans" ON public.crop_plans;
DROP POLICY IF EXISTS "Users can insert own crop plans" ON public.crop_plans;
DROP POLICY IF EXISTS "Users can update own crop plans" ON public.crop_plans;
DROP POLICY IF EXISTS "Users can view own crop plans" ON public.crop_plans;

CREATE POLICY "Users can delete own crop plans" ON public.crop_plans FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own crop plans" ON public.crop_plans FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own crop plans" ON public.crop_plans FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own crop plans" ON public.crop_plans FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ==================== field_events ====================
DROP POLICY IF EXISTS "Users can delete own field events" ON public.field_events;
DROP POLICY IF EXISTS "Users can insert own field events" ON public.field_events;
DROP POLICY IF EXISTS "Users can update own field events" ON public.field_events;
DROP POLICY IF EXISTS "Users can view own field events" ON public.field_events;

CREATE POLICY "Users can delete own field events" ON public.field_events FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own field events" ON public.field_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own field events" ON public.field_events FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own field events" ON public.field_events FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ==================== knowledge_articles ====================
DROP POLICY IF EXISTS "Admins full access articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Experts can delete own articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Experts can insert articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Experts can update own articles" ON public.knowledge_articles;
DROP POLICY IF EXISTS "Experts can view own articles" ON public.knowledge_articles;

CREATE POLICY "Admins full access articles" ON public.knowledge_articles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view published articles" ON public.knowledge_articles FOR SELECT TO authenticated USING (status = 'published');
CREATE POLICY "Experts can delete own articles" ON public.knowledge_articles FOR DELETE TO authenticated USING (auth.uid() = author_id AND has_role(auth.uid(), 'expert'::app_role));
CREATE POLICY "Experts can insert articles" ON public.knowledge_articles FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'expert'::app_role) AND auth.uid() = author_id);
CREATE POLICY "Experts can update own articles" ON public.knowledge_articles FOR UPDATE TO authenticated USING (auth.uid() = author_id AND has_role(auth.uid(), 'expert'::app_role));
CREATE POLICY "Experts can view own articles" ON public.knowledge_articles FOR SELECT TO authenticated USING (auth.uid() = author_id AND has_role(auth.uid(), 'expert'::app_role));

-- ==================== notifications ====================
DROP POLICY IF EXISTS "Admins can view all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;

CREATE POLICY "Admins can view all notifications" ON public.notifications FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ==================== orders ====================
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Farmers can view their orders" ON public.orders;
DROP POLICY IF EXISTS "Merchants can delete own orders" ON public.orders;
DROP POLICY IF EXISTS "Merchants can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Merchants can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Merchants can view own orders" ON public.orders;

CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Farmers can view their orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = farmer_id);
CREATE POLICY "Merchants can delete own orders" ON public.orders FOR DELETE TO authenticated USING (auth.uid() = merchant_id);
CREATE POLICY "Merchants can insert own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = merchant_id);
CREATE POLICY "Merchants can update own orders" ON public.orders FOR UPDATE TO authenticated USING (auth.uid() = merchant_id);
CREATE POLICY "Merchants can view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = merchant_id);

-- ==================== profiles ====================
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Merchants can view farmer profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Merchants can view farmer profiles" ON public.profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'merchant'::app_role) AND EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = profiles.user_id AND user_roles.role = 'farmer'::app_role));
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ==================== scheme_matches ====================
DROP POLICY IF EXISTS "Users can delete own scheme matches" ON public.scheme_matches;
DROP POLICY IF EXISTS "Users can insert own scheme matches" ON public.scheme_matches;
DROP POLICY IF EXISTS "Users can update own scheme matches" ON public.scheme_matches;
DROP POLICY IF EXISTS "Users can view own scheme matches" ON public.scheme_matches;

CREATE POLICY "Users can delete own scheme matches" ON public.scheme_matches FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scheme matches" ON public.scheme_matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scheme matches" ON public.scheme_matches FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own scheme matches" ON public.scheme_matches FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ==================== user_roles ====================
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Merchants can view farmer roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Admins can view all user roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Merchants can view farmer roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'merchant'::app_role) AND role = 'farmer'::app_role);
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ==================== user_tasks ====================
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.user_tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.user_tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.user_tasks;
DROP POLICY IF EXISTS "Users can view own tasks" ON public.user_tasks;

CREATE POLICY "Users can delete own tasks" ON public.user_tasks FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON public.user_tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.user_tasks FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own tasks" ON public.user_tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);
