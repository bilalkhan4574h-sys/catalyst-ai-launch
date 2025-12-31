-- Drop existing policies on contact_submissions
DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;

-- Create proper PERMISSIVE policies for contact_submissions
-- Only admins can view contact submissions (protects customer data)
CREATE POLICY "Admins can view submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Only admins can update submissions
CREATE POLICY "Admins can update submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Anyone (including anonymous) can submit contact form
CREATE POLICY "Anyone can submit contact"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);