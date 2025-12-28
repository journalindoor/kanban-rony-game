// officeCharacters.js — estado visual e comportamental dos personagens do escritório
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  const MOVEMENT_INTERVAL = 3000 // Movimento a cada 3 segundos
  const MOVEMENT_RANGE = 30 // Pixels de variação máxima
  let movementTimer = null

  // Mapa central: associa papel → estação de trabalho
  // Por padrão, personagens começam nas estações da coluna esquerda
  const roleStationMap = {
    'Analista': 'left-1',
    'Programador': 'left-2',
    'QA/Tester': 'left-3'
  }

  // Resolve qual estação pertence a um papel
  function getStationForRole(roleName){
    const stationId = roleStationMap[roleName]
    if(!stationId) return null
    return document.querySelector(`.desk-station[data-station-id="${stationId}"]`)
  }

  // Obtém a posição da cadeira de uma estação
  function getChairPosition(station){
    if(!station) return null
    const chair = station.querySelector('.item-chair')
    if(!chair) return null
    
    const rect = chair.getBoundingClientRect()
    const viewportRect = document.querySelector('.office-viewport').getBoundingClientRect()
    
    return {
      x: rect.left - viewportRect.left + (rect.width / 2),
      y: rect.top - viewportRect.top + (rect.height / 2)
    }
  }

  // Verifica se um papel está associado a um card ativo
  function isRoleAssigned(roleName){
    const assignments = K.roleAssignments || {}
    return assignments[roleName] && assignments[roleName] !== null
  }

  // Move personagem para posição específica
  function moveCharacterToPosition(characterEl, targetPos){
    if(!characterEl || !targetPos) return
    
    const currentRect = characterEl.getBoundingClientRect()
    const viewportRect = characterEl.closest('.office-viewport').getBoundingClientRect()
    
    const currentX = currentRect.left - viewportRect.left + (currentRect.width / 2)
    const currentY = currentRect.top - viewportRect.top + (currentRect.height / 2)
    
    const deltaX = targetPos.x - currentX
    const deltaY = targetPos.y - currentY
    
    characterEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    characterEl.style.transition = 'transform 1s ease-in-out'
  }

  // Atualiza o estado visual de um personagem
  function updateCharacterState(characterEl){
    if(!characterEl) return
    
    const roleName = characterEl.getAttribute('data-role')
    const isWorking = isRoleAssigned(roleName)
    const currentState = characterEl.getAttribute('data-state')
    
    // Se o estado não mudou, não fazer nada (evita sobrescrever)
    if(currentState === 'working' && isWorking) return
    if(currentState === 'idle' && !isWorking) return
    
    // Remove estados antigos apenas se mudando de estado
    characterEl.classList.remove('state-working', 'state-idle')
    characterEl.removeAttribute('data-state')
    
    // Aplica novo estado
    if(isWorking){
      characterEl.classList.add('state-working')
      characterEl.setAttribute('data-state', 'working')
      
      // Move para a cadeira da estação
      const station = getStationForRole(roleName)
      const chairPos = getChairPosition(station)
      if(chairPos){
        moveCharacterToPosition(characterEl, chairPos)
      }
    } else {
      characterEl.classList.add('state-idle')
      characterEl.setAttribute('data-state', 'idle')
      // O movimento idle será controlado pelo sistema de movimento
    }
  }

  // Atualiza todos os personagens do escritório
  function updateAllCharacters(){
    const characters = document.querySelectorAll('.office-characters .character')
    characters.forEach(char => updateCharacterState(char))
  }

  // Move personagens idle dentro da área do escritório
  function moveIdleCharacters(){
    const characters = document.querySelectorAll('.office-characters .character.state-idle')
    
    characters.forEach(char => {
      // Verificação extra: só move se realmente estiver idle
      const currentState = char.getAttribute('data-state')
      if(currentState !== 'idle') return
      
      // Gera movimento aleatório pequeno
      const randomX = (Math.random() - 0.5) * MOVEMENT_RANGE
      const randomY = (Math.random() - 0.5) * MOVEMENT_RANGE
      
      // Aplica transformação suave
      char.style.transform = `translate(${randomX}px, ${randomY}px)`
      char.style.transition = 'transform 2s ease-in-out'
    })
  }

  // Inicia o sistema de movimento
  function startMovementSystem(){
    stopMovementSystem() // Limpa timer anterior se existir
    
    movementTimer = setInterval(() => {
      moveIdleCharacters()
    }, MOVEMENT_INTERVAL)
    
    // Executa uma vez imediatamente
    moveIdleCharacters()
  }

  // Para o sistema de movimento
  function stopMovementSystem(){
    if(movementTimer){
      clearInterval(movementTimer)
      movementTimer = null
    }
  }

  // Inicializa o sistema quando o DOM estiver pronto
  function initOfficeCharacters(){
    updateAllCharacters()
    startMovementSystem()
  }

  // Exporta funções públicas
  K.updateCharacterState = updateCharacterState
  K.updateAllCharacters = updateAllCharacters
  K.initOfficeCharacters = initOfficeCharacters
  K.stopCharacterMovement = stopMovementSystem
  K.startCharacterMovement = startMovementSystem
  K.getStationForRole = getStationForRole
  K.roleStationMap = roleStationMap

})(window.Kanban)
