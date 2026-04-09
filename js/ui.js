/**
 * UI Manager - Minimalist Dark Theme
 * Handles responsive layouts, sidebar injection, and shared components
 */
const UIManager = {
    menuItems: [
        { name: 'Tableau de Bord', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', link: 'dashboard.html' },
        { name: 'Membres', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', link: 'membres.html' },
        { name: 'Départements', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', link: 'departements.html' },
        { name: 'Périodes', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', link: 'cotisations.html' },
        { name: 'Contributions', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', link: 'contributions.html' },
        { name: 'Cultes & Salle', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', link: 'cultes.html' },
        { name: 'Dépenses', icon: 'M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z', link: 'depenses.html' },
        { name: 'Rapports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', link: 'rapports.html' }
    ],

    initialized: false,

    init(currentPageTitle) {
        // Ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.renderLayout(currentPageTitle))
            document.addEventListener('DOMContentLoaded', () => this.initMobileMenu())
        } else {
            this.renderLayout(currentPageTitle)
            this.initMobileMenu()
        }
        this.initialized = true
    },

    renderLayout(pageTitle) {
        const layout = document.getElementById('app-layout')
        if (!layout) {
            console.warn('app-layout element not found')
            return
        }

        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html'

        const sidebarHtml = `
            <aside id="sidebar" class="sidebar flex flex-col h-screen fixed lg:static bg-[#12121A] z-50 scroll-touch border-r border-[rgba(255,255,255,0.08)]">
                <div class="p-4 lg:p-6 border-b border-[rgba(255,255,255,0.08)]">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-[#F59E0B] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] flex-shrink-0">
                            <svg class="w-5 h-5 lg:w-6 lg:h-6 text-[#0A0A0F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <h1 class="font-bold text-[#FAFAFA] tracking-tight text-sm lg:text-base truncate font-display">Emerge Social</h1>
                            <p class="text-[10px] uppercase tracking-widest font-bold text-[#71717A]">Finance Hub</p>
                        </div>
                    </div>
                </div>

                <nav class="flex-1 p-3 lg:p-4 space-y-1 overflow-y-auto scroll-touch">
                    ${this.menuItems.map(item => `
                        <a href="${item.link}" class="flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-sm font-medium transition-all duration-200 ${currentPath === item.link ? 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]' : 'text-[#A1A1AA] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#FAFAFA]'}">
                            <svg class="w-5 h-5 flex-shrink-0 ${currentPath === item.link ? 'text-[#F59E0B]' : 'text-[#71717A]'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="${item.icon}"></path>
                            </svg>
                            <span class="truncate">${item.name}</span>
                        </a>
                    `).join('')}
                </nav>

                <div class="p-3 lg:p-4 border-t border-[rgba(255,255,255,0.08)]">
                    <button onclick="AuthManager.signOut()" class="flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 text-sm font-medium text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] rounded-xl transition-all w-full group">
                        <svg class="w-5 h-5 text-[#EF4444] group-hover:text-[#EF4444] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        <span class="truncate">Déconnexion</span>
                    </button>
                </div>
            </aside>
            <div id="sidebar-overlay" class="sidebar-overlay lg:hidden"></div>
        `;

        const headerHtml = `
            <header class="bg-[rgba(18,18,26,0.8)] backdrop-blur-md sticky top-0 z-30 border-b border-[rgba(255,255,255,0.08)]">
                <div class="px-3 sm:px-4 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
                    <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                        <button id="mobile-menu-btn" class="lg:hidden p-2 text-[#A1A1AA] hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors flex-shrink-0">
                            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                        <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-[#FAFAFA] leading-none truncate font-display">${pageTitle}</h2>
                    </div>
                    <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <div class="hidden sm:flex flex-col items-end">
                            <span class="text-xs font-semibold text-[#71717A] uppercase tracking-wider">Aujourd'hui</span>
                            <span class="text-sm font-bold text-[#FAFAFA]">${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
            </header>
        `;

        // Inject Sidebar
        const mainContent = document.createElement('main')
        mainContent.className = 'main-content'
        mainContent.innerHTML = headerHtml + '<div id="page-content" class="p-3 sm:p-4 lg:p-8 animate-fade-in"></div>'
        
        layout.innerHTML = sidebarHtml
        layout.appendChild(mainContent)

        // Move existing content if any
        const existingContent = document.getElementById('content-to-move')
        if (existingContent) {
            const pageContent = document.getElementById('page-content')
            if (pageContent) {
                pageContent.appendChild(existingContent)
            }
        }
    },

    initMobileMenu() {
        const btn = document.getElementById('mobile-menu-btn')
        const sidebar = document.getElementById('sidebar')
        const overlay = document.getElementById('sidebar-overlay')

        if (!btn || !sidebar || !overlay) {
            // Elements not ready yet, retry after a short delay
            setTimeout(() => this.initMobileMenu(), 100)
            return
        }

        const openSidebar = () => {
            sidebar.classList.add('open')
            overlay.classList.add('active')
            document.body.classList.add('overflow-hidden')
        }

        const closeSidebar = () => {
            sidebar.classList.remove('open')
            overlay.classList.remove('active')
            document.body.classList.remove('overflow-hidden')
        }

        btn.addEventListener('click', openSidebar)
        overlay.addEventListener('click', closeSidebar)
        
        // Close sidebar when clicking on a link (mobile)
        sidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    closeSidebar()
                }
            })
        })

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                closeSidebar()
            }
        })
        
        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                closeSidebar()
            }
        })
    }
}

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // UIManager will be initialized by each page
})
