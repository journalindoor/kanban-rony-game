// storage.js — persistence helpers
(function(K){
  K = K || (window.Kanban = window.Kanban || {})
  K.STORAGE_KEY = 'kanbanState_v1'
  K.columnNames = ['Backlog','Refinamento','SprintBacklog','Fazendo','Homologando','Ajustes','Publicado','Arquivados']

  K.saveState = function(){
    const board = document.getElementById('board')
    const state = { idCounter: (K._idCounter||1), columns: {}, dayCount: K.dayCount || 0 }
    K.columnNames.forEach(name=>{
      const zone = board.querySelector('.cards[data-col="'+name+'"]')
      state.columns[name] = []
      if(zone){
        zone.querySelectorAll('.card').forEach(cardEl=>{
          const id = parseInt(cardEl.getAttribute('data-id'),10) || null
          const title = (cardEl.querySelector('.card-title') || {}).textContent || 'Titulo do Card'
          const indicators = {}
          cardEl.querySelectorAll('.indicator').forEach(ind=>{
            const label = (ind.querySelector('.ind-label') || {}).textContent || ''
            const raw = parseInt((ind.querySelector('.ind-value') || {}).textContent,10)
            const value = Number.isFinite(raw) ? raw : 1
            if(label) indicators[label] = value
          })
          state.columns[name].push({ id, title, indicators })
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
