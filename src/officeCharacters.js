// officeCharacters.js — Sistema de sprites e status de personagens
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

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
  // Estado inicial: apenas 1 de cada tipo disponível
  K.unlockedCharacters = {
    'analista-1': true,
    'analista-2': false,
    'analista-3': false,
    'programador-1': true,
    'programador-2': false,
    'programador-3': false,
    'qa-1': true,
    'qa-2': false,
    'qa-3': false
  }

  // Mapeamento role name -> character-id
  // Conecta os papeis da roles-area com os personagens do office-viewport
  K.roleToCharacterMap = {
    'Analista': 'analista-1',
    'Programador': 'programador-1',
    'QA/Tester': 'qa-1'
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
      computerLayer.src = 'assets/computador1.png'
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
    computerLayer.src = 'assets/computador1.png'
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
  K.updateCharacterStats = function(roleName) {
    const characterId = K.roleToCharacterMap[roleName]
    if (!characterId) return

    const tile = document.querySelector(`[data-character-id="${characterId}"]`)
    if (!tile) return

    const roleModel = K.roleModels && K.roleModels[roleName]
    if (!roleModel) return

    // Atualizar os 3 stats: felicidade, talento, eficiência
    const statsContainer = tile.querySelector('.info-stats')
    if (!statsContainer) return

    const statItems = statsContainer.querySelectorAll('.stat-item')
    if (statItems.length >= 3) {
      statItems[0].textContent = `😊 ${roleModel.felicidade}`
      statItems[1].textContent = `🎯 ${roleModel.talentoNatural}`
      statItems[2].textContent = `⚡ ${roleModel.eficiencia}`
    }
  }

  // Sincroniza todos os stats dos personagens desbloqueados
  K.syncAllCharacterStats = function() {
    Object.keys(K.roleToCharacterMap).forEach(roleName => {
      K.updateCharacterStats(roleName)
    })
  }

})(window.Kanban)

