
-- Event status enum
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'ongoing', 'completed', 'cancelled');

-- Events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sport TEXT NOT NULL,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  registration_fee NUMERIC(10,2) DEFAULT 0,
  status event_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event registrations table
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered',
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, athlete_id)
);

-- Event results table
CREATE TABLE public.event_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL,
  position INTEGER,
  score NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_results ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Anyone can view published events"
  ON public.events FOR SELECT
  USING (status = 'published' OR status = 'ongoing' OR status = 'completed' OR organizer_id = auth.uid());

CREATE POLICY "Organizers can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id AND public.has_role(auth.uid(), 'organizer'));

CREATE POLICY "Organizers can update their own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their own events"
  ON public.events FOR DELETE
  USING (auth.uid() = organizer_id);

-- Event registrations policies
CREATE POLICY "Athletes can view their own registrations"
  ON public.event_registrations FOR SELECT
  USING (athlete_id = auth.uid());

CREATE POLICY "Organizers can view registrations for their events"
  ON public.event_registrations FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = event_id AND events.organizer_id = auth.uid()));

CREATE POLICY "Athletes can register for events"
  ON public.event_registrations FOR INSERT
  WITH CHECK (auth.uid() = athlete_id AND public.has_role(auth.uid(), 'athlete'));

CREATE POLICY "Athletes can cancel their registration"
  ON public.event_registrations FOR DELETE
  USING (auth.uid() = athlete_id);

-- Event results policies
CREATE POLICY "Anyone can view results"
  ON public.event_results FOR SELECT
  USING (true);

CREATE POLICY "Organizers can manage results for their events"
  ON public.event_results FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.events WHERE events.id = event_id AND events.organizer_id = auth.uid()));

CREATE POLICY "Organizers can update results for their events"
  ON public.event_results FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = event_id AND events.organizer_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
