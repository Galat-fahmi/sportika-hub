-- Organizer Scheduling Tables Migration
-- Creates tables for tournament brackets, group stages, match schedules, and venue assignments

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Venues table for event locations
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    capacity INTEGER,
    facilities TEXT[], -- array of facilities like ['wifi', 'parking', 'locker_room']
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tournament groups table for round-robin stages
CREATE TABLE IF NOT EXISTS public.tournament_groups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "Group A", "Group B"
    stage TEXT DEFAULT 'group' CHECK (stage IN ('group', 'knockout', 'final')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(event_id, name)
);

-- Group participants (athletes in groups)
CREATE TABLE IF NOT EXISTS public.group_participants (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES public.tournament_groups(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL,
    seed_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(group_id, athlete_id)
);

-- Matches table for all match types
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.tournament_groups(id) ON DELETE SET NULL,
    
    -- Match identification
    round TEXT NOT NULL, -- e.g., "Quarter Finals", "Semi Finals", "Final", "Group Stage"
    position INTEGER NOT NULL DEFAULT 0, -- position within round for bracket ordering
    match_number INTEGER, -- overall match number
    
    -- Participants
    athlete1_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    athlete2_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    athlete1_name TEXT, -- cached name for display
    athlete2_name TEXT, -- cached name for display
    
    -- Results
    winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    score1 INTEGER,
    score2 INTEGER,
    score_details JSONB, -- for detailed scoring (sets, games, etc.)
    
    -- Scheduling
    scheduled_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 60,
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    venue_name TEXT, -- cached venue name
    
    -- Status
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled', 'postponed')),
    
    -- Bracket progression
    next_match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
    next_match_position INTEGER, -- 1 or 2 (which slot in next match)
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Group standings view (calculated from match results)
CREATE OR REPLACE VIEW public.group_standings AS
WITH match_results AS (
    SELECT 
        m.group_id,
        m.athlete1_id AS athlete_id,
        m.athlete1_name AS athlete_name,
        CASE 
            WHEN m.winner_id = m.athlete1_id THEN 1 
            WHEN m.winner_id IS NULL THEN 0 
            ELSE 0 
        END AS wins,
        CASE 
            WHEN m.winner_id IS NULL AND m.status = 'completed' THEN 1 
            ELSE 0 
        END AS draws,
        CASE 
            WHEN m.winner_id IS NOT NULL AND m.winner_id != m.athlete1_id THEN 1 
            ELSE 0 
        END AS losses,
        COALESCE(m.score1, 0) AS points_for,
        COALESCE(m.score2, 0) AS points_against
    FROM public.matches m
    WHERE m.status = 'completed' AND m.group_id IS NOT NULL
    
    UNION ALL
    
    SELECT 
        m.group_id,
        m.athlete2_id AS athlete_id,
        m.athlete2_name AS athlete_name,
        CASE 
            WHEN m.winner_id = m.athlete2_id THEN 1 
            WHEN m.winner_id IS NULL THEN 0 
            ELSE 0 
        END AS wins,
        CASE 
            WHEN m.winner_id IS NULL AND m.status = 'completed' THEN 1 
            ELSE 0 
        END AS draws,
        CASE 
            WHEN m.winner_id IS NOT NULL AND m.winner_id != m.athlete2_id THEN 1 
            ELSE 0 
        END AS losses,
        COALESCE(m.score2, 0) AS points_for,
        COALESCE(m.score1, 0) AS points_against
    FROM public.matches m
    WHERE m.status = 'completed' AND m.group_id IS NOT NULL
)
SELECT 
    group_id,
    athlete_id,
    MAX(athlete_name) AS athlete_name,
    COUNT(*) AS played,
    SUM(wins) AS wins,
    SUM(draws) AS draws,
    SUM(losses) AS losses,
    SUM(wins) * 3 + SUM(draws) AS points, -- 3 points for win, 1 for draw
    SUM(points_for) AS points_for,
    SUM(points_against) AS points_against,
    SUM(points_for) - SUM(points_against) AS point_difference
FROM match_results
GROUP BY group_id, athlete_id;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_event_id ON public.matches(event_id);
CREATE INDEX IF NOT EXISTS idx_matches_group_id ON public.matches(group_id);
CREATE INDEX IF NOT EXISTS idx_matches_organizer_id ON public.matches(organizer_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_scheduled_time ON public.matches(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_tournament_groups_event_id ON public.tournament_groups(event_id);
CREATE INDEX IF NOT EXISTS idx_group_participants_group_id ON public.group_participants(group_id);
CREATE INDEX IF NOT EXISTS idx_venues_organizer_id ON public.venues(organizer_id);

-- Row Level Security Policies

-- Venues policies
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can manage their venues" ON public.venues
    FOR ALL TO authenticated
    USING (organizer_id = auth.uid())
    WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Anyone can view active venues" ON public.venues
    FOR SELECT TO public
    USING (status = 'active');

-- Tournament groups policies
ALTER TABLE public.tournament_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can manage their tournament groups" ON public.tournament_groups
    FOR ALL TO authenticated
    USING (organizer_id = auth.uid())
    WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Anyone can view tournament groups" ON public.tournament_groups
    FOR SELECT TO public
    USING (true);

-- Group participants policies
ALTER TABLE public.group_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can manage group participants" ON public.group_participants
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.tournament_groups tg 
            WHERE tg.id = group_participants.group_id 
            AND tg.organizer_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tournament_groups tg 
            WHERE tg.id = group_participants.group_id 
            AND tg.organizer_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view group participants" ON public.group_participants
    FOR SELECT TO public
    USING (true);

-- Matches policies
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can manage their matches" ON public.matches
    FOR ALL TO authenticated
    USING (organizer_id = auth.uid())
    WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Anyone can view matches" ON public.matches
    FOR SELECT TO public
    USING (true);

-- Functions for scheduling operations

-- Function to generate knockout bracket
CREATE OR REPLACE FUNCTION public.generate_knockout_bracket(
    p_event_id UUID,
    p_organizer_id UUID,
    p_participant_ids UUID[],
    p_start_time TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE(match_id UUID, round TEXT, position INTEGER) AS $$
DECLARE
    v_round TEXT;
    v_num_participants INTEGER;
    v_num_matches INTEGER;
    v_round_size INTEGER;
    v_position INTEGER;
    v_match_time TIMESTAMP WITH TIME ZONE;
    v_athlete1_id UUID;
    v_athlete2_id UUID;
BEGIN
    v_num_participants := array_length(p_participant_ids, 1);
    v_round_size := 2;
    
    -- Determine starting round based on participant count
    WHILE v_round_size < v_num_participants LOOP
        v_round_size := v_round_size * 2;
    END LOOP;
    
    v_match_time := COALESCE(p_start_time, NOW() + INTERVAL '1 day');
    
    -- Generate first round matches
    v_position := 1;
    FOR i IN 1..(v_round_size / 2) LOOP
        -- Get athlete IDs (handle byes if odd number)
        v_athlete1_id := p_participant_ids[(i * 2) - 1];
        v_athlete2_id := CASE 
            WHEN (i * 2) <= v_num_participants THEN p_participant_ids[i * 2]
            ELSE NULL -- bye
        END;
        
        INSERT INTO public.matches (
            event_id, organizer_id, round, position, 
            athlete1_id, athlete2_id,
            scheduled_time, status
        ) VALUES (
            p_event_id, p_organizer_id, 
            CASE v_round_size
                WHEN 2 THEN 'Final'
                WHEN 4 THEN 'Semi Finals'
                WHEN 8 THEN 'Quarter Finals'
                ELSE 'Round of ' || v_round_size
            END,
            v_position,
            v_athlete1_id, v_athlete2_id,
            v_match_time, 
            CASE WHEN v_athlete2_id IS NULL THEN 'completed' ELSE 'scheduled' END
        )
        RETURNING id INTO match_id;
        
        round := CASE v_round_size
            WHEN 2 THEN 'Final'
            WHEN 4 THEN 'Semi Finals'
            WHEN 8 THEN 'Quarter Finals'
            ELSE 'Round of ' || v_round_size
        END;
        position := v_position;
        RETURN NEXT;
        
        v_position := v_position + 1;
        v_match_time := v_match_time + INTERVAL '1 hour';
    END LOOP;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update match result and advance winner
CREATE OR REPLACE FUNCTION public.update_match_result(
    p_match_id UUID,
    p_score1 INTEGER,
    p_score2 INTEGER,
    p_winner_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_match RECORD;
    v_next_match RECORD;
BEGIN
    -- Get match details
    SELECT * INTO v_match FROM public.matches WHERE id = p_match_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Update current match
    UPDATE public.matches 
    SET 
        score1 = p_score1,
        score2 = p_score2,
        winner_id = p_winner_id,
        status = 'completed',
        updated_at = NOW()
    WHERE id = p_match_id;
    
    -- Advance winner to next match if exists
    IF v_match.next_match_id IS NOT NULL THEN
        IF v_match.next_match_position = 1 THEN
            UPDATE public.matches 
            SET athlete1_id = p_winner_id,
                athlete1_name = (SELECT full_name FROM public.profiles WHERE id = p_winner_id)
            WHERE id = v_match.next_match_id;
        ELSE
            UPDATE public.matches 
            SET athlete2_id = p_winner_id,
                athlete2_name = (SELECT full_name FROM public.profiles WHERE id = p_winner_id)
            WHERE id = v_match.next_match_id;
        END IF;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate group standings
CREATE OR REPLACE FUNCTION public.calculate_group_standings(p_group_id UUID)
RETURNS TABLE(
    athlete_id UUID,
    athlete_name TEXT,
    played BIGINT,
    wins BIGINT,
    draws BIGINT,
    losses BIGINT,
    points BIGINT,
    points_for BIGINT,
    points_against BIGINT,
    point_difference BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gs.athlete_id,
        gs.athlete_name,
        gs.played,
        gs.wins,
        gs.draws,
        gs.losses,
        gs.points,
        gs.points_for,
        gs.points_against,
        gs.point_difference
    FROM public.group_standings gs
    WHERE gs.group_id = p_group_id
    ORDER BY gs.points DESC, gs.point_difference DESC, gs.points_for DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournament_groups_updated_at BEFORE UPDATE ON public.tournament_groups
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
