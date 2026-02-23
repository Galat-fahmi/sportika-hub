-- Create storage bucket for event banners
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES ('event-banners', 'event-banners', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to event-banners bucket
CREATE POLICY "Allow authenticated users to upload event banners"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'event-banners' AND name LIKE 'banners/%');

-- Allow authenticated users to read from event-banners bucket
CREATE POLICY "Allow authenticated users to read event banners"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'event-banners');

-- Allow users to update their own event banners
CREATE POLICY "Allow users to update their own event banners"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'event-banners' AND owner = auth.uid());

-- Allow users to delete their own event banners
CREATE POLICY "Allow users to delete their own event banners"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'event-banners' AND owner = auth.uid());

-- Update the events table to use the new banner_url column consistently
-- Make sure banner_image_url exists and rename if needed
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Update the form state in OrganizerEvents to use banner_url instead of banner_image_url
-- This will be handled in the frontend code