-- Add RLS policy for organizers to update event registrations (approve/reject)

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Organizers can update registrations for their events" ON public.event_registrations;

-- Create policy allowing organizers to update registrations for their events
CREATE POLICY "Organizers can update registrations for their events"
  ON public.event_registrations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_id 
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_id 
      AND events.organizer_id = auth.uid()
    )
  );