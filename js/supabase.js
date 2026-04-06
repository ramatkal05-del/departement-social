// Configuration Supabase
// Load from config.js (supports both browser and Vercel environments)

// Initialiser le client Supabase
let supabaseClient = null

function initSupabase() {
  if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded')
    return null
  }

  // Get configuration from SUPABASE_CONFIG or use defaults
  const config = typeof SUPABASE_CONFIG !== 'undefined' 
    ? SUPABASE_CONFIG 
    : {
        url: 'https://mhsmivrkptlusphwoote.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oc21pdnJrcHRsdXNwaHdvb3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NzIxODMsImV4cCI6MjA5MTA0ODE4M30.L73H4EEmsVZ5mGlvxmp_2su-NoqspUusoWqCQcdbwK0'
      }
  
  supabaseClient = supabase.createClient(config.url, config.key)
  return supabaseClient
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
