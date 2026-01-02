// cards.js — card creation and indicator behavior
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  function randInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min }

  // Calcula o valor total de complexidade do card (soma dos indicadores exceto Ajustes)
  K.calculateCardComplexity = function(cardEl) {
    let total = 0
    const indicators = cardEl.querySelectorAll('.indicator')
    indicators.forEach(ind => {
      const label = (ind.querySelector('.ind-label') || {}).textContent || ''
      if (label === 'Ajustes') return // Ajustes não conta para complexidade
      const valueEl = ind.querySelector('.ind-value')
      const num = parseInt((valueEl && valueEl.textContent) || '0', 10) || 0
      total += num
    })
    return total
  }

  // Calcula o pagamento baseado na complexidade total (sistema de faixas)
  K.calculateCardReward = function(complexity) {
    // Cards com complexidade muito baixa (0-2) ou muito alta (>54) não têm valor
    // Isso é normal para cards recém-criados
    if (complexity < 3) return 0
    if (complexity > 54) {
      console.warn(`Complexidade acima do máximo: ${complexity}`)
      return 0
    }
    
    if (complexity >= 3 && complexity <= 12) return 10
    if (complexity >= 13 && complexity <= 24) return 25
    if (complexity >= 25 && complexity <= 36) return 50
    if (complexity >= 37 && complexity <= 54) return 100
    
    return 0
  }

  // Atualiza o display de valor no card
  K.updateCardValueDisplay = function(cardEl) {
    const complexity = K.calculateCardComplexity(cardEl)
    const reward = K.calculateCardReward(complexity)
    const valueEl = cardEl.querySelector('.value-amount')
    if (valueEl) {
      valueEl.textContent = `$${reward}`
    }
  }

  // Processa pagamento do card (APENAS uma vez, quando arquivado)
  K.processCardPayment = function(cardEl) {
    // Verificar se já foi pago
    if (cardEl.dataset.paid === 'true') {
      console.log(`Card ${cardEl.dataset.id} já foi pago anteriormente.`)
      return false
    }

    // Pegar valor diretamente do display do card
    const valueEl = cardEl.querySelector('.value-amount')
    if (!valueEl) {
      console.warn('Elemento .value-amount não encontrado no card')
      return false
    }
    
    // Extrair número do formato "$XX"
    const valueText = valueEl.textContent.replace('$', '').trim()
    const reward = parseInt(valueText, 10) || 0
    
    if (reward > 0) {
      K.addMoney(reward)
      // Marcar como pago permanentemente
      cardEl.dataset.paid = 'true'
      console.log(`Card ${cardEl.dataset.id} pago: $${reward}. Total: $${K.money}`)
      return true
    }
    
    console.warn(`Valor inválido no card ${cardEl.dataset.id}: "${valueText}"`)
    return false
  }

  K.createCard = function(title = 'Titulo do Card', id = null, indicatorsObj = null, paid = false){
    if(id === null){
      if(typeof K.nextId === 'function') id = K.nextId()
      else {
        K._idCounter = K._idCounter || 1
        id = K._idCounter++
      }
    }

    const el = document.createElement('div')
    el.className = 'card'
    el.setAttribute('data-id', id)
    // Restaurar estado de pagamento
    if(paid) el.dataset.paid = 'true'

    // Header with ID then Title
    const header = document.createElement('div')
    header.className = 'card-header'

    const titleEl = document.createElement('div')
    titleEl.className = 'card-title'
    titleEl.textContent = title

    const idEl = document.createElement('div')
    idEl.className = 'card-id'
    idEl.textContent = id

    header.appendChild(idEl)
    header.appendChild(titleEl)
    el.appendChild(header)

    // Área de valor do card
    const cardValue = document.createElement('div')
    cardValue.className = 'card-value'
    cardValue.innerHTML = '<span class="value-amount">$0</span>'
    el.appendChild(cardValue)

    // Difficulty indicators per column (SprintBacklog is queue only, no indicator)
    const indicatorNames = ['Refinamento','Fazendo','Homologando','Ajustes']
    const indicators = document.createElement('div')
    indicators.className = 'indicators'

    indicatorNames.forEach(name=>{
      const item = document.createElement('div')
      item.className = 'indicator'

      const label = document.createElement('div')
      label.className = 'ind-label'
      label.textContent = name

      const value = document.createElement('div')
      value.className = 'ind-value'
      // Ajustes nasce em 0 por regra; demais indicadores recebem valor aleatório
      let initial
      if(indicatorsObj && indicatorsObj[name] !== undefined){
        initial = Math.max(0, indicatorsObj[name])
      } else if(name === 'Ajustes'){
        initial = 0
      } else {
        initial = randInt(2,18)
      }
      value.textContent = String(initial)

      // Indicators are non-interactive; values change only via game logic

      item.appendChild(label)
      item.appendChild(value)
      indicators.appendChild(item)
      if(typeof K.updateIndicatorState === 'function') K.updateIndicatorState(item)
      const cardEl = item.closest('.card')
      if(cardEl && typeof K.checkAndDetachCompletedRoles === 'function') K.checkAndDetachCompletedRoles(cardEl)
    })

    el.appendChild(indicators)

    // Calcular e exibir o valor do card baseado na complexidade
    K.updateCardValueDisplay(el)

    // Add "Próxima Coluna" button
    const nextColBtn = document.createElement('button')
    nextColBtn.className = 'next-column-btn'
    nextColBtn.textContent = 'Próxima Coluna'
    nextColBtn.addEventListener('click', (e)=>{
      e.stopPropagation()
      if(typeof K.moveCardToNextColumn === 'function'){
        K.moveCardToNextColumn(el)
        // Atualizar estado do botão após movimento
        setTimeout(() => {
          if(typeof K.updateNextColumnButtonState === 'function') K.updateNextColumnButtonState(el)
        }, 50)
      }
    })
    el.appendChild(nextColBtn)
    
    // Inicializar estado do botão
    setTimeout(() => {
      if(typeof K.updateNextColumnButtonState === 'function') K.updateNextColumnButtonState(el)
    }, 0)

    // drag handling uses Kanban.dragged shared state
    el.draggable = true
    el.addEventListener('dragstart', e=>{
      K.dragged = el
      const col = el.closest('.column')
      if(col) el.dataset.fromCol = col.getAttribute('data-col') || ''
      el.classList.add('dragging')
      e.dataTransfer.effectAllowed = 'move'
    })
    el.addEventListener('dragend', ()=>{
      K.dragged = null
      el.classList.remove('dragging')
      // small delay to allow drop handler to place element then save
      setTimeout(()=>{ if(typeof K.saveState === 'function') K.saveState() }, 50)
    })

    return el
  }

  // Atualiza o estado visual do botão "Próxima Coluna" baseado nas regras de movimento
  K.updateNextColumnButtonState = function(cardEl) {
    if(!cardEl) return
    const btn = cardEl.querySelector('.next-column-btn')
    if(!btn) return
    
    const nextCol = typeof K.getNextColumn === 'function' ? K.getNextColumn(cardEl) : null
    const canMove = !!nextCol
    
    if(canMove) {
      btn.classList.remove('btn-disabled')
      btn.classList.add('btn-enabled')
    } else {
      btn.classList.remove('btn-enabled')
      btn.classList.add('btn-disabled')
    }
  }

  // Sincroniza estado de todos os botões na tela
  K.syncAllNextColumnButtons = function() {
    document.querySelectorAll('.card').forEach(card => {
      K.updateNextColumnButtonState(card)
    })
  }

  // Visual state helper: adds/removes 'has-role' based on DOM
  K.updateCardVisualState = function(cardEl){
    if(!cardEl) return
    const hasRole = !!cardEl.querySelector('.role')
    cardEl.classList.toggle('has-role', hasRole)
  }

  // Sync all cards (useful after bulk render)
  K.syncCardVisualStates = function(){
    document.querySelectorAll('.card').forEach(function(c){
      K.updateCardVisualState(c)
    })
  }

  // Indicator state helper: adds/removes 'indicator-done' based on .ind-value === 0
  K.updateIndicatorState = function(indicatorEl){
    if(!indicatorEl) return
    const valueEl = indicatorEl.querySelector('.ind-value')
    const num = parseInt((valueEl && valueEl.textContent) || '0', 10) || 0
    indicatorEl.classList.toggle('indicator-done', num === 0)
    
    // Destacar indicador ativo baseado na coluna do card
    const cardEl = indicatorEl.closest('.card')
    if(cardEl) {
      const cardsContainer = cardEl.closest('.cards')
      const currentColumn = cardsContainer ? cardsContainer.getAttribute('data-col') : null
      const labelEl = indicatorEl.querySelector('.ind-label')
      const indicatorLabel = labelEl ? labelEl.textContent : ''
      
      // Mapeamento coluna -> indicador
      const columnToIndicator = {
        'Refinamento': 'Refinamento',
        'Fazendo': 'Fazendo',
        'Homologando': 'Homologando',
        'Ajustes': 'Ajustes'
      }
      
      const isActive = currentColumn && columnToIndicator[currentColumn] === indicatorLabel && num > 0
      indicatorEl.classList.toggle('indicator-active', isActive)
    }
  }

  // Sync all indicators across the board
  K.syncIndicatorStates = function(){
    document.querySelectorAll('.indicator').forEach(function(ind){
      K.updateIndicatorState(ind)
    })
  }

  // Move card to top of its current column (when work is completed)
  K.moveCardToTopOfColumn = function(cardEl){
    if(!cardEl) return
    
    const cardsContainer = cardEl.parentElement
    if(!cardsContainer || !cardsContainer.classList.contains('cards')) return
    
    // Move to first position
    const firstCard = cardsContainer.querySelector('.card')
    if(firstCard && firstCard !== cardEl){
      cardsContainer.insertBefore(cardEl, firstCard)
      console.log('[cards] Card movido para o topo da coluna (trabalho concluído)')
    }
  }
})(window.Kanban)
