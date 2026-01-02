// chapterManager.js — Chapter progression and state transfer system
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  // Chapter configuration
  K.CHAPTER_CONFIG = {
    1: {
      name: 'Sobreviva à Sprint',
      moneyGoal: 500,
      nextChapter: 'chapter2.html'
    },
    2: {
      name: 'Mais gente resolve?',
      moneyGoal: null, // TBD
      nextChapter: 'chapter3.html'
    },
    3: {
      name: 'Cycle Time: quanto tempo dói',
      moneyGoal: null, // TBD
      nextChapter: 'chapter4.html'
    },
    4: {
      name: 'Throughput: constância importa',
      moneyGoal: null, // TBD
      nextChapter: 'chapter5.html'
    },
    5: {
      name: 'WIP: o inimigo invisível',
      moneyGoal: null, // TBD
      nextChapter: null
    }
  }

  // Current chapter number (extracted from URL or default to 1)
  K.currentChapter = 1

  // Detect current chapter from URL
  K.detectCurrentChapter = function() {
    const path = window.location.pathname
    const match = path.match(/chapter(\d+)\.html/)
    if (match) {
      K.currentChapter = parseInt(match[1], 10)
    }
    return K.currentChapter
  }

  // Check if chapter goal is reached
  K.checkChapterGoal = function() {
    const config = K.CHAPTER_CONFIG[K.currentChapter]
    if (!config || !config.moneyGoal) return false

    const currentMoney = K.money || 0
    
    // Habilitar botão assim que atingir o objetivo
    if (currentMoney >= config.moneyGoal) {
      if (K.currentChapter === 'chapter1' || K.currentChapter === 1) {
        K.chapter1GoalAchieved = true
        if(typeof K.enableChapter2Button === 'function') {
          K.enableChapter2Button()
        }
      }
    }
    
    // Check if goal reached and modal not shown yet
    if (currentMoney >= config.moneyGoal && !K.chapterGoalShown) {
      K.chapterGoalShown = true
      K.showChapterTransitionModal()
      return true
    }
    
    return false
  }

  // Show chapter transition modal
  K.showChapterTransitionModal = function() {
    const modal = document.getElementById('chapterTransitionModal')
    if (!modal) return

    // Update modal stats
    const modalDays = document.getElementById('modalDays')
    const modalMoney = document.getElementById('modalMoney')
    
    if (modalDays) modalDays.textContent = K.dayCount || 0
    if (modalMoney) modalMoney.textContent = '$' + (K.money || 0)

    // Show modal
    modal.style.display = 'flex'

    // Wire buttons
    const continueBtn = document.getElementById('continueChapterBtn')
    const stayBtn = document.getElementById('stayChapterBtn')

    if (continueBtn) {
      continueBtn.onclick = function() {
        K.transferStateToNextChapter()
      }
    }

    if (stayBtn) {
      stayBtn.onclick = function() {
        modal.style.display = 'none'
        // Marcar que o objetivo foi atingido
        K.chapter1GoalAchieved = true
        // Salvar estado
        if(typeof K.saveState === 'function') K.saveState()
        // Habilitar botão para ir ao capítulo 2
        K.enableChapter2Button()
      }
    }
  }

  // Habilitar/desabilitar botão do capítulo 2
  K.enableChapter2Button = function() {
    const btn = document.getElementById('goToChapter2Button')
    if (btn) {
      btn.disabled = false
      btn.onclick = function() {
        K.transferStateToNextChapter()
      }
    }
  }

  K.disableChapter2Button = function() {
    const btn = document.getElementById('goToChapter2Button')
    if (btn) {
      btn.disabled = true
      btn.onclick = null
    }
  }

  // Transfer state to next chapter
  K.transferStateToNextChapter = function() {
    const config = K.CHAPTER_CONFIG[K.currentChapter]
    if (!config || !config.nextChapter) {
      alert('Próximo capítulo ainda não disponível!')
      return
    }

    // Prepare state transfer data
    const transferData = {
      fromChapter: K.currentChapter,
      dayCount: K.dayCount || 0,
      money: K.money || 0,
      roleModels: {},
      unlockedCharacters: K.unlockedCharacters || {},
      timestamp: Date.now()
    }

    // Include role models data
    if (K.roleModels) {
      Object.keys(K.roleModels).forEach(roleName => {
        const role = K.roleModels[roleName]
        if (role && typeof role.toJSON === 'function') {
          transferData.roleModels[roleName] = role.toJSON()
        }
      })
    }

    // Save transfer data to localStorage
    try {
      localStorage.setItem('KANBAN_CHAPTER_TRANSFER', JSON.stringify(transferData))
      console.log('State transfer prepared:', transferData)
    } catch(e) {
      console.error('Error saving transfer data:', e)
    }

    // Navigate to next chapter
    window.location.href = config.nextChapter
  }

  // Load transferred state (called on chapter load)
  K.loadTransferredState = function() {
    try {
      const transferDataStr = localStorage.getItem('KANBAN_CHAPTER_TRANSFER')
      if (!transferDataStr) return null

      const transferData = JSON.parse(transferDataStr)
      console.log('Loading transferred state:', transferData)

      // Apply transferred state
      if (Number.isFinite(transferData.dayCount)) {
        K.dayCount = transferData.dayCount
      }

      if (Number.isFinite(transferData.money)) {
        K.money = transferData.money
      }

      if (transferData.unlockedCharacters) {
        K.unlockedCharacters = Object.assign({}, transferData.unlockedCharacters)
      }

      // Restore role models
      if (transferData.roleModels && K.roleModels) {
        Object.keys(transferData.roleModels).forEach(roleName => {
          if (K.roleModels[roleName] && typeof K.roleModels[roleName].fromJSON === 'function') {
            K.roleModels[roleName].fromJSON(transferData.roleModels[roleName])
          }
        })
      }

      // Clear transfer data after loading
      localStorage.removeItem('KANBAN_CHAPTER_TRANSFER')

      return transferData
    } catch(e) {
      console.error('Error loading transferred state:', e)
      return null
    }
  }

  // Initialize chapter system
  document.addEventListener('DOMContentLoaded', function() {
    K.detectCurrentChapter()
    console.log('Current chapter:', K.currentChapter)

    // Back to free mode button (only in chapter pages)
    const backToFreeModeBtn = document.getElementById('backToFreeModeButton')
    if (backToFreeModeBtn) {
      backToFreeModeBtn.addEventListener('click', function() {
        const confirmed = confirm(
          'Voltar ao Modo Livre?\n\n' +
          'Você pode retornar ao Capítulo 1 a qualquer momento.\n' +
          'Seu progresso neste capítulo será salvo automaticamente.\n\n' +
          'Deseja continuar?'
        )
        if (confirmed) {
          // Save current state before leaving
          if (typeof K.saveState === 'function') K.saveState()
          
          // Navigate to free mode
          window.location.href = 'index.html'
        }
      })
    }

    // Chapter 1 always starts fresh (no state transfer, clear saved state)
    if (K.currentChapter === 1) {
      console.log('Chapter 1: Starting fresh (clearing all saved data)')
      
      // Clear chapter transfer data
      try {
        localStorage.removeItem('KANBAN_CHAPTER_TRANSFER')
      } catch(e) {}
      
      // Clear chapter 1 saved state to ensure fresh start
      try {
        localStorage.removeItem('kanbanState_chapter1')
        // Limpar também a lista de cards usados
        localStorage.removeItem('kanbanState_chapter1_usedCards')
      } catch(e) {}
      
      return
    }

    // Try to load transferred state from previous chapter (chapters 2+)
    const transferredState = K.loadTransferredState()
    if (transferredState) {
      console.log('State transferred from Chapter', transferredState.fromChapter)
      
      // Update displays after transfer
      if (typeof K.updateDayCounterDisplay === 'function') K.updateDayCounterDisplay()
      if (typeof K.updateMoneyDisplay === 'function') K.updateMoneyDisplay()
      
      // Re-render roles with transferred data
      if (typeof K.renderRole === 'function' && K.roleModels) {
        Object.keys(K.roleModels).forEach(roleName => {
          const el = document.querySelector(`[data-role="${roleName}"]`)
          if (el) K.renderRole(K.roleModels[roleName], el)
        })
      }

      // Sync character sprites
      if (typeof K.initCharacterSprites === 'function') K.initCharacterSprites()
    }
  })


})(window.Kanban)
