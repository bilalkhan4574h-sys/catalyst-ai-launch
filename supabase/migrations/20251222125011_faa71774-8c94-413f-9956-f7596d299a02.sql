-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Contact submissions
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- CMS Tables

-- Site settings (hero, company info, etc.)
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Services
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Case studies
CREATE TABLE public.case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT NOT NULL,
    client TEXT NOT NULL,
    icon TEXT DEFAULT 'TrendingUp',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- Testimonials
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Process steps
CREATE TABLE public.process_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'Target',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;

-- Tech stack
CREATE TABLE public.tech_stack (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tech_stack ENABLE ROW LEVEL SECURITY;

-- Blog posts
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT,
    category TEXT NOT NULL,
    read_time TEXT DEFAULT '5 min read',
    image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- User roles: only admins can manage
CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Contact submissions: public insert, admin read
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view submissions" ON public.contact_submissions
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions" ON public.contact_submissions
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Site settings: public read, admin write
CREATE POLICY "Anyone can read site settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Services: public read, admin write
CREATE POLICY "Anyone can read services" ON public.services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage services" ON public.services
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Case studies: public read, admin write
CREATE POLICY "Anyone can read case studies" ON public.case_studies
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage case studies" ON public.case_studies
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Testimonials: public read, admin write
CREATE POLICY "Anyone can read testimonials" ON public.testimonials
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Process steps: public read, admin write
CREATE POLICY "Anyone can read process steps" ON public.process_steps
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage process steps" ON public.process_steps
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tech stack: public read, admin write
CREATE POLICY "Anyone can read tech stack" ON public.tech_stack
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage tech stack" ON public.tech_stack
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Blog posts: public read published, admin full access
CREATE POLICY "Anyone can read published posts" ON public.blog_posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for profiles on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON public.case_studies
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();