
CREATE TABLE public.knowledge_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;

-- Everyone can read published articles
CREATE POLICY "Anyone can view published articles"
  ON public.knowledge_articles FOR SELECT TO authenticated
  USING (status = 'published');

-- Experts can see their own drafts
CREATE POLICY "Experts can view own articles"
  ON public.knowledge_articles FOR SELECT TO authenticated
  USING (auth.uid() = author_id AND public.has_role(auth.uid(), 'expert'));

-- Experts can insert
CREATE POLICY "Experts can insert articles"
  ON public.knowledge_articles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'expert') AND auth.uid() = author_id);

-- Experts can update own
CREATE POLICY "Experts can update own articles"
  ON public.knowledge_articles FOR UPDATE TO authenticated
  USING (auth.uid() = author_id AND public.has_role(auth.uid(), 'expert'));

-- Experts can delete own
CREATE POLICY "Experts can delete own articles"
  ON public.knowledge_articles FOR DELETE TO authenticated
  USING (auth.uid() = author_id AND public.has_role(auth.uid(), 'expert'));

-- Admins can do everything
CREATE POLICY "Admins full access articles"
  ON public.knowledge_articles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
