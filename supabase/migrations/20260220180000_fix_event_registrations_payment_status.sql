-- Fix event_registrations table - ensure payment_status column exists

-- Add payment_status column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'event_registrations' 
        AND column_name = 'payment_status'
    ) THEN
        ALTER TABLE public.event_registrations 
        ADD COLUMN payment_status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- Also ensure other related columns exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'event_registrations' 
        AND column_name = 'payment_amount'
    ) THEN
        ALTER TABLE public.event_registrations 
        ADD COLUMN payment_amount NUMERIC(10,2);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'event_registrations' 
        AND column_name = 'payment_date'
    ) THEN
        ALTER TABLE public.event_registrations 
        ADD COLUMN payment_date TIMESTAMPTZ;
    END IF;
END $$;

-- Ensure checked_in columns exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'event_registrations' 
        AND column_name = 'checked_in'
    ) THEN
        ALTER TABLE public.event_registrations 
        ADD COLUMN checked_in BOOLEAN DEFAULT false;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'event_registrations' 
        AND column_name = 'checked_in_at'
    ) THEN
        ALTER TABLE public.event_registrations 
        ADD COLUMN checked_in_at TIMESTAMPTZ;
    END IF;
END $$;