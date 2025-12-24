-- AI Practice: store generated tests (no binary/base64)
CREATE TABLE IF NOT EXISTS public.ai_practice_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module TEXT NOT NULL,
  question_type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  topic TEXT NOT NULL,
  time_minutes INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  audio_url TEXT NULL,
  audio_format TEXT NULL,
  sample_rate INTEGER NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_practice_tests_user_generated
  ON public.ai_practice_tests (user_id, generated_at DESC);

ALTER TABLE public.ai_practice_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI practice tests"
  ON public.ai_practice_tests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI practice tests"
  ON public.ai_practice_tests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI practice tests"
  ON public.ai_practice_tests
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI practice tests"
  ON public.ai_practice_tests
  FOR DELETE
  USING (auth.uid() = user_id);


-- AI Practice: store results (no binary/base64)
CREATE TABLE IF NOT EXISTS public.ai_practice_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  test_id UUID NOT NULL REFERENCES public.ai_practice_tests(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  band_score NUMERIC NULL,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  question_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_practice_results_user_completed
  ON public.ai_practice_results (user_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_practice_results_test
  ON public.ai_practice_results (test_id);

ALTER TABLE public.ai_practice_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI practice results"
  ON public.ai_practice_results
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI practice results"
  ON public.ai_practice_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI practice results"
  ON public.ai_practice_results
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI practice results"
  ON public.ai_practice_results
  FOR DELETE
  USING (auth.uid() = user_id);
