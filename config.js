// Configuration loader for different environments
// This file handles both browser and Vercel environments
// API keys should be set via environment variables in production

// Check for window-level globals (set inline or via injected env)
const SUPABASE_URL = typeof window !== 'undefined' ? window.SUPABASE_URL : (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : '');
const SUPABASE_ANON_KEY = typeof window !== 'undefined' ? window.SUPABASE_ANON_KEY : (typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : '');

const SUPABASE_CONFIG = {
  // Prefer process env if bundled (rare for this static app), otherwise window globals
  url: typeof process !== 'undefined' && process.env.SUPABASE_URL 
    ? process.env.SUPABASE_URL 
    : SUPABASE_URL,
  
  key: typeof process !== 'undefined' && process.env.SUPABASE_ANON_KEY
    ? process.env.SUPABASE_ANON_KEY
    : SUPABASE_ANON_KEY
}

// Only warn in development mode (not in production)
const isDevelopment = typeof window !== 'undefined' && !window.location.hostname.includes('vercel.app') && !window.location.hostname.includes('production');

if (isDevelopment && (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.key)) {
  console.warn('⚠️ Supabase configuration incomplete.')
  console.warn('Please provide SUPABASE_URL and SUPABASE_ANON_KEY (window globals or env at build time).')
}

// Export for use in supabase.js
if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SUPABASE_CONFIG
}
