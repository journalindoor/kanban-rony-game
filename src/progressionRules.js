// progressionRules.js — automatic role detach when current column indicator reaches 0
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  // Auto-detach roles when the indicator corresponding to the card's current column reaches 0
  K.checkAndDetachCompletedRoles = function(cardEl){
    if(!cardEl) return false

    // Determine the card's current column
    const colEl = cardEl.closest('.column')
    const colName = colEl ? colEl.getAttribute('data-col') : null
    if(!colName) return false

    // Find the indicator that matches the current column name
    const indicators = cardEl.querySelectorAll('.indicator')
    let targetIndicator = null
    indicators.forEach(ind => {
      const label = (ind.querySelector('.ind-label') || {}).textContent || ''
      if(label === colName) targetIndicator = ind
    })

    // If the card's current column has no indicator (e.g., Backlog/SprintBacklog/Publicado), do nothing
    if(!targetIndicator) return false

    const valueEl = targetIndicator.querySelector('.ind-value')
    const num = parseInt((valueEl && valueEl.textContent) || '0', 10) || 0

    // Only detach if the indicator for the CURRENT column is zero
    if(num !== 0) return false

    // Current column indicator is 0 — detach all roles from this card
    const roles = cardEl.querySelectorAll('.role')
    const rolesArea = document.querySelector('.roles-area')
    
    if(rolesArea && roles.length > 0){
      let detached = false
      roles.forEach(roleEl => {
        const roleName = roleEl.getAttribute('data-role')
        rolesArea.appendChild(roleEl)
        delete roleEl.dataset.attached
        roleEl.classList.remove('role-attached')
        
        // Update assignment map
        K.roleAssignments = K.roleAssignments || {}
        K.roleAssignments[roleName] = null
        
        // Sincronizar personagem no office-viewport (idle)
        if(typeof K.syncCharacterWithRole === 'function') {
          K.syncCharacterWithRole(roleName, false)
        }
        
        detached = true
        
        console.log(`Role "${roleName}" detached (indicator reached 0)`)
      })
      
      // Update visual state (remove has-role from card)
      if(detached && typeof K.updateCardVisualState === 'function'){
        K.updateCardVisualState(cardEl)
      }
      
      // Save new state
      if(detached && typeof K.saveState === 'function') K.saveState()
      return detached
    }
    
    return false
  }

})(window.Kanban)
