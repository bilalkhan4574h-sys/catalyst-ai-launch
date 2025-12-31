-- Create a validation function for page_views inserts
CREATE OR REPLACE FUNCTION public.validate_page_view()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Validate page_path is not empty and has reasonable length
  IF NEW.page_path IS NULL OR length(NEW.page_path) < 1 OR length(NEW.page_path) > 500 THEN
    RAISE EXCEPTION 'Invalid page_path';
  END IF;
  
  -- Validate page_title has reasonable length if provided
  IF NEW.page_title IS NOT NULL AND length(NEW.page_title) > 200 THEN
    RAISE EXCEPTION 'page_title too long';
  END IF;
  
  -- Validate referrer has reasonable length if provided
  IF NEW.referrer IS NOT NULL AND length(NEW.referrer) > 2000 THEN
    RAISE EXCEPTION 'referrer too long';
  END IF;
  
  -- Validate user_agent has reasonable length if provided
  IF NEW.user_agent IS NOT NULL AND length(NEW.user_agent) > 500 THEN
    RAISE EXCEPTION 'user_agent too long';
  END IF;
  
  -- Validate session_id format if provided (should be reasonable length)
  IF NEW.session_id IS NOT NULL AND length(NEW.session_id) > 100 THEN
    RAISE EXCEPTION 'session_id too long';
  END IF;
  
  -- Validate ip_hash format if provided (should be a hash, reasonable length)
  IF NEW.ip_hash IS NOT NULL AND length(NEW.ip_hash) > 64 THEN
    RAISE EXCEPTION 'ip_hash too long';
  END IF;
  
  -- Prevent setting user_id to arbitrary values - only allow current user or null
  IF NEW.user_id IS NOT NULL AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot set user_id to another user';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to validate page_views on insert
DROP TRIGGER IF EXISTS validate_page_view_trigger ON public.page_views;
CREATE TRIGGER validate_page_view_trigger
  BEFORE INSERT ON public.page_views
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_page_view();