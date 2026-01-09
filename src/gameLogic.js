// gameLogic.js — core game computations separated from DOM
// 
// ARQUITETURA DO SISTEMA DE EFICIÊNCIA:
// 1. Estados pré-calculados criados no constructor de Role (roleModel.js)
// 2. CSS controla visibilidade via data-* attributes (role-states.css)
// 3. getActiveEfficiency() retorna o estado correto baseado na coluna
// 4. runStartTurn() usa eficiência ativa para calcular progresso
// 5. Mudança de coluna → atributos atualizados → CSS muda → próximo turno usa nova eficiência
// 
// GARANTIAS:
// - Nenhum valor é recalculado (apenas leitura de estados pré-calculados)
// - Nenhum valor é acumulado (cada turno usa apenas eficiência atual)
// - Trocar coluna não duplica efeito (atributos sobrescritos)
// - Remover/reassociar papel não quebra estado (applyCharacterState sempre sincroniza)
// - Tutorial, modo livre, capítulos usam mesma lógica (função única)
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  function randInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min }

  // FUNÇÃO LEGADA - NÃO USADA
  // Mantida para compatibilidade mas runStartTurn() implementa a lógica diretamente
  function applyRoleToColumn(difficulties, roleName, cardId, roleModel, cardColumnName){
    const prev = typeof difficulties[cardColumnName] === 'number' ? difficulties[cardColumnName] : 0
    // OBSOLETO: usa roleModel.eficiencia ao invés de getActiveEfficiency()
    const effMax = Math.floor(Number(roleModel.eficiencia) || 0)
    if(effMax < 1){
      return { difficulties: Object.assign({}, difficulties), result: { roleName, cardId, column: cardColumnName, roll:0, prev, next: prev } }
    }
    const roll = randInt(1, effMax)
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

  console.log('[gameLogic] === INÍCIO DO TURNO ===')
  console.log('[gameLogic] Assignments:', assignments)
  console.log('[gameLogic] RoleModels:', K.roleModels)

  Object.keys(assignments).forEach(roleName => {
    console.log('[gameLogic] Processando role:', roleName)
    
    const cardId = assignments[roleName]
    if (!cardId) {
      console.log('[gameLogic] - Sem card atribuído')
      return
    }
    console.log('[gameLogic] - Card ID:', cardId)

    const roleModel = K.roleModels && K.roleModels[roleName]
    if (!roleModel) {
      console.log('[gameLogic] - RoleModel não encontrado')
      return
    }
    console.log('[gameLogic] - RoleModel encontrado, eficiência:', roleModel.eficiencia)

    const cardEl = document.querySelector(`.card[data-id="${cardId}"]`)
    if (!cardEl) {
      console.log('[gameLogic] - Elemento do card não encontrado no DOM')
      return
    }
    console.log('[gameLogic] - Card encontrado no DOM')

    const colEl = cardEl.closest('.column')
    const colName = colEl ? colEl.getAttribute('data-col') : null
    if (!colName) {
      console.log('[gameLogic] - Coluna não identificada')
      return
    }
    console.log('[gameLogic] - Card está na coluna:', colName)
    
    // SprintBacklog e outras colunas sem indicadores não devem processar
    const columnsWithoutIndicators = ['Backlog', 'SprintBacklog', 'Publicado', 'Arquivados']
    if (columnsWithoutIndicators.includes(colName)) {
      console.log('[gameLogic] - Coluna', colName, 'não tem indicador para trabalhar')
      return
    }

    // encontra o indicador do card correspondente à coluna atual
    const indicators = cardEl.querySelectorAll('.indicator')
    let targetIndicator = null

    console.log('[gameLogic] - Procurando indicador com label:', colName)
    indicators.forEach(ind => {
      const label = ind.querySelector('.ind-label')?.textContent
      console.log('[gameLogic]   * Indicador:', label, '| Valor:', ind.querySelector('.ind-value')?.textContent)
      if (label === colName) targetIndicator = ind
    })

    if (!targetIndicator) {
      console.warn('[gameLogic] - ERRO: Indicador não encontrado para coluna:', colName)
      return
    }
    console.log('[gameLogic] - Indicador correspondente encontrado!')

    const valueEl = targetIndicator.querySelector('.ind-value')
    if (!valueEl) return

    const atual = parseInt(valueEl.textContent, 10) || 0
    
    // PONTO ÚNICO DE CÁLCULO DE EFICIÊNCIA
    // getActiveEfficiency() retorna estado pré-calculado correto para esta coluna
    // NÃO modifica valores, NÃO acumula, apenas lê o estado apropriado
    const maxEff = Math.floor(roleModel.getActiveEfficiency(colName))
    
    console.log('[gameLogic] - Eficiência ativa para', roleName, 'em', colName, '=', maxEff)

    if (maxEff < 1 || atual <= 0) return

    const roll = Math.floor(Math.random() * maxEff) + 1
    const next = Math.max(0, atual - roll)
    
    console.log('[gameLogic] - Roll:', roll, '| Antes:', atual, '→ Depois:', next)

    // Update indicator value in DOM
    valueEl.textContent = String(next)
    
    // Update visual state (color) of indicator
    if(typeof K.updateIndicatorState === 'function') K.updateIndicatorState(targetIndicator)
    
    // Move card to top if indicator reached 0 (ready to advance)
    if(next === 0 && typeof K.moveCardToTopOfColumn === 'function'){
      K.moveCardToTopOfColumn(cardEl)
    }
    
    // If card is in Homologando, calculate Ajustes based on efficiency
    if(colName === 'Homologando'){
      if(typeof K.calculateAdjustesForHomologando === 'function') K.calculateAdjustesForHomologando(cardEl)
    }
    
    // Auto-detach roles if indicator reached 0
    if(typeof K.checkAndDetachCompletedRoles === 'function') K.checkAndDetachCompletedRoles(cardEl)

    results.push({
      role: roleName,
      cardId,
      column: colName,
      roll,
      before: atual,
      after: next
    })
  })

  // Save and sync all changes once at the end
  if (typeof K.saveState === 'function') K.saveState()
  if (typeof K.syncIndicatorStates === 'function') K.syncIndicatorStates()
  if (typeof K.syncAllNextColumnButtons === 'function') K.syncAllNextColumnButtons()
  return results
}


})(window.Kanban)
