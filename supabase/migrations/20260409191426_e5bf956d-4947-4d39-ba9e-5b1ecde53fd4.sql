
-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send a message" ON public.contact_messages
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update messages" ON public.contact_messages
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (true);

-- Project blocks table
CREATE TYPE public.block_type AS ENUM ('heading', 'paragraph', 'image', 'youtube', 'quote');

CREATE TABLE public.project_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  block_type public.block_type NOT NULL,
  content TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view project blocks" ON public.project_blocks
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can manage blocks" ON public.project_blocks
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update blocks" ON public.project_blocks
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete blocks" ON public.project_blocks
  FOR DELETE TO authenticated USING (true);
