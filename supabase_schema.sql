-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  city TEXT,
  country TEXT,
  additional_info TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create trips table
CREATE TABLE public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget_total DECIMAL(12,2) DEFAULT 0,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create itinerary_items table
CREATE TABLE public.itinerary_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  city_name TEXT NOT NULL,
  date DATE NOT NULL,
  activity_name TEXT NOT NULL,
  activity_type TEXT,
  cost DECIMAL(10,2) DEFAULT 0,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trips Policies
CREATE POLICY "Users can view own trips." ON public.trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own trips." ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips." ON public.trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips." ON public.trips
  FOR DELETE USING (auth.uid() = user_id);

-- Itinerary Items Policies
CREATE POLICY "Users can view itinerary items of their trips." ON public.itinerary_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = itinerary_items.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage itinerary items of their trips." ON public.itinerary_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = itinerary_items.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

-- Trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
