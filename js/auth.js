// Gestion de l'authentification
const AuthManager = {
  async signIn(email, password) {
    const supabase = getSupabase()
    if (!supabase) return { error: 'Supabase not initialized. Please check configuration.' }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) return { error: error.message }
      
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('session', JSON.stringify(data.session))
      
      return { data }
    } catch (err) {
      console.error('Sign in error:', err)
      return { error: 'An unexpected error occurred during sign in.' }
    }
  },

  async signUp(email, password) {
    const supabase = getSupabase()
    if (!supabase) return { error: 'Supabase not initialized. Please check configuration.' }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) return { error: error.message }
      return { data }
    } catch (err) {
      console.error('Sign up error:', err)
      return { error: 'An unexpected error occurred during sign up.' }
    }
  },

  async signOut() {
    const supabase = getSupabase()
    if (!supabase) {
      // Clear local storage anyway
      localStorage.removeItem('user')
      localStorage.removeItem('session')
      window.location.href = 'index.html'
      return
    }
    
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    } finally {
      localStorage.removeItem('user')
      localStorage.removeItem('session')
      window.location.href = 'index.html'
    }
  },

  getUser() {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    } catch (err) {
      console.error('Error getting user:', err)
      return null
    }
  },

  isAuthenticated() {
    return !!this.getUser()
  },

  checkAuth() {
    if (!this.isAuthenticated() && !window.location.href.includes('index.html')) {
      window.location.href = 'index.html'
    }
  },

  async getSession() {
    const supabase = getSupabase()
    if (!supabase) return null
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    } catch (err) {
      console.error('Error getting session:', err)
      return null
    }
  },

  // Refresh session from server
  async refreshSession() {
    const supabase = getSupabase()
    if (!supabase) return null
    
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('Session refresh error:', error.message)
        return null
      }
      
      if (data.session) {
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('session', JSON.stringify(data.session))
      }
      
      return data.session
    } catch (err) {
      console.error('Session refresh error:', err)
      return null
    }
  }
}

window.AuthManager = AuthManager
