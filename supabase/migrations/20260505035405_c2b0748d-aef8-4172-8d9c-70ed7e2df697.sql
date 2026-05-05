
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP POLICY "custom-refs public read" ON storage.objects;
CREATE POLICY "custom-refs owner read" ON storage.objects FOR SELECT
  USING (bucket_id = 'custom-refs' AND auth.uid()::text = (storage.foldername(name))[1]);
