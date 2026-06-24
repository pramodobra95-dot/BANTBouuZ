import { createClient } from "@supabase/supabase-js";

// Check if environment variables are configured
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || "";
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Use a safe placeholder URL/Key to prevent initialization crash when not configured yet
const finalUrl = supabaseUrl || "https://placeholder-project.supabase.co";
const finalKey = supabaseAnonKey || "placeholder-anon-key";

export const supabase = createClient(finalUrl, finalKey);

/**
 * Utility functions for syncing/performing actions.
 * If Supabase is configured, we can do direct calls, otherwise we can log a warning or route to standard REST API fallbacks.
 */
