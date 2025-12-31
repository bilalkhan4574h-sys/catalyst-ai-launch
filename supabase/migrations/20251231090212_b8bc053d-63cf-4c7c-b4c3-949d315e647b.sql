-- Create careers/job listings table
CREATE TABLE public.careers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Full-time',
    description TEXT NOT NULL,
    requirements TEXT[],
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read active careers" 
ON public.careers 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage careers" 
ON public.careers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_careers_updated_at
BEFORE UPDATE ON public.careers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add some sample career data
INSERT INTO public.careers (title, department, location, type, description, requirements) VALUES
('AI Engineer', 'Engineering', 'Remote', 'Full-time', 'Build and deploy AI solutions for our clients.', ARRAY['3+ years ML experience', 'Python expertise', 'Cloud platform knowledge']),
('Growth Marketing Manager', 'Marketing', 'New York, NY', 'Full-time', 'Lead growth initiatives and marketing campaigns.', ARRAY['5+ years marketing experience', 'B2B SaaS background', 'Data-driven mindset']);