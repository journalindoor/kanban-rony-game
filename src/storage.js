// storage.js — persistence helpers
(function(K){
  K = K || (window.Kanban = window.Kanban || {})
  
  // Detect storage key based on current page
  K.getStorageKey = function() {
    const path = window.location.pathname
    const chapterMatch = path.match(/chapter(\d+)\.html/)
    
    if (path.includes('tutorial.html')) {
      // Tutorial has its own isolated storage
      return 'kanbanState_tutorial'
    } else if (chapterMatch) {
      // Chapter-specific storage (e.g., 'kanbanState_chapter1')
      return `kanbanState_chapter${chapterMatch[1]}`
    } else {
      // Free mode storage (index.html)
      return 'kanbanState_freemode'
    }
  }
  
  K.STORAGE_KEY = K.getStorageKey()
  console.log('Using storage key:', K.STORAGE_KEY)
  
  K.columnNames = ['Backlog','Refinamento','SprintBacklog','Fazendo','Homologando','Ajustes','Publicado','Arquivados']

  K.saveState = function(){
    const board = document.getElementById('board')
    const state = { 
      idCounter: (K._idCounter||1), 
      columns: {}, 
      dayCount: K.dayCount || 0, 
      money: K.money || 0, 
      chapter1GoalAchieved: K.chapter1GoalAchieved || false,
      unlocksTriggered: K.unlocksTriggered || []
    }
    K.columnNames.forEach(name=>{
      const zone = board.querySelector('.cards[data-col="'+name+'"]')
      state.columns[name] = []
      if(zone){
        zone.querySelectorAll('.card').forEach(cardEl=>{
          const id = parseInt(cardEl.getAttribute('data-id'),10) || null
          const title = (cardEl.querySelector('.card-title') || {}).textContent || 'Titulo do Card'
          const paid = cardEl.dataset.paid === 'true'
          const birthday = Number(cardEl.dataset.birthday || 0)
          const leadTime = Number(cardEl.dataset.leadTime || 0)
          const cycleTime = Number(cardEl.dataset.cycleTime || 0)
          const indicators = {}
          cardEl.querySelectorAll('.indicator').forEach(ind=>{
            const label = (ind.querySelector('.ind-label') || {}).textContent || ''
            const raw = parseInt((ind.querySelector('.ind-value') || {}).textContent,10)
            const value = Number.isFinite(raw) ? raw : 1
            if(label) indicators[label] = value
          })
          state.columns[name].push({ id, title, indicators, paid, birthday, leadTime, cycleTime })
        })
      }
    })
    // record role assignments (roleName -> cardId or null) and role model data
    state.roles = {}
    state.roleData = {}
    document.querySelectorAll('[data-role]').forEach(roleEl=>{
      const roleName = roleEl.getAttribute('data-role')
      const cardEl = roleEl.closest('.card')
      state.roles[roleName] = cardEl ? parseInt(cardEl.getAttribute('data-id'),10) : null
      // if role model exists in Kanban.roleModels, record its data
      if(K.roleModels && K.roleModels[roleName] && typeof K.roleModels[roleName].toJSON === 'function'){
        state.roleData[roleName] = K.roleModels[roleName].toJSON()
      }
    })
    // include column difficulties if present
    if(K.columnDifficulties) state.columnDifficulties = K.columnDifficulties
    try{ localStorage.setItem(K.STORAGE_KEY, JSON.stringify(state)) }catch(e){ console.warn('saveState failed', e) }
  }

  K.loadState = function(){
    try{
      const raw = localStorage.getItem(K.STORAGE_KEY)
      if(!raw) return null
      const parsed = JSON.parse(raw)
      if(Number.isFinite(parsed.dayCount)) K.dayCount = parsed.dayCount
      if(Number.isFinite(parsed.money)) K.money = parsed.money
      K.chapter1GoalAchieved = parsed.chapter1GoalAchieved || false
      K.unlocksTriggered = parsed.unlocksTriggered || []
      // if column difficulties saved, restore into K but enforce minimum 2
      if(parsed.columnDifficulties){
        K.columnDifficulties = K.columnDifficulties || {}
        Object.keys(parsed.columnDifficulties).forEach(k=>{
          const v = parseInt(parsed.columnDifficulties[k], 10) || 0
          K.columnDifficulties[k] = Math.max(2, v)
        })
      }
      return parsed
    }catch(e){ console.warn('loadState failed', e); return null }
  }
})(window.Kanban)
