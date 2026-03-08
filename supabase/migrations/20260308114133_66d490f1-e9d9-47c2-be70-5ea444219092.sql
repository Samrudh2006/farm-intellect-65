-- Create farmer dashboard data tables

-- Crop plans table
CREATE TABLE IF NOT EXISTS public.crop_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  crop_name text NOT NULL,
  season text NOT NULL,
  sowing_date date,
  expected_harvest date,
  area_acres numeric(10,2),
  status text DEFAULT 'planned',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Field events table (history timeline)
CREATE TABLE IF NOT EXISTS public.field_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  event_description text NOT NULL,
  field_name text,
  event_date timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- User tasks/reminders
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Scheme matches
CREATE TABLE IF NOT EXISTS public.scheme_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scheme_name text NOT NULL,
  scheme_type text,
  eligibility_score integer DEFAULT 0,
  matched_at timestamptz DEFAULT now(),
  status text DEFAULT 'matched'
);

-- Activity log for dashboard
CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  action_type text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crop_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for crop_plans
CREATE POLICY "Users can view own crop plans" ON public.crop_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own crop plans" ON public.crop_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own crop plans" ON public.crop_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own crop plans" ON public.crop_plans FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for field_events
CREATE POLICY "Users can view own field events" ON public.field_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own field events" ON public.field_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own field events" ON public.field_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own field events" ON public.field_events FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for user_tasks
CREATE POLICY "Users can view own tasks" ON public.user_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON public.user_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.user_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON public.user_tasks FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for scheme_matches
CREATE POLICY "Users can view own scheme matches" ON public.scheme_matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scheme matches" ON public.scheme_matches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scheme matches" ON public.scheme_matches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scheme matches" ON public.scheme_matches FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for activity_log
CREATE POLICY "Users can view own activity" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);