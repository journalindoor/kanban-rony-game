// backlogRules.js — centralized Backlog capacity rules
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  const MAX_BACKLOG = 5

  function getBacklogZone(){
    return document.querySelector('.cards[data-col="Backlog"]')
  }

  function getBacklogCards(){
    const zone = getBacklogZone()
    return zone ? Array.from(zone.querySelectorAll('.card')) : []
  }

  K.getBacklogCount = function(){
    return getBacklogCards().length
  }

  K.remainingBacklogCapacity = function(max = MAX_BACKLOG){
    const count = K.getBacklogCount()
    return Math.max(0, max - count)
  }

  K.createBacklogCards = function(n){
    const zone = getBacklogZone()
    if(!zone || !n || n <= 0) return 0
    let created = 0
    for(let i=0;i<n;i++){
      zone.appendChild(K.createCard())
      created++
    }
    if(typeof K.saveState === 'function') K.saveState()
    return created
  }

  K.fillBacklogToMax = function(max = MAX_BACKLOG){
    const remaining = K.remainingBacklogCapacity(max)
    if(remaining <= 0) return 0
    return K.createBacklogCards(remaining)
  }

})(window.Kanban)
