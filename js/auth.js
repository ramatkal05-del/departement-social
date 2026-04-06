// Gestion de l'authentification
const AuthManager = {
  async signIn(email, password) {
    const supabase = getSupabase()
    if (!supabase) return { error: 'Supabase not initialized' }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) return { error: error.message }
    
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('session', JSON.stringify(data.session))
    
    return { data }
  },

  async signUp(email, password) {
    const supabase = getSupabase()
    if (!supabase) return { error: 'Supabase not initialized' }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (error) return { error: error.message }
    return { data }
  },

  async signOut() {
    const supabase = getSupabase()
    if (!supabase) return
    
    await supabase.auth.signOut()
    localStorage.removeItem('user')
    localStorage.removeItem('session')
    window.location.href = 'index.html'
  },

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
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
    
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }
}

window.AuthManager = AuthManager
