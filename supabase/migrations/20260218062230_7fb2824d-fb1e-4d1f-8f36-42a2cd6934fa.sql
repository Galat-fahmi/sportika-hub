
-- Allow admins to read all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read all user_roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read all events (including drafts)
CREATE POLICY "Admins can view all events"
ON public.events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update any event (e.g. cancel/moderate)
CREATE POLICY "Admins can update any event"
ON public.events
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read all registrations
CREATE POLICY "Admins can view all registrations"
ON public.event_registrations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read all results
CREATE POLICY "Admins can view all results"
ON public.event_results
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete roles (for user management)
CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update user roles
CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
