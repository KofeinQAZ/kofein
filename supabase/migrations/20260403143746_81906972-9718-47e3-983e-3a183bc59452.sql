
-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT,
  cover_image TEXT,
  tools TEXT[] DEFAULT '{}',
  link TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_images table
CREATE TABLE public.project_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Anyone can view project images" ON public.project_images FOR SELECT USING (true);

-- Authenticated write access (admin)
CREATE POLICY "Authenticated users can create projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update projects" ON public.projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete projects" ON public.projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can create project images" ON public.project_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update project images" ON public.project_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete project images" ON public.project_images FOR DELETE TO authenticated USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

CREATE POLICY "Public read access for project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Authenticated users can upload project images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');
CREATE POLICY "Authenticated users can update project images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-images');
CREATE POLICY "Authenticated users can delete project images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images');
