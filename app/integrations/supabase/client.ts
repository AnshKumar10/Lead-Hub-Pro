import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://jcdavcdohvovrurjgquv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZGF2Y2RvaHZvdnJ1cmpncXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3Mzc0OTAsImV4cCI6MjA3MzMxMzQ5MH0.56zTc__EaYawkRgBU6NVMMh4JIyAWYJiM_JZlQmJl-U";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: { persistSession: true, autoRefreshToken: true },
  }
);
