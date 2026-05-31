ALTER TABLE public.resources ADD COLUMN download_count bigint NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_download_count(_resource_id uuid)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count bigint;
BEGIN
  UPDATE public.resources
  SET download_count = download_count + 1
  WHERE id = _resource_id
  RETURNING download_count INTO new_count;
  RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_download_count(uuid) TO anon, authenticated;