// Configuration Supabase
// Load from config.js (supports both browser and Vercel environments)

// Initialiser le client Supabase
let supabaseClient = null

function initSupabase() {
  if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded')
    return null
  }

  // Get configuration from SUPABASE_CONFIG
  const config = typeof SUPABASE_CONFIG !== 'undefined' ? SUPABASE_CONFIG : null
  
  // Validate configuration - fail if not properly configured
  if (!config || !config.url || !config.key) {
    console.error('Supabase configuration is incomplete. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your config.js or environment.')
    return null
  }

  // Check URL format
  if (!config.url.startsWith('https://')) {
    console.error('Supabase URL must start with https://')
    return null
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
