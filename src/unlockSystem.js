// unlockSystem.js — Progressive character unlock system for Chapter 1
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  // Unlock milestones for Chapter 1
  const UNLOCK_MILESTONES = [
    { money: 150, character: 'analista-2', name: 'Analista 2', modalId: 'unlockModal1' },
    { money: 350, character: 'programador-2', name: 'Programador 2', modalId: 'unlockModal2' },
    { money: 600, character: 'qa-2', name: 'QA/Tester 2', modalId: 'unlockModal3' }
  ]

  // Track which unlocks have been triggered
  K.unlocksTriggered = K.unlocksTriggered || []

  // Check if we should trigger an unlock
  K.checkUnlockMilestones = function() {
    // Garantir que unlocksTriggered está inicializado
    if (!K.unlocksTriggered) {
      K.unlocksTriggered = []
    }
    
    const currentMoney = K.money || 0
    console.log(`[UnlockSystem] Verificando marcos - Dinheiro atual: $${currentMoney}`)
    console.log(`[UnlockSystem] Marcos já desbloqueados:`, K.unlocksTriggered)
    
    UNLOCK_MILESTONES.forEach((milestone, index) => {
      console.log(`[UnlockSystem] Verificando marco ${index}: $${milestone.money} (${milestone.name})`)
      console.log(`[UnlockSystem] - currentMoney >= milestone.money: ${currentMoney >= milestone.money}`)
      console.log(`[UnlockSystem] - !K.unlocksTriggered.includes(index): ${!K.unlocksTriggered.includes(index)}`)
      
      // Check if milestone reached and not yet triggered
      if (currentMoney >= milestone.money && !K.unlocksTriggered.includes(index)) {
        console.log(`[UnlockSystem] 🎉 Disparando desbloqueio do marco ${index}!`)
        
        // Mark as triggered
        K.unlocksTriggered.push(index)
        
        // Unlock character
        if (K.unlockedCharacters) {
          K.unlockedCharacters[milestone.character] = true
          console.log(`[UnlockSystem] - Personagem ${milestone.character} desbloqueado:`, K.unlockedCharacters[milestone.character])
        }
        
        // Show unlock modal
        K.showUnlockModal(milestone.modalId, milestone.character, milestone.name)
        
        // Save state
        if (typeof K.saveState === 'function') {
          K.saveState()
        }
        
        console.log(`[UnlockSystem] Desbloqueado: ${milestone.name} (${milestone.character})`)
      }
    })
  }

  // Show unlock modal
  K.showUnlockModal = function(modalId, characterId, characterName) {
    const modal = document.getElementById(modalId)
    if (!modal) {
      console.warn(`[UnlockSystem] Modal não encontrado: ${modalId}`)
      return
    }

    // Show modal
    modal.style.display = 'flex'

    // Find and setup close button
    const closeBtn = modal.querySelector('.unlock-close-btn')
    if (closeBtn) {
      closeBtn.onclick = function() {
        modal.style.display = 'none'
        
        // Update UI to show unlocked character
        K.updateUnlockedCharactersUI()
        
        // Re-render role to remove locked state
        if (K.roleModels && characterName) {
          const roleModel = K.roleModels[characterName]
          if (roleModel) {
            const roleEl = document.querySelector(`[data-role="${characterName}"]`)
            if (roleEl && typeof K.renderRole === 'function') {
              K.renderRole(roleModel, roleEl)
            }
          }
        }
        
        // Update office panel character
        if (typeof K.updateCharacterSprite === 'function') {
          K.updateCharacterSprite(characterId)
        }
        
        // Re-setup role squares to enable drag
        if (typeof K.setupRoleSquares === 'function') {
          K.setupRoleSquares()
        }
      }
    }
  }

  // Update UI to reflect unlocked characters
  K.updateUnlockedCharactersUI = function() {
    // Update office panel tiles
    if (typeof K.initCharacterSpritesWithSequence === 'function') {
      // Pequeno delay para garantir que o estado foi atualizado
      setTimeout(() => {
        K.initCharacterSpritesWithSequence(0, 0) // Sem delay, update imediato
      }, 100)
    }
  }

})(window.Kanban)
