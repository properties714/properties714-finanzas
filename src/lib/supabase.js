import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://euvbddxunitgiqduckwf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dmJkZHh1bml0Z2lxZHVja3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjMyMDQsImV4cCI6MjA4ODM5OTIwNH0.Fq3UwLA_VCPaoA7fShgT8nCk9xXw1sNENoZ_jZyz6Qs'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
