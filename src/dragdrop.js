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
          
          // Atualizar estado do personagem anexado (se houver)
          const roleEl = K.dragged.querySelector('.role')
          if(roleEl && typeof K.applyCharacterState === 'function'){
            const roleName = roleEl.getAttribute('data-role')
            K.applyCharacterState(roleName)
          }
          
          // Atualizar estados dos indicadores para destacar o correto
          if(typeof K.syncIndicatorStates === 'function') K.syncIndicatorStates()
          
          // Update WIP counters after card movement
          if(typeof K.updateWipCounters === 'function') K.updateWipCounters()
          
          // Notify tutorial that a card was moved
          if(typeof K.TutorialState !== 'undefined' && K.TutorialState.tutorialActive){
            console.log('[DragDrop] Card moved, notifying tutorial');
            setTimeout(() => {
              if(typeof K.TutorialState.executeCallback === 'function'){
                K.TutorialState.executeCallback('dragCard');
              }
            }, 100);
          }
          
          // If dropped in Publicado, detach any role AFTER moving
          if(zoneCol === 'Publicado'){
            setTimeout(() => {
              if(typeof K.detachRoleFromCard === 'function'){
                K.detachRoleFromCard(K.dragged)
                console.log('Role detached after dropping in Publicado')
              }
              // Also run auto-detach as backup
              if(typeof K.autoDetachRolesInPublicado === 'function'){
                K.autoDetachRolesInPublicado()
              }
            }, 10)
          }
        }
        zone.classList.remove('drop-over')
        if(typeof K.saveState === 'function') K.saveState()
      })
    })
  }
})(window.Kanban)
