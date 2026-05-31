
-- Storage bucket (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('swmm5-files', 'swmm5-files', true, 52428800)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 52428800;

CREATE POLICY "Public read swmm5-files"
ON storage.objects FOR SELECT
USING (bucket_id = 'swmm5-files');

-- Resources catalog
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  filename TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  version TEXT NOT NULL DEFAULT '5.2.4',
  source_url TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.resources TO anon, authenticated;
GRANT ALL ON public.resources TO service_role;

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read resources"
ON public.resources FOR SELECT
TO anon, authenticated
USING (true);
