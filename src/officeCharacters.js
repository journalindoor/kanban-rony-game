// officeCharacters.js — Sistema de sprites e status de personagens
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  // Distribuição fixa e predefinida de computadores (parece aleatória, mas é determinística)
  // Ordem dos personagens: analista-1, analista-2, analista-3, programador-1, programador-2, programador-3, qa-1, qa-2, qa-3
  const COMPUTER_DISTRIBUTION = [2, 1, 2, 1, 2, 1, 2, 1, 2] // Padrão: alterna com início em computador2

  // Retorna a imagem do computador para um personagem específico
  K.getComputerImage = function(characterId) {
    const order = ['analista-1', 'analista-2', 'analista-3', 'programador-1', 'programador-2', 'programador-3', 'qa-1', 'qa-2', 'qa-3']
    const index = order.indexOf(characterId)
    const computerNumber = index >= 0 ? COMPUTER_DISTRIBUTION[index] : 1
    return `assets/computador${computerNumber}.png`
  }

  // Mapeamento extensível: characterId -> { status, roleType }
  K.characterStates = {
    'programador-1': { status: 'idle', roleType: 'Programador' },
    'programador-2': { status: 'idle', roleType: 'Programador' },
    'programador-3': { status: 'idle', roleType: 'Programador' },
    'analista-1': { status: 'idle', roleType: 'Analista' },
    'analista-2': { status: 'idle', roleType: 'Analista' },
    'analista-3': { status: 'idle', roleType: 'Analista' },
    'qa-1': { status: 'idle', roleType: 'QA/Tester' },
    'qa-2': { status: 'idle', roleType: 'QA/Tester' },
    'qa-3': { status: 'idle', roleType: 'QA/Tester' }
  }

  // Controle de personagens desbloqueados
  // LIBERAÇÃO COMPLETA: todos os 9 personagens disponíveis desde o início
  K.unlockedCharacters = {
    'analista-1': true,
    'analista-2': true,
    'analista-3': true,
    'programador-1': true,
    'programador-2': true,
    'programador-3': true,
    'qa-1': true,
    'qa-2': true,
    'qa-3': true
  }

  // Mapeamento role name -> character-id
  // Conecta os papeis da roles-area com os personagens do office-viewport
  K.roleToCharacterMap = {
    'Analista 1': 'analista-1',
    'Analista 2': 'analista-2',
    'Analista 3': 'analista-3',
    'Programador 1': 'programador-1',
    'Programador 2': 'programador-2',
    'Programador 3': 'programador-3',
    'QA/Tester 1': 'qa-1',
    'QA/Tester 2': 'qa-2',
    'QA/Tester 3': 'qa-3'
  }

  // Mapeamento extensível: characterId -> { idle, working, ... }
  // Cada personagem tem seus próprios sprites por status
  K.characterSpriteMap = {
    'analista-1': {
      'idle': 'analista1-idle.gif',
      'working': 'analista1-working.gif'
    },
    'analista-2': {
      'idle': 'analista2-idle.gif',
      'working': 'analista2-working.gif'
    },
    'analista-3': {
      'idle': 'analista3-idle.gif',
      'working': 'analista3-working.gif'
    },
    'programador-1': {
      'idle': 'programador1-idle.gif',
      'working': 'programador1-working.gif'
    },
    'programador-2': {
      'idle': 'programador2-idle.gif',
      'working': 'programador2-working.gif'
    },
    'programador-3': {
      'idle': 'programador3-idle.gif',
      'working': 'programador3-working.gif'
    },
    'qa-1': {
      'idle': 'qa1-idle.gif',
      'working': 'qa1-working.gif'
    },
    'qa-2': {
      'idle': 'qa2-idle.gif',
      'working': 'qa2-working.gif'
    },
    'qa-3': {
      'idle': 'qa3-idle.gif',
      'working': 'qa3-working.gif'
    }
  }

  // Atualiza o sprite visual de um personagem baseado em seu status atual
  K.updateCharacterSprite = function(characterId) {
    const state = K.characterStates[characterId]
    if (!state) return

    const tile = document.querySelector(`[data-character-id="${characterId}"]`)
    if (!tile) return

    const spriteArea = tile.querySelector('.tile-sprite')
    if (!spriteArea) return

    // Verificar se o personagem está desbloqueado
    const isUnlocked = K.unlockedCharacters[characterId]
    
    // Se não estiver desbloqueado, renderizar apenas offline
    if (!isUnlocked) {
      spriteArea.innerHTML = ''
      const offlineLayer = document.createElement('img')
      offlineLayer.src = 'assets/offline.png'
      offlineLayer.alt = 'offline'
      offlineLayer.className = 'character-layer character-offline'
      spriteArea.appendChild(offlineLayer)
      return
    }

    // Buscar sprites específicos do personagem
    const characterSprites = K.characterSpriteMap[characterId]
    if (!characterSprites) {
      // Personagem sem sprites configurados, apenas mostrar computador
      spriteArea.innerHTML = ''
      const computerLayer = document.createElement('img')
      computerLayer.src = K.getComputerImage(characterId)
      computerLayer.alt = 'computador'
      computerLayer.className = 'character-layer character-computer'
      spriteArea.appendChild(computerLayer)
      return
    }

    const spritePath = characterSprites[state.status]
    if (!spritePath) return

    // Remove camadas anteriores se existirem
    spriteArea.innerHTML = ''

    // Camada 1 (inferior): Personagem
    const bodyLayer = document.createElement('img')
    bodyLayer.src = `assets/${spritePath}`
    bodyLayer.alt = `${characterId} - ${state.status}`
    bodyLayer.className = 'character-layer character-body'
    spriteArea.appendChild(bodyLayer)

    // Camada 2 (superior): Computador (sempre presente)
    const computerLayer = document.createElement('img')
    computerLayer.src = K.getComputerImage(characterId)
    computerLayer.alt = 'computador'
    computerLayer.className = 'character-layer character-computer'
    spriteArea.appendChild(computerLayer)
  }

  // Atualiza o status de um personagem e seu sprite
  K.setCharacterStatus = function(characterId, newStatus) {
    if (!K.characterStates[characterId]) return
    const characterSprites = K.characterSpriteMap[characterId]
    if (characterSprites && !characterSprites[newStatus]) {
      console.warn(`Status "${newStatus}" não mapeado para ${characterId}`)
      return
    }
    
    K.characterStates[characterId].status = newStatus
    K.updateCharacterSprite(characterId)
  }

  // Inicializa todos os personagens com a composição de camadas
  K.initCharacterSprites = function() {
    Object.keys(K.characterStates).forEach(characterId => {
      K.updateCharacterSprite(characterId)
    })
  }

  // ==========================================
  // EFEITO DE LOGIN SEQUENCIAL (COSMÉTICO)
  // Personagens aparecem um por um ao iniciar o jogo
  // ==========================================

  // Ordem fixa de entrada dos personagens
  K.characterLoginSequence = [
    'analista-1',
    'programador-3',
    'qa-2',
    'programador-1',
    'analista-2',
    'qa-1',
    'programador-2',
    'analista-3',
    'qa-3'
  ]

  // Inicializa com efeito de login sequencial
  K.initCharacterSpritesWithSequence = function(delayMs = 500, initialDelayMs = 2000) {
    // Primeiro, renderiza todos como offline
    Object.keys(K.characterStates).forEach(characterId => {
      const spriteArea = document.querySelector(`[data-character-id="${characterId}"] .tile-sprite`)
      if (!spriteArea) return

      // Forçar offline inicial
      spriteArea.innerHTML = ''
      const offlineLayer = document.createElement('img')
      offlineLayer.src = 'assets/offline.png'
      offlineLayer.alt = 'offline'
      offlineLayer.className = 'character-layer character-offline'
      spriteArea.appendChild(offlineLayer)
    })

    // Aguarda 2 segundos antes de começar a sequência de login
    setTimeout(() => {
      // Depois, "loga" cada personagem na ordem definida
      K.characterLoginSequence.forEach((characterId, index) => {
        setTimeout(() => {
          // Verificar se personagem está desbloqueado
          const isUnlocked = K.unlockedCharacters[characterId]
          if (!isUnlocked) {
            // Personagem bloqueado permanece offline
            return
          }

          // Atualizar sprite normalmente (vai para idle)
          K.updateCharacterSprite(characterId)
        }, index * delayMs)
      })
    }, initialDelayMs)
  }

  // Sincroniza status do personagem baseado em role assignment
  K.syncCharacterWithRole = function(roleName, isWorking) {
    const characterId = K.roleToCharacterMap[roleName]
    if (!characterId) {
      console.log('syncCharacterWithRole: characterId não encontrado para', roleName)
      return
    }
    
    const newStatus = isWorking ? 'working' : 'idle'
    console.log('syncCharacterWithRole:', roleName, '->', characterId, 'status:', newStatus)
    K.setCharacterStatus(characterId, newStatus)
  }

  // Atualiza os stats do personagem no office-viewport baseado no roleModel
  // Funções removidas: updateCharacterStats e syncAllCharacterStats
  // O painel de office não exibe mais stats individuais dos personagens
  // Os stats são exibidos apenas nos elementos .role nas áreas de trabalho

  // ==========================================
  // SINCRONIZAÇÃO DE NOMES
  // ==========================================
  // [DESATIVADA] Sincroniza nomes dos personagens da status-bar para a videochamada
  // Nomes agora hardcoded no HTML para economizar processamento
  // Mantida comentada para uso futuro se necessário
  
  /*
  K.syncCharacterNames = function() {
    Object.keys(K.roleToCharacterMap).forEach(roleName => {
      const characterId = K.roleToCharacterMap[roleName]
      const roleEl = document.querySelector(`[data-role="${roleName}"]`)
      if (!roleEl) return
      const roleNameEl = roleEl.querySelector('.role-name')
      if (!roleNameEl) return
      const tileEl = document.querySelector(`[data-character-id="${characterId}"]`)
      if (!tileEl) return
      const infoRoleEl = tileEl.querySelector('.info-role')
      if (!infoRoleEl) return
      infoRoleEl.textContent = roleNameEl.textContent
    })
  }
  */

})(window.Kanban)

