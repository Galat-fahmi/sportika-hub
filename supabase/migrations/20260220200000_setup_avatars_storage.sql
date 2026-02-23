-- Setup avatars storage bucket for profile pictures

-- Create the avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES ('avatars', 'avatars', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create policies for avatars bucket
CREATE POLICY "Anyone can read avatars" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can update their avatars" ON storage.objects FOR UPDATE TO authenticated USING (auth.uid()::text = owner_id);

CREATE POLICY "Authenticated users can delete their avatars" ON storage.objects FOR DELETE TO authenticated USING (auth.uid()::text = owner_id);