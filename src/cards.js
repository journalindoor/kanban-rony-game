// cards.js — card creation and indicator behavior
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  function randInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min }

  K.createCard = function(title = 'Titulo do Card', id = null, indicatorsObj = null){
    if(id === null){
      if(typeof K.nextId === 'function') id = K.nextId()
      else {
        K._idCounter = K._idCounter || 1
        id = K._idCounter++
      }
    }

    const el = document.createElement('div')
    el.className = 'card'
    el.setAttribute('data-id', id)

    // Header with ID then Title
    const header = document.createElement('div')
    header.className = 'card-header'

    const titleEl = document.createElement('div')
    titleEl.className = 'card-title'
    titleEl.textContent = title

    const idEl = document.createElement('div')
    idEl.className = 'card-id'
    idEl.textContent = id

    header.appendChild(idEl)
    header.appendChild(titleEl)
    el.appendChild(header)

    // Difficulty indicators: four, names based on columns
    const indicatorNames = ['Refinamento','Fazendo','Homologando','Ajustes']
    const indicators = document.createElement('div')
    indicators.className = 'indicators'

    indicatorNames.forEach(name=>{
      const item = document.createElement('div')
      item.className = 'indicator'

      const label = document.createElement('div')
      label.className = 'ind-label'
      label.textContent = name

      const value = document.createElement('div')
      value.className = 'ind-value'
      const initial = (indicatorsObj && indicatorsObj[name]) ? Math.max(2, indicatorsObj[name]) : randInt(2,18)
      value.textContent = String(initial)

      // clicking assigns a new random value between 1..18 and saves
      item.addEventListener('click', ()=>{
        const v = randInt(2,18)
        value.textContent = String(v)
        if(typeof K.saveState === 'function') K.saveState()
      })

      item.appendChild(label)
      item.appendChild(value)
      indicators.appendChild(item)
    })

    el.appendChild(indicators)

    // drag handling uses Kanban.dragged shared state
    el.draggable = true
    el.addEventListener('dragstart', e=>{
      K.dragged = el
      el.classList.add('dragging')
      e.dataTransfer.effectAllowed = 'move'
    })
    el.addEventListener('dragend', ()=>{
      K.dragged = null
      el.classList.remove('dragging')
      // small delay to allow drop handler to place element then save
      setTimeout(()=>{ if(typeof K.saveState === 'function') K.saveState() }, 50)
    })

    return el
  }
})(window.Kanban)
