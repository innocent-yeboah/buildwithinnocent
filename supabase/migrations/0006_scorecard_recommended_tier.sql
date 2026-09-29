-- Recommended offer for an AI Readiness Scorecard submission.
-- Run this after 0005_scorecard_responses.sql. Do not edit 0005 if it
-- has already been applied.
--
-- Nullable so rows saved before this column existed stay valid.
-- The API writes the offer name (for example "AI Roadmap").

alter table public.scorecard_responses
  add column if not exists recommended_tier text;
