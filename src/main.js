// main.js — initialization, rendering and UI wiring
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  // internal id counter exposed on K._idCounter
  K._idCounter = K._idCounter || 1
  K.nextId = function(){ return K._idCounter++ }

  // day counter state
  K.dayCount = Number.isFinite(K.dayCount) ? K.dayCount : 0
  K.updateDayCounterDisplay = function(){
    const el = document.getElementById('dayCounter')
    if(el) el.textContent = String(K.dayCount || 0)
  }

  // money system
  K.money = Number.isFinite(K.money) ? K.money : 0
  K.moneyAnimationActive = false
  K.moneyAnimationTimeout = null
  K.moneyAnimationTargetValue = 0 // Valor alvo da animação
  
  K.updateMoneyDisplay = function(){
    const el = document.getElementById('moneyCounter')
    if(el) el.textContent = '$' + String(K.money || 0)
  }
  
  K.addMoney = function(amount){
    console.log('[addMoney] Chamado com amount:', amount)
    
    // Adicionar valor imediatamente ao total interno
    K.money = (K.money || 0) + amount
    const newTargetValue = K.money
    console.log('[addMoney] Novo valor total:', newTargetValue)
    
    // Se já houver animação rodando, apenas atualizar o valor alvo
    if(K.moneyAnimationActive) {
      console.log('[addMoney] Animação já ativa, atualizando valor alvo para:', newTargetValue)
      K.moneyAnimationTargetValue = newTargetValue
      return
    }
    
    // Iniciar nova animação
    console.log('[addMoney] Iniciando nova animação')
    K.moneyAnimationActive = true
    K.moneyAnimationTargetValue = newTargetValue
    
    const startDisplayValue = parseInt(document.getElementById('moneyCounter')?.textContent.replace('$', '') || '0', 10)
    const duration = 800
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Usar o valor alvo atual (pode ter mudado se outro card foi arquivado)
      const currentTarget = K.moneyAnimationTargetValue
      const displayValue = Math.round(startDisplayValue + ((currentTarget - startDisplayValue) * progress))
      
      const el = document.getElementById('moneyCounter')
      if(el) el.textContent = '$' + displayValue
      
      if(progress < 1){
        K.moneyAnimationTimeout = setTimeout(animate, 16) // ~60fps
      } else {
        // Animação terminou - verificar se valor alvo mudou durante a animação
        if(K.moneyAnimationTargetValue !== currentTarget){
          // Valor mudou, continuar animando
          console.log('[addMoney] Valor mudou durante animação, continuando...')
          animate()
        } else {
          // Garantir valor final exato
          K.updateMoneyDisplay()
          K.moneyAnimationActive = false
          K.moneyAnimationTimeout = null
          console.log('[addMoney] Animação concluída')
          
          // Salvar estado após animação
          if(typeof K.saveState === 'function') K.saveState()
          
          // Verificar objetivo do capítulo
          if(typeof K.checkChapterGoal === 'function') K.checkChapterGoal()
        }
      }
    }
    
    animate()
  }
  K.removeMoney = function(amount){
    K.money = Math.max(0, (K.money || 0) - amount)
    K.updateMoneyDisplay()
    if(typeof K.saveState === 'function') K.saveState()
  }

  // Move all cards from Publicado to Arquivados
  K.archivePublishedCards = function(){
    const publishedZone = document.querySelector('.cards[data-col="Publicado"]')
    const archivedZone = document.querySelector('.cards[data-col="Arquivados"]')
    if(!publishedZone || !archivedZone) return 0
    const toMove = Array.from(publishedZone.querySelectorAll('.card'))
    console.log(`Arquivando ${toMove.length} cards de Publicado`)
    toMove.forEach(card=> {
      // Processar pagamento ANTES de mover (transição Publicado → Arquivado)
      if(typeof K.processCardPayment === 'function') {
        const paid = K.processCardPayment(card)
        console.log(`Tentativa de pagamento card ${card.dataset.id}: ${paid ? 'SUCESSO' : 'FALHA/JÁ PAGO'}`)
      } else {
        console.warn('K.processCardPayment não está definida!')
      }
      archivedZone.appendChild(card)
    })
    return toMove.length
  }

  K.clearZones = function(){
    K.columnNames.forEach(name=>{
      const zone = document.querySelector('.cards[data-col="'+name+'"]')
      if(zone) zone.innerHTML = ''
    })
  }

  K.renderFromState = function(state){
    if(!state) return
    K._idCounter = state.idCounter || K._idCounter
    K.clearZones()
    K.columnNames.forEach(name=>{
      const zone = document.querySelector('.cards[data-col="'+name+'"]')
      if(!zone) return
      const arr = (state.columns && state.columns[name]) ? state.columns[name] : []
      arr.forEach(c=>{
        const el = K.createCard(c.title || 'Titulo do Card', c.id, c.indicators || null, c.paid || false)
        zone.appendChild(el)
      })
    })
    // Inicializa sprites após renderizar cards
    if(K.initCharacterSprites) K.initCharacterSprites()
    // Atualizar displays
    if(K.updateMoneyDisplay) K.updateMoneyDisplay()
    // Se no capítulo 1, configurar estado do botão do capítulo 2
    if(K.currentChapter === 'chapter1') {
      if(K.chapter1GoalAchieved && typeof K.enableChapter2Button === 'function') {
        K.enableChapter2Button()
      } else if(typeof K.disableChapter2Button === 'function') {
        K.disableChapter2Button()
      }
    }
    // restore role attachments if present
    if(state.roles){
        // restore role attachments and hydrate role model data if present
        if(state.roleData && K.roleModels){
          Object.keys(state.roleData).forEach(rName=>{
            if(K.roleModels[rName] && typeof K.roleModels[rName].fromJSON === 'function'){
              K.roleModels[rName].fromJSON(state.roleData[rName])
            }
          })
        }

          // then attach role elements to cards
        Object.keys(state.roles).forEach(roleName=>{
          const cardId = state.roles[roleName]
          const roleEl = document.querySelector(`[data-role="${roleName}"]`)
          if(roleEl){
            if(cardId){
              const cardEl = document.querySelector(`.card[data-id="${cardId}"]`)
              if(cardEl){
                cardEl.appendChild(roleEl)
                if(typeof K.updateCardVisualState === 'function') K.updateCardVisualState(cardEl)
              }
            } else {
              document.querySelector('.roles-area').appendChild(roleEl)
            }
          }
        })
          // keep runtime assignments map
          K.roleAssignments = Object.assign({}, state.roles)
        // re-render role visuals after hydration
        if(K.renderRole && K.roleModels){
          Object.keys(K.roleModels).forEach(rName=>{
            const el = document.querySelector(`[data-role="${rName}"]`)
            if(el) K.renderRole(K.roleModels[rName], el)
          })
        }
        if(typeof K.syncCardVisualStates === 'function') K.syncCardVisualStates()
        if(typeof K.syncIndicatorStates === 'function') K.syncIndicatorStates()
        if(typeof K.syncAllNextColumnButtons === 'function') K.syncAllNextColumnButtons()
    }
  }

  K.resetGame = function(){
    if(!confirm('Reiniciar o jogo? Isso apagará o progresso salvo.')) return
    try{ localStorage.removeItem(K.STORAGE_KEY) }catch(e){}
    
    // Clear used cards list to allow reusing cards from bank
    try{
      const usedCardsKey = K.getUsedCardsKey ? K.getUsedCardsKey() : null
      if(usedCardsKey){
        localStorage.removeItem(usedCardsKey)
        console.log('[resetGame] Lista de cards usados limpa')
      }
    }catch(e){
      console.warn('[resetGame] Erro ao limpar cards usados:', e)
    }
    
    // clear assignments and role models so fresh talentos are generated
    K.roleAssignments = {}
    K.roleModels = {}
    K.dayCount = 0
    K.money = 0
    // move all role elements back to roles area
    const rolesArea = document.querySelector('.roles-area')
    if(rolesArea){
      document.querySelectorAll('.role').forEach(r=>{
        rolesArea.appendChild(r)
        delete r.dataset.attached
        r.classList.remove('role-attached')
      })
    }
    K._idCounter = 1
    K.clearZones()
    // reinitialize role models with new talentos and render
    if(typeof K.initializeRoles === 'function') K.initializeRoles(true)
    if(typeof K.updateDayCounterDisplay === 'function') K.updateDayCounterDisplay()
    if(typeof K.updateMoneyDisplay === 'function') K.updateMoneyDisplay()
    if(typeof K.saveState === 'function') K.saveState()
  }

  // Wire UI buttons
  document.addEventListener('DOMContentLoaded', ()=>{
    const startBtn = document.getElementById('startButton')
    if(startBtn){
      startBtn.addEventListener('click', ()=>{
        // increment day counter on each turn start
        K.dayCount = (K.dayCount || 0) + 1
        if(typeof K.updateDayCounterDisplay === 'function') K.updateDayCounterDisplay()
        try{
          if(typeof K.runStartTurn === 'function'){
            const results = K.runStartTurn()
            console.log('runStartTurn results', results)
          } else {
            console.warn('K.runStartTurn is not defined')
          }
        }catch(e){
          console.error('Error running start turn', e)
        }

        // Backlog capacity rule: create only up to 5 total
        try{
          const capacity = (typeof K.remainingBacklogCapacity === 'function') ? K.remainingBacklogCapacity(5) : (function(){
            const zone = document.querySelector('.cards[data-col="Backlog"]')
            const count = zone ? zone.querySelectorAll('.card').length : 0
            return Math.max(0, 5 - count)
          })()

          if(capacity > 0){
            if(typeof K.fillBacklogToMax === 'function'){
              K.fillBacklogToMax(5)
            } else {
              const zone = document.querySelector('.cards[data-col="Backlog"]')
              for(let i=0;i<capacity;i++) if(zone) zone.appendChild(K.createCard())
              if(typeof K.saveState === 'function') K.saveState()
            }
          } else {
            // no space: do not create any new cards
            console.log('Backlog already has 5 cards; no new cards created.')
          }
        }catch(e){ console.error('Error applying backlog capacity rule', e) }

        // auto-archive: move any cards in Publicado to Arquivados
        try{
          const moved = (typeof K.archivePublishedCards === 'function') ? K.archivePublishedCards() : 0
          if(moved>0) console.log(`Archived ${moved} published card(s).`)
        }catch(e){ console.error('Error archiving published cards', e) }

        // persist updated state (including day counter) after the turn action
        if(typeof K.saveState === 'function') K.saveState()
      })
    }

    const resetBtn = document.getElementById('resetButton')
    if(resetBtn) resetBtn.addEventListener('click', K.resetGame)

    // Chapter 1 start button (only in index.html)
    const startChapter1Btn = document.getElementById('startChapter1Button')
    if(startChapter1Btn){
      startChapter1Btn.addEventListener('click', function(){
        const confirmed = confirm(
          'Iniciar o Capítulo 1?\n\n' +
          'Isso iniciará um novo jogo do zero. ' +
          'Todo o progresso do modo livre será descartado.\n\n' +
          'Deseja continuar?'
        )
        if(confirmed){
          // Clear any existing transfer data to ensure clean start
          try {
            localStorage.removeItem('KANBAN_CHAPTER_TRANSFER')
          } catch(e) {}
          
          // Navigate to chapter 1
          window.location.href = 'chapter1.html'
        }
      })
    }

    // initialize board from storage or create default
    const saved = (typeof K.loadState === 'function') ? K.loadState() : null
    if(saved){
      if(Number.isFinite(saved.dayCount)) K.dayCount = saved.dayCount
      K.renderFromState(saved)
    }
    else {
      // Não criar card inicial - backlog começa vazio
      if(typeof K.saveState === 'function') K.saveState()
      // Inicializar sprites quando não há save
      if(typeof K.initCharacterSprites === 'function') K.initCharacterSprites()
    }

    if(typeof K.updateDayCounterDisplay === 'function') K.updateDayCounterDisplay()
    if(typeof K.updateMoneyDisplay === 'function') K.updateMoneyDisplay()

    // wire drop zones
    if(typeof K.setupDropZones === 'function') K.setupDropZones()

    // ensure role visuals are rendered (fallback if roleModel's DOMContentLoaded didn't run earlier)
    if(typeof K.renderRole === 'function' && K.roleModels){
      Object.keys(K.roleModels).forEach(rName=>{
        const el = document.querySelector(`[data-role="${rName}"]`)
        if(el) K.renderRole(K.roleModels[rName], el)
      })
    }
    
    // Sincronizar stats dos personagens no office-viewport
    if(typeof K.syncAllCharacterStats === 'function') K.syncAllCharacterStats()

    // Toggle archived column visibility
    const toggleArchivedBtn = document.getElementById('toggleArchivedButton')
    if(toggleArchivedBtn){
      toggleArchivedBtn.addEventListener('click', ()=>{
        const archivedCol = document.querySelector('.column[data-col="Arquivados"]')
        if(archivedCol) archivedCol.classList.toggle('archived-hidden')
      })
    }
  })

})(window.Kanban)
