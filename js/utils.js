// Utilitaires communs
const Utils = {
  // Format monétaire
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount)
  },

  // Format date
  formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  },

  // Format mois
  formatMonth(monthStr) {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  },

  // Taux de change (à remplacer par API si nécessaire)
  exchangeRates: {
    USD: 1,
    EUR: 1.08,
    GBP: 1.27,
    TRY: 0.032
  },

  // Conversion de devise
  convertToUSD(amount, currency) {
    const rate = this.exchangeRates[currency] || 1
    return parseFloat((amount * rate).toFixed(2))
  },

  // Générer un ID unique
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  },

  // Notification toast
  showToast(message, type = 'success') {
    const toast = document.createElement('div')
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`
    toast.textContent = message
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4')
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  },

  // Validation email
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  },

  // Validation numéro de téléphone
  isValidPhone(phone) {
    return /^\+[\d\s]{10,15}$/.test(phone)
  },

  // Format role pour affichage
  formatRole(role) {
    const roles = {
      'CHEF': 'Chef',
      'CHEF_ADJOINT': 'Chef Adjoint',
      'SECRETAIRE': 'Secrétaire',
      'MEMBRE': 'Membre'
    }
    return roles[role] || role
  },

  // Format type de contribution
  formatContributionType(type) {
    const types = {
      'FIXED_20_USD': '20 USD fixe',
      'VARIABLE_PER_MEMBER': 'Montant variable'
    }
    return types[type] || type
  },

  // Format statut
  formatStatus(status) {
    const statuses = {
      'PENDING': 'En attente',
      'PARTIAL': 'Partiel',
      'PAID': 'Payé',
      'OPEN': 'Ouvert',
      'CLOSED': 'Clôturé'
    }
    return statuses[status] || status
  },

  // Export vers PDF avec jsPDF
  exportToPDF(filename, contentCallback) {
    // Charger jsPDF dynamiquement si nécessaire
    if (typeof jspdf === 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
      script.onload = () => {
        this._generatePDF(filename, contentCallback)
      }
      document.head.appendChild(script)
    } else {
      this._generatePDF(filename, contentCallback)
    }
  },

  _generatePDF(filename, contentCallback) {
    const { jsPDF } = jspdf
    const doc = new jsPDF()
    
    // En-tête (seulement si pas de contentCallback personnalisé)
    if (!contentCallback) {
      doc.setFontSize(20)
      doc.text('Département Social - Rapport', 105, 20, { align: 'center' })
      
      doc.setFontSize(12)
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 105, 30, { align: 'center' })
    }
    
    // Contenu personnalisé
    if (contentCallback) {
      contentCallback(doc)
    }
    
    doc.save(filename)
  },

  // Calculer dette de salle pour une période
  calculateRoomDebt(periodId, cults) {
    const periodCults = cults.filter(c => c.period_id === periodId)
    return periodCults.reduce((sum, c) => sum + (c.cost || 54), 0)
  },

  // Calculer totaux pour rapports
  calculateReportTotals(data, periodId) {
    const { contributions, expenses, cults } = data
    
    const periodContribs = contributions?.filter(c => c.period_id === periodId) || []
    const totalExpected = periodContribs.reduce((sum, c) => sum + (c.amount_expected || 0), 0)
    const totalPaid = periodContribs.reduce((sum, c) => sum + (c.amount_paid || 0), 0)
    
    const periodExpenses = expenses?.filter(e => e.period_id === periodId) || []
    const totalExpenses = periodExpenses.reduce((sum, e) => sum + (e.amount_usd || 0), 0)
    
    const roomDebt = this.calculateRoomDebt(periodId, cults || [])
    
    return {
      totalExpected,
      totalPaid,
      totalExpenses,
      roomDebt,
      netBalance: totalPaid - totalExpenses - roomDebt,
      recoveryRate: totalExpected > 0 ? (totalPaid / totalExpected) * 100 : 0
    }
  }
}

window.Utils = Utils
