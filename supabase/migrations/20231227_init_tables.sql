-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercise_logs table
CREATE TABLE IF NOT EXISTS public.exercise_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    activity_type TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    distance FLOAT,
    calories INTEGER,
    gps_data JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create nutrition_logs table
CREATE TABLE IF NOT EXISTS public.nutrition_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    meal_type TEXT NOT NULL,
    food_items JSONB NOT NULL,
    total_calories INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wellness_logs table
CREATE TABLE IF NOT EXISTS public.wellness_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
    sleep_hours FLOAT,
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Exercise logs policies
CREATE POLICY "Users can view their own exercise logs"
    ON public.exercise_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise logs"
    ON public.exercise_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise logs"
    ON public.exercise_logs FOR UPDATE
    USING (auth.uid() = user_id);

-- Nutrition logs policies
CREATE POLICY "Users can view their own nutrition logs"
    ON public.nutrition_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutrition logs"
    ON public.nutrition_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition logs"
    ON public.nutrition_logs FOR UPDATE
    USING (auth.uid() = user_id);

-- Wellness logs policies
CREATE POLICY "Users can view their own wellness logs"
    ON public.wellness_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wellness logs"
    ON public.wellness_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness logs"
    ON public.wellness_logs FOR UPDATE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS exercise_logs_user_id_idx ON public.exercise_logs(user_id);
CREATE INDEX IF NOT EXISTS nutrition_logs_user_id_idx ON public.nutrition_logs(user_id);
CREATE INDEX IF NOT EXISTS wellness_logs_user_id_idx ON public.wellness_logs(user_id);
