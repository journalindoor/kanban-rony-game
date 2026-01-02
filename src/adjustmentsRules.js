// adjustmentsRules.js — logic for Ajustes generation during Homologando turn
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  // Determine assigned role and its efficiency for a given card
  function getAssignedRoleInfo(cardEl){
    const cardId = parseInt(cardEl.getAttribute('data-id'), 10)
    let roleName = null
    if(K.roleAssignments){
      Object.keys(K.roleAssignments).some(rn=>{
        if(K.roleAssignments[rn] === cardId){ roleName = rn; return true }
        return false
      })
    }
    const roleModel = (roleName && K.roleModels && K.roleModels[roleName]) ? K.roleModels[roleName] : null
    
    // Usar eficiência ativa em Homologando
    const eff = roleModel ? Math.floor(roleModel.getActiveEfficiency('Homologando') || 0) : 0
    
    return { roleName, eff, roleModel }
  }

  // Decide whether to generate ajustes based on efficiency
  function shouldGenerateAdjustments(eff){
    if(eff <= 0) return false // explicit: efficiency 0 does not generate adjustments
    if(eff <= 2) return Math.random() < 0.5
    if(eff <= 4) return Math.random() < 0.25
    return Math.random() < 0.05
  }

  function randomAdjustmentValue(eff){
    if(eff <= 0) return 0
    const maxVal = Math.max(1, 2 * eff)
    return Math.floor(Math.random() * maxVal) + 1
  }

  // Calculate and apply Ajustes when card is in Homologando during a turn
  // Called from gameLogic.js during runStartTurn
  K.calculateAdjustesForHomologando = function(cardEl){
    if(!cardEl) return

    // Find the Ajustes indicator element
    let ajustesIndicator = null
    cardEl.querySelectorAll('.indicator').forEach(ind=>{
      const label = (ind.querySelector('.ind-label') || {}).textContent || ''
      if(label === 'Ajustes') ajustesIndicator = ind
    })
    if(!ajustesIndicator) return

    const valueEl = ajustesIndicator.querySelector('.ind-value')
    if(!valueEl) return

    const { eff, roleName } = getAssignedRoleInfo(cardEl)

    // Only compute adjustments if there is a role assigned
    if(!roleName) return

    let newValue = 0
    if(shouldGenerateAdjustments(eff)){
      newValue = randomAdjustmentValue(eff)
    }

    // Apply the new value
    valueEl.textContent = String(newValue)

    if(typeof K.updateIndicatorState === 'function') K.updateIndicatorState(ajustesIndicator)
  }

})(window.Kanban)
