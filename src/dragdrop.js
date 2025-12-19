// dragdrop.js — drop zone wiring
(function(K){
  K = K || (window.Kanban = window.Kanban || {})
  K.dragged = null

  K.setupDropZones = function(){
    const board = document.getElementById('board')
    const zones = board.querySelectorAll('.cards')
    zones.forEach(zone=>{
      zone.addEventListener('dragover', e=>{
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        zone.classList.add('drop-over')
      })
      zone.addEventListener('dragleave', ()=>zone.classList.remove('drop-over'))
      zone.addEventListener('drop', e=>{
        e.preventDefault()
        if(K.dragged){
          const zoneCol = zone.getAttribute('data-col')
          const fromCol = K.dragged.dataset.fromCol || null

          // Check backlog size limit
          if(zoneCol === 'Backlog'){
            const count = zone.querySelectorAll('.card').length
            if(count >= 5){
              zone.classList.remove('drop-over')
              return
            }
          }

          // Validate movement according to column sequence rules
          if(typeof K.canMoveCard === 'function'){
            if(!K.canMoveCard(K.dragged, zoneCol)){
              console.warn(`Movement from current column to ${zoneCol} is not allowed by game rules.`)
              zone.classList.remove('drop-over')
              return
            }
          }

          zone.appendChild(K.dragged)
          delete K.dragged.dataset.fromCol
        }
        zone.classList.remove('drop-over')
        if(typeof K.saveState === 'function') K.saveState()
      })
    })
  }
})(window.Kanban)
