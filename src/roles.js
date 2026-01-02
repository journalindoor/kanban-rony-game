// roles.js — role squares drag/drop and assignment
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  // roleNames and container
  const rolesContainerSelector = '#rolesArea'
  const roleSelector = '.role'

  function onDragStartRole(e){
    const role = e.currentTarget.getAttribute('data-role')
    e.dataTransfer.setData('text/role', role)
    e.dataTransfer.effectAllowed = 'move'
    K.draggingRole = role
    // mark dragging element
    e.currentTarget.classList.add('dragging-role')
  }
  function onDragEndRole(e){
    delete K.draggingRole
    e.currentTarget.classList.remove('dragging-role')
  }

  function isCardInBacklog(card){
    const col = card.closest('.column')
    return col && col.getAttribute('data-col') === 'Backlog'
  }

  function isCardInPublicado(card){
    const col = card.closest('.column')
    return col && col.getAttribute('data-col') === 'Publicado'
  }

  // attach role element to card
  function attachRoleToCard(roleEl, cardEl){
    if(!roleEl || !cardEl) return false
    if(isCardInBacklog(cardEl)) return false
    if(isCardInPublicado(cardEl)) return false
    // enforce single role per card
    if(cardEl.querySelector('.role')) return false
    // ensure role not already attached elsewhere
    const roleName = roleEl.getAttribute('data-role')
    const current = document.querySelector('[data-role="'+roleName+'"]')
    // if current exists and is not this roleEl, find if it's inside a card already
    // but we operate on the actual roleEl node so check dataset
    if(roleEl.dataset.attached === 'true'){
      // already attached
      return false
    }
    // append into card; mark attached
    cardEl.appendChild(roleEl)
    roleEl.dataset.attached = 'true'
    roleEl.classList.add('role-attached')
    
    // Notify tutorial that a role was attached to a card
    if(typeof K.TutorialState !== 'undefined' && K.TutorialState.tutorialActive){
      console.log('[Roles] Role attached to card, notifying tutorial');
      setTimeout(() => {
        if(typeof K.TutorialState.executeCallback === 'function'){
          K.TutorialState.executeCallback('dragRole');
        }
      }, 100);
    }
    
    // Mover card para última posição da coluna usando função centralizada
    if(typeof K.moveCardToBottomOfColumn === 'function'){
      K.moveCardToBottomOfColumn(cardEl)
    }
    
    if(typeof K.updateCardVisualState === 'function') K.updateCardVisualState(cardEl)
    // maintain runtime mapping of assignments
    K.roleAssignments = K.roleAssignments || {}
    // Converter ID para número (todos os IDs são numéricos agora)
    K.roleAssignments[roleName] = parseInt(cardEl.getAttribute('data-id'), 10)
    
    // Atualizar estado do personagem baseado na coluna
    if(typeof K.applyCharacterState === 'function') {
      K.applyCharacterState(roleName)
    }
    
    // Sincronizar personagem no office-viewport (working)
    if(typeof K.syncCharacterWithRole === 'function') {
      K.syncCharacterWithRole(roleName, true)
    }
    if(typeof K.saveState === 'function') K.saveState()
    return true
  }

  // detach role to roles area
  function detachRole(roleEl){
    const container = document.querySelector(rolesContainerSelector)
    if(!container) return false
    const prevCard = roleEl.closest('.card')
    const roleName = roleEl.getAttribute('data-role')
    container.appendChild(roleEl)
    delete roleEl.dataset.attached
    roleEl.classList.remove('role-attached')
    if(prevCard && typeof K.updateCardVisualState === 'function') K.updateCardVisualState(prevCard)
    K.roleAssignments = K.roleAssignments || {}
    K.roleAssignments[roleName] = null
    
    // Atualizar estado do personagem para estado 0 (sem card)
    if(typeof K.applyCharacterState === 'function') {
      K.applyCharacterState(roleName)
    }
    
    // Sincronizar personagem no office-viewport (idle)
    if(typeof K.syncCharacterWithRole === 'function') {
      K.syncCharacterWithRole(roleName, false)
    }
    if(typeof K.saveState === 'function') K.saveState()
    return true
  }

  // Detach any role from a card (helper function)
  K.detachRoleFromCard = function(cardEl){
    if(!cardEl) return false
    const roleEl = cardEl.querySelector('.role')
    if(!roleEl) return false
    console.log('Detaching role from card:', cardEl.dataset.id, 'Role:', roleEl.dataset.role)
    return detachRole(roleEl)
  }

  // Auto-detach roles from cards in Publicado column
  K.autoDetachRolesInPublicado = function(){
    const publicadoZone = document.querySelector('.cards[data-col="Publicado"]')
    if(!publicadoZone) return
    
    const cardsWithRoles = publicadoZone.querySelectorAll('.card .role')
    cardsWithRoles.forEach(roleEl => {
      const cardEl = roleEl.closest('.card')
      console.log('Auto-detaching role from card in Publicado:', cardEl?.dataset?.id)
      detachRole(roleEl)
    })
  }

  // Setup drag listeners on role squares
  function setupRoleSquares(){
    // Buscar TODOS os roles (na área de roles E nos cards)
    const allRoles = document.querySelectorAll(roleSelector)
    console.log('[setupRoleSquares] Configurando', allRoles.length, 'roles');
    allRoles.forEach(r=>{
      r.setAttribute('draggable','true')
      console.log('[setupRoleSquares] Configurando role:', r.getAttribute('data-role'), 'draggable:', r.draggable);
      // Remover event listeners antigos para evitar duplicação
      r.removeEventListener('dragstart', onDragStartRole)
      r.removeEventListener('dragend', onDragEndRole)
      // Adicionar event listeners
      r.addEventListener('dragstart', onDragStartRole)
      r.addEventListener('dragend', onDragEndRole)
      // allow click on attached role to detach back
      r.addEventListener('dblclick', ()=>{
        if(r.dataset.attached === 'true') detachRole(r)
      })
    })
  }

  // Manual detach via button
  function detachRoleManually(roleName){
    const roleEl = document.querySelector('[data-role="'+roleName+'"]')
    if(roleEl && roleEl.dataset.attached === 'true'){
      detachRole(roleEl)
    }
  }

  // Setup delegated click handler for remove buttons
  function setupRemoveButtonHandlers(){
    document.addEventListener('click', (e)=>{
      if(e.target.classList.contains('role-remove-btn')){
        e.stopPropagation()
        e.preventDefault()
        const roleName = e.target.getAttribute('data-role-name')
        if(roleName){
          detachRoleManually(roleName)
        }
      }
    })
  }

  // Delegated handlers to accept drop on cards and on roles container
  function setupDelegatedDrops(){
    document.addEventListener('dragover', e=>{
      if(K.draggingRole){
        const card = e.target.closest('.card')
        const rolesArea = e.target.closest(rolesContainerSelector)
        if(card || rolesArea) e.preventDefault()
      }
    })

    document.addEventListener('drop', e=>{
      if(!K.draggingRole) return
      const roleName = e.dataTransfer.getData('text/role') || K.draggingRole
      const roleEl = document.querySelector('[data-role="'+roleName+'"]')
      const card = e.target.closest('.card')
      const rolesArea = e.target.closest(rolesContainerSelector)
      if(card){
        // attach only if card not in backlog and role not already attached
        if(isCardInBacklog(card)) return
        // ensure role isn't already attached to another card
        if(roleEl.dataset.attached === 'true') return
        attachRoleToCard(roleEl, card)
      } else if(rolesArea){
        // detach back
        if(roleEl) detachRole(roleEl)
      }
    })
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    setupRoleSquares()
    setupDelegatedDrops()
    setupRemoveButtonHandlers()
  })

  // Expose public API
  K.detachRole = detachRole
  K.detachRoleManually = detachRoleManually
  K.setupRoleSquares = setupRoleSquares // Expor para re-estabelecer listeners após render

})(window.Kanban)
