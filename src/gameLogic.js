// gameLogic.js — core game computations separated from DOM
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  function randInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min }

  // Ensure default column difficulties exist
  K.columnDifficulties = K.columnDifficulties || {
    Refinamento: 10,
    SprintBacklog: 12,
    Fazendo: 15,
    Homologando: 8,
    Ajustes: 6,
    Backlog: 2,
    Publicado: 2
  }

  // Apply one role's random contribution to the column difficulty
  // Pure function: takes current difficulties map and returns new map and a result object
  function applyRoleToColumn(difficulties, roleName, cardId, roleModel, cardColumnName){
    const prev = typeof difficulties[cardColumnName] === 'number' ? difficulties[cardColumnName] : 0
    // determine maximum efficiency (must be integer)
    const effMax = Math.floor(Number(roleModel.eficiencia) || 0)
    if(effMax < 1){
      // no contribution possible
      return { difficulties: Object.assign({}, difficulties), result: { roleName, cardId, column: cardColumnName, roll:0, prev, next: prev } }
    }
    // roll an integer between 1 and effMax (inclusive)
    const roll = randInt(1, effMax)
    // subtract roll from previous difficulty, but never go below 0
    const next = Math.max(0, prev - roll)
    const newDiff = Object.assign({}, difficulties)
    newDiff[cardColumnName] = next
    return { difficulties: newDiff, result: { roleName, cardId, column: cardColumnName, roll, prev, next } }
  }

  // Run a start turn: for each assigned role, apply contribution to that card's column
  // Returns array of result objects for each role processed
  K.runStartTurn = function () {
  const assignments = K.roleAssignments || {}
  const results = []

  Object.keys(assignments).forEach(roleName => {
    const cardId = assignments[roleName]
    if (!cardId) return

    const roleModel = K.roleModels && K.roleModels[roleName]
    if (!roleModel) return

    const cardEl = document.querySelector(`.card[data-id="${cardId}"]`)
    if (!cardEl) return

    const colEl = cardEl.closest('.column')
    const colName = colEl ? colEl.getAttribute('data-col') : null
    if (!colName) return

    // encontra o indicador do card correspondente à coluna atual
    const indicators = cardEl.querySelectorAll('.indicator')
    let targetIndicator = null

    indicators.forEach(ind => {
      const label = ind.querySelector('.ind-label')?.textContent
      if (label === colName) targetIndicator = ind
    })

    if (!targetIndicator) return

    const valueEl = targetIndicator.querySelector('.ind-value')
    if (!valueEl) return

    const atual = parseInt(valueEl.textContent, 10) || 0
    const maxEff = Math.floor(roleModel.eficiencia)

    if (maxEff < 1 || atual <= 0) return

    const roll = Math.floor(Math.random() * maxEff) + 1
    const next = Math.max(0, atual - roll)

    valueEl.textContent = String(next)

    results.push({
      role: roleName,
      cardId,
      column: colName,
      roll,
      before: atual,
      after: next
    })
  })

  if (typeof K.saveState === 'function') K.saveState()
  return results
}


})(window.Kanban)
