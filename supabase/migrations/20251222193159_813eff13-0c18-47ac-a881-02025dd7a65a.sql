-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true);

-- Policy: Anyone can view public media
CREATE POLICY "Anyone can view media"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Policy: Admins can upload media
CREATE POLICY "Admins can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Policy: Admins can update media
CREATE POLICY "Admins can update media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Policy: Admins can delete media
CREATE POLICY "Admins can delete media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' 
  AND has_role(auth.uid(), 'admin'::app_role)
);