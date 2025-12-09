-- Create activities table to store user activities
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  emission_kg NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Create daily_history table to archive daily totals
CREATE TABLE public.daily_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  total_emission_kg NUMERIC NOT NULL DEFAULT 0,
  activity_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS on both tables
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for activities
CREATE POLICY "Users can view their own activities" 
ON public.activities FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities" 
ON public.activities FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" 
ON public.activities FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities" 
ON public.activities FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for daily_history
CREATE POLICY "Users can view their own history" 
ON public.daily_history FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history" 
ON public.daily_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own history" 
ON public.daily_history FOR UPDATE 
USING (auth.uid() = user_id);

-- Enable realtime for activities
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;