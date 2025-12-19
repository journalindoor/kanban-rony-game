// main.js — initialization, rendering and UI wiring
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  // internal id counter exposed on K._idCounter
  K._idCounter = K._idCounter || 1
  K.nextId = function(){ return K._idCounter++ }

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
        const el = K.createCard(c.title || 'Titulo do Card', c.id, c.indicators || null)
        zone.appendChild(el)
      })
    })
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
    }
  }

  K.resetGame = function(){
    if(!confirm('Reiniciar o jogo? Isso apagará o progresso salvo.')) return
    try{ localStorage.removeItem(K.STORAGE_KEY) }catch(e){}
    K._idCounter = 1
    K.clearZones()
    const backlogZone = document.querySelector('.cards[data-col="Backlog"]')
    if(backlogZone) backlogZone.appendChild(K.createCard('Titulo do Card'))
    if(typeof K.saveState === 'function') K.saveState()
  }

  // Wire UI buttons
  document.addEventListener('DOMContentLoaded', ()=>{
    const startBtn = document.getElementById('startButton')
    if(startBtn){
      startBtn.addEventListener('click', ()=>{
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
      })
    }

    const resetBtn = document.getElementById('resetButton')
    if(resetBtn) resetBtn.addEventListener('click', K.resetGame)

    // initialize board from storage or create default
    const saved = (typeof K.loadState === 'function') ? K.loadState() : null
    if(saved) K.renderFromState(saved)
    else {
      const backlogZone = document.querySelector('.cards[data-col="Backlog"]')
      if(backlogZone) backlogZone.appendChild(K.createCard('Titulo do Card'))
      if(typeof K.saveState === 'function') K.saveState()
    }

    // sync displayed indicators with current column difficulties
    if(K.columnDifficulties){
      Object.keys(K.columnDifficulties).forEach(colName=>{
        document.querySelectorAll('.indicator').forEach(ind=>{
          const label = (ind.querySelector('.ind-label') || {}).textContent || ''
          if(label === colName){
            const valEl = ind.querySelector('.ind-value')
            if(valEl) valEl.textContent = String(K.columnDifficulties[colName])
          }
        })
      })
    }

    // wire drop zones
    if(typeof K.setupDropZones === 'function') K.setupDropZones()

    // ensure role visuals are rendered (fallback if roleModel's DOMContentLoaded didn't run earlier)
    if(typeof K.renderRole === 'function' && K.roleModels){
      Object.keys(K.roleModels).forEach(rName=>{
        const el = document.querySelector(`[data-role="${rName}"]`)
        if(el) K.renderRole(K.roleModels[rName], el)
      })
    }
  })

})(window.Kanban)
