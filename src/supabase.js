import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://rdlwkajmakjxxlceryyi.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkbHdrYWptYWtqeHhsY2VyeXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNjEzMDEsImV4cCI6MjA5MDczNzMwMX0._56zBdRIveSmzXfuGTIVbfu_UY2Jj0by8aemB0OIUvQ'

export const supabase = createClient(url, key)
