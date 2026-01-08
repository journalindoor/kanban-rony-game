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

  // Decide whether to generate ajustes - 50% fixed chance
  function shouldGenerateAdjustments(){
    return Math.random() < 0.5
  }

  function randomAdjustmentValue(){
    // Random value between 1 and 10
    return Math.floor(Math.random() * 10) + 1
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

    const { roleName } = getAssignedRoleInfo(cardEl)

    // Only compute adjustments if there is a role assigned
    if(!roleName) return

    let newValue = 0
    if(shouldGenerateAdjustments()){
      newValue = randomAdjustmentValue()
    }

    // Apply the new value
    valueEl.textContent = String(newValue)

    if(typeof K.updateIndicatorState === 'function') K.updateIndicatorState(ajustesIndicator)
  }

})(window.Kanban)
