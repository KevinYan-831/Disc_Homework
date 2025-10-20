import { createClient } from '@supabase/supabase-js';

// Replace these with your actual values from Supabase dashboard
const supabaseUrl = 'https://nyyraxgibahkehtujhpu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55eXJheGdpYmFoa2VodHVqaHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODY2MjcsImV4cCI6MjA3NjM2MjYyN30.ryD-1btDNUhvCorgtnFtRHQB26wiJhZaTiQktteinVc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);