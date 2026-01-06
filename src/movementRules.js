// movementRules.js — validate sequential card movement between columns
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  // Column order (sequence)
  const COLUMN_ORDER = ['Backlog', 'Refinamento', 'SprintBacklog', 'Fazendo', 'Homologando', 'Ajustes', 'Publicado']

  // Transition rules: from column → required indicator name for move to next column
  // Note: SprintBacklog has NO indicator (it's a queue); transitions use Refinamento for all queue movement
  const TRANSITION_RULES = {
    'Backlog': null,              // No condition, always allowed
    'Refinamento': 'Refinamento', // Refinamento must be 0
    'SprintBacklog': 'Refinamento', // Refinamento must be 0 (queue stage, no own indicator)
    'Fazendo': 'Fazendo',         // Fazendo must be 0
    'Homologando': 'Homologando', // Homologando must be 0
    'Ajustes': 'Ajustes',         // Ajustes must be 0
    'Publicado': null             // No movement out (final stage)
  }

  // Get indicator value for a card by column name
  // Returns the numeric value or 0 if not found
  function getIndicatorValue(cardEl, colName){
    if(!cardEl || !colName) return 0
    
    const indicators = cardEl.querySelectorAll('.indicator')
    for(let i = 0; i < indicators.length; i++){
      const labelEl = indicators[i].querySelector('.ind-label')
      const label = (labelEl && labelEl.textContent) ? labelEl.textContent.trim() : ''
      
      if(label === colName){
        const valueEl = indicators[i].querySelector('.ind-value')
        const raw = parseInt((valueEl && valueEl.textContent) || '0', 10)
        return Number.isFinite(raw) ? raw : 0
      }
    }
    return 0
  }

  // Validate if card can move from current column to target column
  K.canMoveCard = function(cardEl, targetColName){
    if(!cardEl || !targetColName) return false

    // Get current column
    const currentColEl = cardEl.closest('.column')
    const currentCol = currentColEl ? currentColEl.getAttribute('data-col') : null
    if(!currentCol) return false

    // Find positions in sequence
    const currentIdx = COLUMN_ORDER.indexOf(currentCol)
    const targetIdx = COLUMN_ORDER.indexOf(targetColName)

    // Both columns must be valid
    if(currentIdx === -1 || targetIdx === -1){
      console.warn(`Invalid column: current="${currentCol}", target="${targetColName}"`)
      return false
    }

    const isMovingForward = targetIdx === currentIdx + 1
    const isStayingSame = targetIdx === currentIdx
    const isJumpingAhead = targetIdx > currentIdx + 1

    // Special case: Homologando -> Publicado allowed when Homologando==0 AND Ajustes==0
    if(currentCol === 'Homologando' && targetColName === 'Publicado'){
      const homVal = getIndicatorValue(cardEl, 'Homologando')
      const ajVal = getIndicatorValue(cardEl, 'Ajustes')
      const allowed = homVal === 0 && ajVal === 0
      if(!allowed){
        console.warn(`Cannot jump Homologando -> Publicado. Homologando=${homVal}, Ajustes=${ajVal}`)
      }
      return allowed
    }

    // Block any other jumps beyond next column
    if(isJumpingAhead){
      console.warn(`Cannot jump columns: from ${currentCol} (idx ${currentIdx}) to ${targetColName} (idx ${targetIdx})`)
      return false
    }

    // If trying to move to same column, allow
    if(isStayingSame) return true

    // If moving to next column, check condition
    if(isMovingForward){
      const requiredIndicator = TRANSITION_RULES[currentCol]
      
      // If no condition required, allow
      if(requiredIndicator === null){
        console.log(`Movement ${currentCol} → ${targetColName}: no condition, allowed`)
        return true
      }
      
      // Check if required indicator is zero
      const indicatorValue = getIndicatorValue(cardEl, requiredIndicator)
      const allowed = (indicatorValue === 0)
      
      console.log(`Movement ${currentCol} → ${targetColName}: checking ${requiredIndicator}=${indicatorValue}, ${allowed ? 'allowed' : 'blocked'}`)
      return allowed
    }

    return false
  }

  // Helper: get next allowed column for a card
  K.getNextColumn = function(cardEl){
    if(!cardEl) return null
    const currentColEl = cardEl.closest('.column')
    const currentCol = currentColEl ? currentColEl.getAttribute('data-col') : null
    if(!currentCol) return null

    const idx = COLUMN_ORDER.indexOf(currentCol)
    if(idx === -1 || idx >= COLUMN_ORDER.length - 1) return null

    const nextCol = COLUMN_ORDER[idx + 1]
    if(K.canMoveCard(cardEl, nextCol)) return nextCol
    
    // Special case: if in Homologando and can skip to Publicado, return that
    if(currentCol === 'Homologando' && K.canMoveCard(cardEl, 'Publicado')){
      return 'Publicado'
    }
    
    return null
  }

  // Move card to next valid column (for button click)
  K.moveCardToNextColumn = function(cardEl){
    if(!cardEl) return false
    
    const nextCol = K.getNextColumn(cardEl)
    if(!nextCol){
      console.log('Card cannot advance: requirements not met')
      return false
    }
    
    const targetZone = document.querySelector(`.cards[data-col="${nextCol}"]`)
    if(!targetZone){
      console.warn(`Target zone ${nextCol} not found`)
      return false
    }
    
    // Move the card
    targetZone.appendChild(cardEl)
    console.log(`Card moved to ${nextCol}`)
    
    // Atualizar estado do personagem anexado (se houver)
    const roleEl = cardEl.querySelector('.role')
    if(roleEl && typeof K.applyCharacterState === 'function'){
      const roleName = roleEl.getAttribute('data-role')
      K.applyCharacterState(roleName)
    }
    
    // Atualizar estados dos indicadores para destacar o correto
    if(typeof K.syncIndicatorStates === 'function') K.syncIndicatorStates()
    
    // Update WIP counters after card movement
    if(typeof K.updateWipCounters === 'function') K.updateWipCounters()
    
    // If moved to Publicado, detach any role AFTER moving
    if(nextCol === 'Publicado'){
      setTimeout(() => {
        if(typeof K.detachRoleFromCard === 'function'){
          K.detachRoleFromCard(cardEl)
          console.log('Role detached after moving to Publicado')
        }
        // Also run auto-detach as backup
        if(typeof K.autoDetachRolesInPublicado === 'function'){
          K.autoDetachRolesInPublicado()
        }
        // Save state after detaching
        if(typeof K.saveState === 'function') K.saveState()
      }, 10)
    } else {
      // Save state normally for other columns
      if(typeof K.saveState === 'function') K.saveState()
    }
    
    return true
  }

})(window.Kanban)
