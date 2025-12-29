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
  K.updateMoneyDisplay = function(){
    const el = document.getElementById('moneyCounter')
    if(el) el.textContent = '$' + String(K.money || 0)
  }
  K.addMoney = function(amount){
    const startValue = K.money || 0
    const endValue = startValue + amount
    const duration = 800 // duração total da animação em ms
    const steps = Math.min(amount, 50) // máximo de 50 passos para não ficar muito lento
    const increment = amount / steps
    const stepDuration = duration / steps
    
    let currentStep = 0
    
    const animate = () => {
      currentStep++
      if(currentStep <= steps){
        K.money = Math.round(startValue + (increment * currentStep))
        K.updateMoneyDisplay()
        setTimeout(animate, stepDuration)
      } else {
        // Garantir que o valor final seja exato
        K.money = endValue
        K.updateMoneyDisplay()
        if(typeof K.saveState === 'function') K.saveState()
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
    const backlogZone = document.querySelector('.cards[data-col="Backlog"]')
    if(backlogZone) backlogZone.appendChild(K.createCard('Titulo do Card'))
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

    // initialize board from storage or create default
    const saved = (typeof K.loadState === 'function') ? K.loadState() : null
    if(saved){
      if(Number.isFinite(saved.dayCount)) K.dayCount = saved.dayCount
      K.renderFromState(saved)
    }
    else {
      const backlogZone = document.querySelector('.cards[data-col="Backlog"]')
      if(backlogZone) backlogZone.appendChild(K.createCard('Titulo do Card'))
      if(typeof K.saveState === 'function') K.saveState()
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
