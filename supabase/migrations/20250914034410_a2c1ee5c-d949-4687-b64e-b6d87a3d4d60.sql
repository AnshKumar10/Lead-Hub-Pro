-- Create enums for buyer data
CREATE TYPE public.buyer_status AS ENUM ('new', 'contacted', 'qualified', 'viewing', 'negotiating', 'closed', 'lost');
CREATE TYPE public.property_type AS ENUM ('apartment', 'villa', 'plot', 'office', 'shop', 'warehouse');
CREATE TYPE public.buyer_purpose AS ENUM ('investment', 'end-use');
CREATE TYPE public.timeline AS ENUM ('immediate', '1-3 months', '3-6 months', '6+ months');
CREATE TYPE public.lead_source AS ENUM ('website', 'referral', 'social media', 'advertisement', 'walk-in', 'phone', 'other');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create buyers table
CREATE TABLE public.buyers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  property_type property_type NOT NULL,
  bhk INTEGER,
  purpose buyer_purpose NOT NULL,
  budget_min BIGINT,
  budget_max BIGINT,
  timeline timeline NOT NULL,
  source lead_source NOT NULL,
  notes TEXT,
  tags TEXT[],
  status buyer_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create buyer history table for tracking changes
CREATE TABLE public.buyer_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Buyers policies
CREATE POLICY "Users can view their own buyers" ON public.buyers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own buyers" ON public.buyers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buyers" ON public.buyers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own buyers" ON public.buyers
  FOR DELETE USING (auth.uid() = user_id);

-- Buyer history policies
CREATE POLICY "Users can view their buyer history" ON public.buyer_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert buyer history" ON public.buyer_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_buyers_updated_at
  BEFORE UPDATE ON public.buyers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to track buyer changes
CREATE OR REPLACE FUNCTION public.track_buyer_changes()
RETURNS TRIGGER AS $$
DECLARE
  field_name TEXT;
  old_val TEXT;
  new_val TEXT;
BEGIN
  -- Track status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.buyer_history (buyer_id, user_id, field_name, old_value, new_value)
    VALUES (NEW.id, NEW.user_id, 'status', OLD.status::TEXT, NEW.status::TEXT);
  END IF;
  
  -- Track other important field changes
  IF OLD.notes IS DISTINCT FROM NEW.notes THEN
    INSERT INTO public.buyer_history (buyer_id, user_id, field_name, old_value, new_value)
    VALUES (NEW.id, NEW.user_id, 'notes', OLD.notes, NEW.notes);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for buyer changes
CREATE TRIGGER track_buyer_changes_trigger
  AFTER UPDATE ON public.buyers
  FOR EACH ROW EXECUTE FUNCTION public.track_buyer_changes();

-- Create indexes for better performance
CREATE INDEX idx_buyers_user_id ON public.buyers(user_id);
CREATE INDEX idx_buyers_status ON public.buyers(status);
CREATE INDEX idx_buyers_city ON public.buyers(city);
CREATE INDEX idx_buyers_property_type ON public.buyers(property_type);
CREATE INDEX idx_buyers_created_at ON public.buyers(created_at);
CREATE INDEX idx_buyer_history_buyer_id ON public.buyer_history(buyer_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);