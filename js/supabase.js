// Configuration Supabase
const SUPABASE_URL = 'https://mhsmivrkptlusphwoote.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oc21pdnJrcHRsdXNwaHdvb3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NzIxODMsImV4cCI6MjA5MTA0ODE4M30.L73H4EEmsVZ5mGlvxmp_2su-NoqspUusoWqCQcdbwK0'

// Initialiser le client Supabase
let supabaseClient = null

function initSupabase() {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    return supabaseClient
  }
  console.error('Supabase library not loaded')
  return null
}

function getSupabase() {
  if (!supabaseClient) {
    return initSupabase()
  }
  return supabaseClient
}

// Exporter pour utilisation globale
window.getSupabase = getSupabase
window.initSupabase = initSupabase
