// Configuration loader for different environments
// This file handles both browser and Vercel environments

const SUPABASE_CONFIG = {
  // For Vercel/Node.js environment
  url: typeof process !== 'undefined' && process.env.SUPABASE_URL 
    ? process.env.SUPABASE_URL 
    : 'https://mhsmivrkptlusphwoote.supabase.co',
  
  key: typeof process !== 'undefined' && process.env.SUPABASE_KEY
    ? process.env.SUPABASE_KEY
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oc21pdnJrcHRsdXNwaHdvb3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NzIxODMsImV4cCI6MjA5MTA0ODE4M30.L73H4EEmsVZ5mGlvxmp_2su-NoqspUusoWqCQcdbwK0'
}

// Export for use in supabase.js
if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SUPABASE_CONFIG
}
