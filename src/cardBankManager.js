// cardBankManager.js — Gerencia bancos de cards pré-definidos e geração de backlog
(function(K){
  K = K || (window.Kanban = window.Kanban || {})
  
  // Detecta o contexto da página atual
  K.detectPageContext = function(){
    const path = window.location.pathname
    
    if(path.includes('tutorial.html')){
      return { type: 'tutorial', dataKey: 'TUTORIAL_BASIC_CARDS' }
    }
    
    const chapterMatch = path.match(/chapter(\d+)\.html/)
    if(chapterMatch){
      const chapterNum = chapterMatch[1]
      return { type: 'chapter', chapter: chapterNum, dataKey: `CHAPTER_${chapterNum}_CARDS` }
    }
    
    return { type: 'freemode', dataKey: null }
  }
  
  // Carrega banco de cards do objeto global window
  K.loadCardBank = function(dataKey){
    if(!dataKey){
      console.log('[cardBankManager] Nenhuma chave de dados fornecida')
      return null
    }
    
    console.log('[cardBankManager] Procurando por window["' + dataKey + '"]')
    console.log('[cardBankManager] window.' + dataKey + ' existe?', typeof window[dataKey])
    
    if(!window[dataKey]){
      console.warn('[cardBankManager] Dados não encontrados:', dataKey)
      console.log('[cardBankManager] Chaves disponíveis em window:', Object.keys(window).filter(k => k.includes('CARDS')))
      return null
    }
    
    const data = window[dataKey]
    console.log('[cardBankManager] Dados encontrados:', data)
    console.log('[cardBankManager] Cards carregados de', dataKey, ':', data.cards ? data.cards.length : 0)
    return data.cards || []
  }
  
  // Obtém a chave de armazenamento para cards usados
  K.getUsedCardsKey = function(){
    const storageKey = K.getStorageKey ? K.getStorageKey() : 'kanbanState_freemode'
    return `${storageKey}_usedCards`
  }
  
  // Obtém a lista de IDs de cards já usados
  K.getUsedCards = function(){
    const key = K.getUsedCardsKey()
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }
  
  // Marca um card como usado
  K.markCardAsUsed = function(cardId){
    const usedCards = K.getUsedCards()
    if(!usedCards.includes(cardId)){
      usedCards.push(cardId)
      const key = K.getUsedCardsKey()
      localStorage.setItem(key, JSON.stringify(usedCards))
      console.log('[cardBankManager] Card marcado como usado:', cardId)
    }
  }
  
  // Verifica se um card já foi usado
  K.isCardUsed = function(cardId){
    return K.getUsedCards().includes(cardId)
  }
  
  // Filtra cards disponíveis do banco (não usados)
  K.getAvailableCardsFromBank = function(cardBank){
    if(!cardBank || !Array.isArray(cardBank)) return []
    
    return cardBank.filter(card => !K.isCardUsed(card.id))
  }
  
  // Gera um card aleatório (lógica existente)
  K.generateRandomCard = function(){
    // Cards aleatórios começam em 1 e usam K._idCounter
    const baseId = K.nextId ? K.nextId() : (K._idCounter ? K._idCounter++ : 1)
    // Formatar como 0001, 0002, 0003...
    const id = baseId
    const title = 'Card #' + baseId
    
    // Indicadores aleatórios (mantém lógica existente)
    const indicators = {
      'Refinamento': Math.floor(Math.random() * 17) + 2,   // 2-18
      'Fazendo': Math.floor(Math.random() * 17) + 2,       // 2-18
      'Homologando': Math.floor(Math.random() * 17) + 2,   // 2-18
      'Ajustes': 0
    }
    
    return { id, title, indicators }
  }
  
  // Função principal: gera backlog completo ou parcial
  K.generateBacklog = function(maxCards = 5){
    const MAX_BANK_CARDS = 3
    
    const context = K.detectPageContext()
    console.log('[cardBankManager] Contexto da página:', context)
    
    const backlog = []
    
    // 1. Tentar carregar cards do banco
    let availableCards = []
    if(context.dataKey){
      console.log('[cardBankManager] Carregando dados:', context.dataKey)
      const cardBank = K.loadCardBank(context.dataKey)
      console.log('[cardBankManager] Cards carregados:', cardBank)
      if(cardBank){
        availableCards = K.getAvailableCardsFromBank(cardBank)
        console.log('[cardBankManager] Cards disponíveis (não usados):', availableCards.length, availableCards)
      } else {
        console.warn('[cardBankManager] loadCardBank retornou null ou undefined')
      }
    } else {
      console.log('[cardBankManager] Nenhum banco de dados definido para este contexto')
    }
    
    // 2. Adicionar até 3 cards do banco (prioridade), respeitando o limite solicitado
    const bankCardsToAdd = Math.min(availableCards.length, MAX_BANK_CARDS, maxCards)
    console.log('[cardBankManager] Adicionando', bankCardsToAdd, 'cards do banco ao backlog')
    for(let i = 0; i < bankCardsToAdd; i++){
      console.log('[cardBankManager] Adicionando card do banco:', availableCards[i].title)
      backlog.push(availableCards[i])
    }
    
    // 3. Completar com cards aleatórios até atingir maxCards
    const randomCardsNeeded = maxCards - backlog.length
    console.log('[cardBankManager] Adicionando', randomCardsNeeded, 'cards aleatórios')
    for(let i = 0; i < randomCardsNeeded; i++){
      const randomCard = K.generateRandomCard()
      console.log('[cardBankManager] Card aleatório gerado:', randomCard.title)
      backlog.push(randomCard)
    }
    
    console.log('[cardBankManager] Backlog gerado:', backlog.length, 'cards (', bankCardsToAdd, 'do banco,', randomCardsNeeded, 'aleatórios)')
    console.log('[cardBankManager] Títulos dos cards:', backlog.map(c => c.title))
    
    return backlog
  }
  
  // Renderiza cards do backlog no DOM
  K.renderBacklogCards = function(cards){
    const backlogZone = document.querySelector('.cards[data-col="Backlog"]')
    if(!backlogZone) return
    
    cards.forEach(cardData => {
      const cardEl = K.createCard(cardData.title, cardData.id, cardData.indicators, false)
      backlogZone.appendChild(cardEl)
      
      // Marcar card como usado quando inserido no backlog
      if(cardData.id && typeof K.markCardAsUsed === 'function'){
        K.markCardAsUsed(cardData.id)
      }
    })
    
    // Update WIP counters after rendering cards
    if(typeof K.updateWipCounters === 'function') K.updateWipCounters()
  }
  
  // Popula o backlog (substitui a função existente)
  K.populateBacklog = function(){
    const backlogCards = K.generateBacklog()
    K.renderBacklogCards(backlogCards)
    
    if(typeof K.saveState === 'function') K.saveState()
  }
  
})(window.Kanban)
