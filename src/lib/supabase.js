import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pgyzlqfuwclapdjcxvgk.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBneXpscWZ1d2NsYXBkamN4dmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTE2MDQsImV4cCI6MjA5MDI4NzYwNH0.lnQ5KtEAuaNmAvLyk1wVgdBE3-Pnbgc56iwKBZyhClA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
