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
        if(K.dragged) zone.appendChild(K.dragged)
        zone.classList.remove('drop-over')
        if(typeof K.saveState === 'function') K.saveState()
      })
    })
  }
})(window.Kanban)
