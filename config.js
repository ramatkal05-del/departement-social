// Configuration loader for different environments
// This file handles both browser and Vercel environments
// API keys should be set via environment variables in production

const SUPABASE_CONFIG = {
  // For Vercel/Node.js environment - use env vars
  url: typeof process !== 'undefined' && process.env.SUPABASE_URL 
    ? process.env.SUPABASE_URL 
    : (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : ''),
  
  key: typeof process !== 'undefined' && process.env.SUPABASE_KEY
    ? process.env.SUPABASE_KEY
    : (typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : '')
}

// Validate configuration
if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.key) {
  console.warn('⚠️ Supabase configuration incomplete. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file or environment.')
}

// Export for use in supabase.js
if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SUPABASE_CONFIG
}
