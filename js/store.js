// Store global pour Alpine.js
const AppStore = {
    // État global
    state: {
        user: null,
        sidebarOpen: false
    },

    // Actions
    setUser(user) {
        this.state.user = user
    },

    toggleSidebar() {
        this.state.sidebarOpen = !this.state.sidebarOpen
    }
}

// Store pour les données partagées
window.AppStore = AppStore

// Définir les données globales pour Alpine
document.addEventListener('alpine:init', () => {
    Alpine.store('app', {
        user: null,
        sidebarOpen: false,

        init() {
            this.user = AuthManager.getUser()
        }
    })
})
