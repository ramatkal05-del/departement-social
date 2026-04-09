// Store global pour Alpine.js
const AppStore = {
    // État global
    state: {
        user: null,
        sidebarOpen: false,
        initialized: false
    },

    // Actions
    setUser(user) {
        this.state.user = user
        this.state.initialized = true
    },

    toggleSidebar() {
        this.state.sidebarOpen = !this.state.sidebarOpen
    },

    // Initialize from localStorage safely
    init() {
        try {
            const user = localStorage.getItem('user')
            this.state.user = user ? JSON.parse(user) : null
            this.state.initialized = true
        } catch (err) {
            console.error('Error initializing AppStore:', err)
            this.state.user = null
            this.state.initialized = true
        }
    }
}

// Store pour les données partagées
window.AppStore = AppStore

// Initialize the global store immediately
AppStore.init()

// Définir les données globales pour Alpine
document.addEventListener('alpine:init', () => {
    Alpine.store('app', {
        user: null,
        sidebarOpen: false,
        initialized: false,

        init() {
            // Get user from AuthManager which reads from localStorage
            this.user = AuthManager.getUser()
            this.initialized = true
        }
    })
})
