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
  K.moneyAnimationActive = false
  K.moneyAnimationTimeout = null
  K.moneyAnimationTargetValue = 0 // Valor alvo da animação
  
  K.updateMoneyDisplay = function(){
    const el = document.getElementById('moneyCounter')
    if(el) el.textContent = '$' + String(K.money || 0)
  }
  
  K.addMoney = function(amount){
    console.log('[addMoney] Chamado com amount:', amount)
    
    // Adicionar valor imediatamente ao total interno
    K.money = (K.money || 0) + amount
    const newTargetValue = K.money
    console.log('[addMoney] Novo valor total:', newTargetValue)
    
    // Se já houver animação rodando, apenas atualizar o valor alvo
    if(K.moneyAnimationActive) {
      console.log('[addMoney] Animação já ativa, atualizando valor alvo para:', newTargetValue)
      K.moneyAnimationTargetValue = newTargetValue
      return
    }
    
    // Iniciar nova animação
    console.log('[addMoney] Iniciando nova animação')
    K.moneyAnimationActive = true
    K.moneyAnimationTargetValue = newTargetValue
    
    const startDisplayValue = parseInt(document.getElementById('moneyCounter')?.textContent.replace('$', '') || '0', 10)
    const duration = 800
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Usar o valor alvo atual (pode ter mudado se outro card foi arquivado)
      const currentTarget = K.moneyAnimationTargetValue
      const displayValue = Math.round(startDisplayValue + ((currentTarget - startDisplayValue) * progress))
      
      const el = document.getElementById('moneyCounter')
      if(el) el.textContent = '$' + displayValue
      
      if(progress < 1){
        K.moneyAnimationTimeout = setTimeout(animate, 16) // ~60fps
      } else {
        // Animação terminou - verificar se valor alvo mudou durante a animação
        if(K.moneyAnimationTargetValue !== currentTarget){
          // Valor mudou, continuar animando
          console.log('[addMoney] Valor mudou durante animação, continuando...')
          animate()
        } else {
          // Garantir valor final exato
          K.updateMoneyDisplay()
          K.moneyAnimationActive = false
          K.moneyAnimationTimeout = null
          console.log('[addMoney] Animação concluída')
          
          // Salvar estado após animação
          if(typeof K.saveState === 'function') K.saveState()
          
          // Verificar objetivo do capítulo
          if(typeof K.checkChapterGoal === 'function') K.checkChapterGoal()
          
          // Verificar marcos de desbloqueio (Capítulo 1)
          if(typeof K.checkUnlockMilestones === 'function') K.checkUnlockMilestones()
        }
      }
    }
    
    animate()
  }
  K.removeMoney = function(amount){
    K.money = Math.max(0, (K.money || 0) - amount)
    K.updateMoneyDisplay()
    if(typeof K.saveState === 'function') K.saveState()
  }

  // WIP (Work In Progress) Counter System
  K.WIP_LIMITS = {
    'Backlog': 5,
    'Refinamento': 3,
    'SprintBacklog': 3,
    'Fazendo': 3,
    'Homologando': 3,
    'Ajustes': 3,
    'Publicado': Infinity,
    'Arquivados': Infinity
  }
  
  K.getWipLimit = function(columnName) {
    return K.WIP_LIMITS[columnName] || Infinity
  }
  
  K.isColumnAtLimit = function(columnName) {
    const cardsContainer = document.querySelector(`.cards[data-col="${columnName}"]`)
    if (!cardsContainer) return false
    
    const cardCount = cardsContainer.querySelectorAll('.card').length
    const limit = K.getWipLimit(columnName)
    
    return cardCount >= limit
  }
  
  K.updateWipCounters = function(){
    // Query all WIP counter elements
    const counters = document.querySelectorAll('.wip-counter[data-counter-col]')
    
    counters.forEach(counter => {
      const columnName = counter.getAttribute('data-counter-col')
      if(!columnName) return
      
      // Find the corresponding cards container
      const cardsContainer = document.querySelector(`.cards[data-col="${columnName}"]`)
      if(!cardsContainer) return
      
      // Count cards in this column
      const cardCount = cardsContainer.querySelectorAll('.card').length
      
      // Get limit from WIP_LIMITS
      const limit = K.getWipLimit(columnName)
      const limitDisplay = limit === Infinity ? '∞' : String(limit)
      
      // Update counter display
      counter.textContent = `${cardCount}/${limitDisplay}`
      
      // Add visual warning if at/over limit
      if (cardCount >= limit && limit !== Infinity) {
        counter.classList.add('wip-at-limit')
      } else {
        counter.classList.remove('wip-at-limit')
      }
    })
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
    
    // Update WIP counters after archiving
    if(typeof K.updateWipCounters === 'function') K.updateWipCounters()
    
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
        const el = K.createCard(
          c.title || 'Titulo do Card',
          c.id,
          c.indicators || null,
          c.paid || false,
          typeof c.birthday === 'number' ? c.birthday : null,
          typeof c.leadTime === 'number' ? c.leadTime : null,
          typeof c.cycleTime === 'number' ? c.cycleTime : null
        )
        zone.appendChild(el)
      })
    })
    // Inicializa sprites com efeito de login sequencial
    // No modo livre (index.html), aguarda fechamento do modal de boas-vindas
    const isFreeModeWithModal = document.getElementById('welcomeModal') !== null
    if(!isFreeModeWithModal && K.initCharacterSpritesWithSequence) {
      K.initCharacterSpritesWithSequence(500, 2000)
    }
    // Atualizar displays
    if(K.updateMoneyDisplay) K.updateMoneyDisplay()
    // Se no capítulo 1, configurar estado do botão do capítulo 2
    if(K.currentChapter === 'chapter1') {
      if(K.chapter1GoalAchieved && typeof K.enableChapter2Button === 'function') {
        K.enableChapter2Button()
      } else if(typeof K.disableChapter2Button === 'function') {
        K.disableChapter2Button()
      }
    }
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
    
    // Update WIP counters after state restoration
    if(typeof K.updateWipCounters === 'function') K.updateWipCounters()
  }

  K.resetGame = function(){
    if(!confirm('Reiniciar o jogo? Isso apagará o progresso salvo.')) return
    try{ localStorage.removeItem(K.STORAGE_KEY) }catch(e){}
    
    // Clear used cards list to allow reusing cards from bank
    try{
      const usedCardsKey = K.getUsedCardsKey ? K.getUsedCardsKey() : null
      if(usedCardsKey){
        localStorage.removeItem(usedCardsKey)
        console.log('[resetGame] Lista de cards usados limpa')
      }
    }catch(e){
      console.warn('[resetGame] Erro ao limpar cards usados:', e)
    }
    
    // Reset unlock system (for chapters)
    if (K.unlocksTriggered) {
      K.unlocksTriggered = []
      console.log('[resetGame] Marcos de desbloqueio resetados')
    }
    
    // Reset unlocked characters to initial state (only level 1)
    if (K.unlockedCharacters && typeof K.initializeUnlockedCharacters === 'function') {
      K.initializeUnlockedCharacters()
      console.log('[resetGame] Personagens desbloqueados resetados para estado inicial')
    }
    
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
    // reinitialize role models with new talentos and render
    if(typeof K.initializeRoles === 'function') K.initializeRoles(true)
    
    // Re-render office characters with updated unlock state
    if(typeof K.initCharacterSpritesWithSequence === 'function') {
      K.initCharacterSpritesWithSequence(0, 0) // Update immediately
    }
    
    if(typeof K.updateDayCounterDisplay === 'function') K.updateDayCounterDisplay()
    if(typeof K.updateMoneyDisplay === 'function') K.updateMoneyDisplay()
    if(typeof K.updateWipCounters === 'function') K.updateWipCounters()
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
        
        // Incrementa leadTime de todos os cards (exceto Publicado e Arquivados)
        K.columnNames.forEach(colName => {
          if(colName === 'Publicado' || colName === 'Arquivados') return;
          const zone = document.querySelector('.cards[data-col="'+colName+'"]');
          if(!zone) return;
          zone.querySelectorAll('.card').forEach(cardEl => {
            let lead = Number(cardEl.dataset.leadTime || 0);
            cardEl.dataset.leadTime = lead + 1;
            // Atualizar visual
            const leadTimeEl = cardEl.querySelector('.card-leadtime');
            if(leadTimeEl) leadTimeEl.textContent = `🏁 ${lead + 1}`;
            
            // Incrementa cycleTime apenas se estiver em colunas de produção
            const prodCols = ['SprintBacklog', 'Fazendo', 'Homologando', 'Ajustes'];
            if(prodCols.includes(colName)) {
              let cycle = Number(cardEl.dataset.cycleTime || 0);
              cardEl.dataset.cycleTime = cycle + 1;
              // Atualizar visual
              const cycleTimeEl = cardEl.querySelector('.card-cycletime');
              if(cycleTimeEl) cycleTimeEl.textContent = `🔄 ${cycle + 1}`;
            }
          });
        });
        
        // Update office status message (changes every turn)
        if(typeof K.updateOfficeStatus === 'function') K.updateOfficeStatus()
        
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
          if(moved>0) {
            console.log(`Archived ${moved} published card(s).`)
            // Log publication statistics after archiving
            if(typeof K.logPublicationStats === 'function') {
              K.logPublicationStats()
            }
          }
        }catch(e){ console.error('Error archiving published cards', e) }

        // persist updated state (including day counter) after the turn action
        if(typeof K.saveState === 'function') K.saveState()
      })
    }

    const resetBtn = document.getElementById('resetButton')
    if(resetBtn) resetBtn.addEventListener('click', K.resetGame)

    // Chapter 1 start button (only in index.html)
    const startChapter1Btn = document.getElementById('startChapter1Button')
    if(startChapter1Btn){
      startChapter1Btn.addEventListener('click', function(){
        const confirmed = confirm(
          'Iniciar o Capítulo 1?\n\n' +
          'Isso iniciará um novo jogo do zero. ' +
          'Todo o progresso do modo livre será descartado.\n\n' +
          'Deseja continuar?'
        )
        if(confirmed){
          // Clear any existing transfer data to ensure clean start
          try {
            localStorage.removeItem('KANBAN_CHAPTER_TRANSFER')
          } catch(e) {}
          
          // Navigate to chapter 1
          window.location.href = 'chapter1.html'
        }
      })
    }

    // initialize board from storage or create default
    const saved = (typeof K.loadState === 'function') ? K.loadState() : null
    if(saved){
      if(Number.isFinite(saved.dayCount)) K.dayCount = saved.dayCount
      K.renderFromState(saved)
    }
    else {
      // Não criar card inicial - backlog começa vazio
      if(typeof K.saveState === 'function') K.saveState()
      
      // Inicializar sprites com efeito de login sequencial
      // No modo livre (index.html), aguarda fechamento do modal de boas-vindas
      const isFreeModeWithModal = document.getElementById('welcomeModal') !== null
      if(!isFreeModeWithModal && typeof K.initCharacterSpritesWithSequence === 'function') {
        K.initCharacterSpritesWithSequence(500, 2000)
      }
    }

    if(typeof K.updateDayCounterDisplay === 'function') K.updateDayCounterDisplay()
    if(typeof K.updateMoneyDisplay === 'function') K.updateMoneyDisplay()
    if(typeof K.updateWipCounters === 'function') K.updateWipCounters()

    // wire drop zones
    if(typeof K.setupDropZones === 'function') K.setupDropZones()

    // ensure role visuals are rendered (fallback if roleModel's DOMContentLoaded didn't run earlier)
    if(typeof K.renderRole === 'function' && K.roleModels){
      Object.keys(K.roleModels).forEach(rName=>{
        const el = document.querySelector(`[data-role="${rName}"]`)
        if(el) K.renderRole(K.roleModels[rName], el)
      })
    }

    // Toggle archived column by clicking its header
    const archivedCol = document.querySelector('.column[data-col="Arquivados"]')
    if(archivedCol){
      const archivedHeader = archivedCol.querySelector('.column-header')
      if(archivedHeader){
        archivedHeader.addEventListener('click', ()=>{
          archivedCol.classList.toggle('archived-hidden')
        })
      }
    }
  })

  // Function to calculate publication statistics (reusable)
  K.getThroughputData = function() {
    // Get all archived cards
    const archivedZone = document.querySelector('.cards[data-col="Arquivados"]')
    if (!archivedZone) {
      return { archivedCount: 0, currentDay: 0, data: [] }
    }

    const archivedCards = Array.from(archivedZone.querySelectorAll('.card'))
    
    // Group cards by publication day
    const publicationsByDay = {}
    
    archivedCards.forEach(card => {
      const birthday = parseInt(card.dataset.birthday || '0', 10)
      const leadTime = parseInt(card.dataset.leadTime || '0', 10)
      const publicationDay = birthday + leadTime
      
      if (!publicationsByDay[publicationDay]) {
        publicationsByDay[publicationDay] = 0
      }
      publicationsByDay[publicationDay]++
    })

    // Get current day
    const currentDay = K.dayCount || 0

    // Build data array
    const data = []
    for (let day = 0; day <= currentDay; day++) {
      const count = publicationsByDay[day] || 0
      data.push({ day, count })
    }

    return {
      archivedCount: archivedCards.length,
      currentDay,
      data
    }
  }

  // Function to log publication statistics to console
  K.logPublicationStats = function() {
    const stats = K.getThroughputData()
    
    console.log('=== Estatísticas de Publicação ===')
    console.log(`Total de cards arquivados: ${stats.archivedCount}`)
    console.log('-----------------------------------')
    
    stats.data.forEach(item => {
      console.log(`Dia ${item.day}: ${item.count} cards`)
    })
    
    console.log('===================================')
  }

  // Function to analyze run chart patterns and provide insights
  K.analyzeRunChart = function(data) {
    if (!data || data.length === 0) {
      return {
        pattern: 'empty',
        message: '📊 Ainda há poucos dados para identificar padrões confiáveis.',
        icon: '📊'
      }
    }
    
    // Filter days with actual deliveries
    const daysWithDeliveries = data.filter(d => d.count > 0)
    
    if (daysWithDeliveries.length < 5) {
      return {
        pattern: 'empty',
        message: '📊 Ainda há poucos dados para identificar padrões confiáveis.',
        icon: '📊'
      }
    }
    
    // Calculate statistics
    const counts = data.map(d => d.count)
    const mean = counts.reduce((sum, val) => sum + val, 0) / counts.length
    
    // Calculate standard deviation
    const variance = counts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / counts.length
    const stdDev = Math.sqrt(variance)
    
    // Coefficient of variation (relative variability)
    const cv = mean > 0 ? (stdDev / mean) : 0
    
    // Split data into first half and second half
    const midPoint = Math.floor(data.length / 2)
    const firstHalf = data.slice(0, midPoint)
    const secondHalf = data.slice(midPoint)
    
    const firstMean = firstHalf.reduce((sum, d) => sum + d.count, 0) / firstHalf.length
    const secondMean = secondHalf.reduce((sum, d) => sum + d.count, 0) / secondHalf.length
    
    // Detect patterns
    
    // Growing trend: second half average is significantly higher than first half
    if (secondMean > firstMean * 1.2) {
      return {
        pattern: 'growing',
        message: '🚀 Seu throughput está aumentando. Pode indicar melhoria no fluxo.',
        icon: '🚀'
      }
    }
    
    // Falling trend: second half average is significantly lower than first half
    if (secondMean < firstMean * 0.8) {
      return {
        pattern: 'falling',
        message: '📉 Há uma tendência de queda na entrega. Verifique possíveis bloqueios.',
        icon: '📉'
      }
    }
    
    // Volatile: high coefficient of variation
    if (cv > 0.6) {
      return {
        pattern: 'volatile',
        message: '⚠️ Seu throughput está irregular. Isso pode indicar gargalos ou trabalho em lote.',
        icon: '⚠️'
      }
    }
    
    // Stable: low coefficient of variation
    if (cv < 0.4) {
      return {
        pattern: 'stable',
        message: '📈 Seu fluxo está estável. Isso indica previsibilidade na entrega.',
        icon: '📈'
      }
    }
    
    // Default: moderate variability
    return {
      pattern: 'stable',
      message: '📈 Seu fluxo está relativamente estável.',
      icon: '📈'
    }
  }

  // Function to render Throughput Run Chart
  K.renderThroughputChart = function(data) {
    const canvas = document.getElementById("throughputChart")
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    const padding = 40
    
    if (data.length === 0) return
    
    // Determine display range: current day ± 20 days
    const currentDay = K.dayCount || 0
    const rangeStart = Math.max(0, currentDay - 20)
    const rangeEnd = currentDay + 20
    
    // Filter data to display range
    let chartData = []
    for (let day = rangeStart; day <= rangeEnd; day++) {
      const existing = data.find(d => d.day === day)
      chartData.push({
        day: day,
        count: existing ? existing.count : 0
      })
    }
    
    const maxY = Math.max(...chartData.map(d => d.count), 1)
    const maxX = chartData.length

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw throughput line
    ctx.beginPath()
    chartData.forEach((point, i) => {
      const x = padding + (i / (maxX - 1)) * (canvas.width - padding * 2)
      const y = canvas.height - padding - (point.count / maxY) * (canvas.height - padding * 2)

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
      
      // Draw point only for days with data
      if (point.count > 0) {
        ctx.fillStyle = "#3498db"
        ctx.fillRect(x - 3, y - 3, 6, 6)
      }
    })
    ctx.strokeStyle = "#3498db"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw average line
    const avg = data.reduce((sum, d) => sum + d.count, 0) / data.length
    const avgY = canvas.height - padding - (avg / maxY) * (canvas.height - padding * 2)

    ctx.beginPath()
    ctx.moveTo(padding, avgY)
    ctx.lineTo(canvas.width - padding, avgY)
    ctx.strokeStyle = "#2ecc71"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.stroke()
    ctx.setLineDash([])

    // Draw current day indicator
    const currentDayIndex = chartData.findIndex(d => d.day === currentDay)
    if (currentDayIndex >= 0) {
      const x = padding + (currentDayIndex / (maxX - 1)) * (canvas.width - padding * 2)
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, canvas.height - padding)
      ctx.strokeStyle = "#e74c3c"
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw labels
    ctx.fillStyle = "#666"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    
    // X-axis labels (show every few days to avoid clutter)
    const step = Math.max(1, Math.ceil(maxX / 15))
    for (let i = 0; i < maxX; i += step) {
      const x = padding + (i / (maxX - 1)) * (canvas.width - padding * 2)
      ctx.fillText(`Dia ${chartData[i].day}`, x, canvas.height - padding + 20)
    }
    
    // Y-axis labels
    ctx.textAlign = "right"
    const yStep = Math.max(1, Math.ceil(maxY / 5))
    for (let i = 0; i <= maxY; i += yStep) {
      const y = canvas.height - padding - (i / maxY) * (canvas.height - padding * 2)
      ctx.fillText(i.toString(), padding - 10, y + 4)
    }

    // Legend
    ctx.textAlign = "left"
    ctx.fillStyle = "#3498db"
    ctx.fillRect(padding + 10, 15, 15, 3)
    ctx.fillStyle = "#333"
    ctx.fillText("Throughput", padding + 30, 20)
    
    ctx.fillStyle = "#2ecc71"
    ctx.fillRect(padding + 120, 15, 15, 3)
    ctx.fillStyle = "#333"
    ctx.fillText(`Média (${avg.toFixed(1)})`, padding + 140, 20)
    
    ctx.fillStyle = "#e74c3c"
    ctx.fillRect(padding + 250, 15, 15, 3)
    ctx.fillStyle = "#333"
    ctx.fillText(`Hoje (Dia ${currentDay})`, padding + 270, 20)
  }

  // Function to calculate projection data with moving average
  K.calculateProjectionData = function(data) {
    if (!data || data.length === 0) return []
    
    const windowSize = 5
    const futureDays = 20
    
    // Find last day with data
    const lastDay = Math.max(...data.map(d => d.day))
    
    // Calculate moving average of last 5 days
    const lastDays = data.slice(-windowSize)
    const movingAvg = lastDays.reduce((sum, d) => sum + d.count, 0) / windowSize
    
    // Generate projection series
    const startDay = Math.max(0, lastDay - windowSize)
    const endDay = lastDay + futureDays
    
    const projectionData = []
    
    for (let day = startDay; day <= endDay; day++) {
      if (day <= lastDay) {
        // For real days, use actual data with smoothing
        const actualData = data.find(d => d.day === day)
        projectionData.push({
          day: day,
          count: actualData ? actualData.count : 0,
          isProjection: false
        })
      } else {
        // For future days, use moving average as projection
        projectionData.push({
          day: day,
          count: movingAvg,
          isProjection: true
        })
      }
    }
    
    return projectionData
  }

  // Function to render Projection Chart
  K.renderProjectionChart = function(data) {
    const canvas = document.getElementById("projectionChart")
    if (!canvas) return
    
    const projectionData = K.calculateProjectionData(data)
    if (projectionData.length === 0) return
    
    const ctx = canvas.getContext("2d")
    const padding = 40
    
    const maxY = Math.max(...projectionData.map(d => d.count), 1)
    const maxX = projectionData.length

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.stroke()

    // Find split point between real and projected data
    const splitIndex = projectionData.findIndex(d => d.isProjection)
    
    // Draw real data line (blue)
    if (splitIndex > 0) {
      ctx.beginPath()
      for (let i = 0; i < splitIndex; i++) {
        const point = projectionData[i]
        const x = padding + (i / (maxX - 1)) * (canvas.width - padding * 2)
        const y = canvas.height - padding - (point.count / maxY) * (canvas.height - padding * 2)

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        
        // Draw point
        ctx.fillStyle = "#3498db"
        ctx.fillRect(x - 3, y - 3, 6, 6)
      }
      ctx.strokeStyle = "#3498db"
      ctx.lineWidth = 2
      ctx.stroke()
    }
    
    // Draw projection line (orange/dashed)
    if (splitIndex >= 0) {
      ctx.beginPath()
      for (let i = Math.max(0, splitIndex - 1); i < projectionData.length; i++) {
        const point = projectionData[i]
        const x = padding + (i / (maxX - 1)) * (canvas.width - padding * 2)
        const y = canvas.height - padding - (point.count / maxY) * (canvas.height - padding * 2)

        if (i === Math.max(0, splitIndex - 1)) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        
        // Draw point for projection
        if (point.isProjection) {
          ctx.fillStyle = "#f39c12"
          ctx.fillRect(x - 3, y - 3, 6, 6)
        }
      }
      ctx.strokeStyle = "#f39c12"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw labels
    ctx.fillStyle = "#666"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    
    // X-axis labels
    const step = Math.ceil(maxX / 8)
    for (let i = 0; i < maxX; i += step) {
      const x = padding + (i / (maxX - 1)) * (canvas.width - padding * 2)
      ctx.fillText(`Dia ${projectionData[i].day}`, x, canvas.height - padding + 20)
    }
    
    // Y-axis labels
    ctx.textAlign = "right"
    for (let i = 0; i <= maxY; i += Math.ceil(maxY / 5)) {
      const y = canvas.height - padding - (i / maxY) * (canvas.height - padding * 2)
      ctx.fillText(i.toFixed(1), padding - 10, y + 4)
    }

    // Legend
    ctx.textAlign = "left"
    ctx.fillStyle = "#3498db"
    ctx.fillRect(padding + 10, 15, 15, 3)
    ctx.fillStyle = "#333"
    ctx.fillText("Histórico", padding + 30, 20)
    
    ctx.fillStyle = "#f39c12"
    ctx.fillRect(padding + 120, 15, 15, 3)
    ctx.fillStyle = "#333"
    ctx.fillText("Projeção", padding + 140, 20)
  }

  // Function to open Throughput modal
  K.openThroughputModal = function() {
    const stats = K.getThroughputData()
    
    // Create modal overlay
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.id = 'throughputModal'
    
    // Create modal content
    const modalContent = document.createElement('div')
    modalContent.className = 'modal-content'
    
    // Modal header
    const header = document.createElement('div')
    header.className = 'modal-header'
    header.innerHTML = '<h2>📊 Throughput - Publicações por Dia</h2>'
    
    // Modal body
    const body = document.createElement('div')
    body.className = 'modal-body'
    
    const subtitle = document.createElement('div')
    subtitle.className = 'modal-subtitle'
    subtitle.textContent = `Total de cards arquivados: ${stats.archivedCount}`
    
    // Chart area container (original chart)
    const chartArea = document.createElement('div')
    chartArea.className = 'throughput-chart-area'
    
    const chartTitle = document.createElement('h3')
    chartTitle.textContent = 'Throughput Histórico'
    chartTitle.style.fontSize = '16px'
    chartTitle.style.color = '#374151'
    chartTitle.style.marginBottom = '10px'
    chartTitle.style.textAlign = 'center'
    
    const canvas = document.createElement('canvas')
    canvas.id = 'throughputChart'
    canvas.style.display = 'block'
    canvas.style.flex = '1'
    canvas.style.border = '1px solid #e5e7eb'
    canvas.style.borderRadius = '8px'
    canvas.style.background = 'white'
    
    chartArea.appendChild(chartTitle)
    chartArea.appendChild(canvas)
    
    // Lower area with two columns
    const lowerArea = document.createElement('div')
    lowerArea.className = 'chart-lower'
    
    // Left column: Projection chart
    const projectionArea = document.createElement('div')
    projectionArea.className = 'chart-projection'
    
    const projectionTitle = document.createElement('h3')
    projectionTitle.textContent = 'Projeção Baseada em Média Móvel'
    projectionTitle.style.fontSize = '14px'
    projectionTitle.style.color = '#374151'
    projectionTitle.style.marginBottom = '10px'
    projectionTitle.style.textAlign = 'center'
    
    const projectionCanvas = document.createElement('canvas')
    projectionCanvas.id = 'projectionChart'
    projectionCanvas.style.display = 'block'
    projectionCanvas.style.flex = '1'
    projectionCanvas.style.border = '1px solid #e5e7eb'
    projectionCanvas.style.borderRadius = '8px'
    projectionCanvas.style.background = 'white'
    
    projectionArea.appendChild(projectionTitle)
    projectionArea.appendChild(projectionCanvas)
    
    // Right column: Extra area (reserved for future content)
    const extraArea = document.createElement('div')
    extraArea.className = 'chart-extra'
    
    // Add insight message to extra area
    const insightBox = document.createElement('div')
    insightBox.id = 'chartInsight'
    insightBox.className = 'chart-insight'
    
    extraArea.appendChild(insightBox)
    
    lowerArea.appendChild(projectionArea)
    lowerArea.appendChild(extraArea)
    
    body.appendChild(subtitle)
    body.appendChild(chartArea)
    body.appendChild(lowerArea)
    
    // Modal footer with close button
    const footer = document.createElement('div')
    footer.className = 'modal-actions'
    
    const closeBtn = document.createElement('button')
    closeBtn.className = 'modal-button modal-button-primary'
    closeBtn.textContent = 'Fechar'
    closeBtn.onclick = function() {
      document.body.removeChild(overlay)
    }
    
    footer.appendChild(closeBtn)
    
    // Assemble modal
    modalContent.appendChild(header)
    modalContent.appendChild(body)
    modalContent.appendChild(footer)
    overlay.appendChild(modalContent)
    
    // Close on overlay click
    overlay.onclick = function(e) {
      if (e.target === overlay) {
        document.body.removeChild(overlay)
      }
    }
    
    // Add to page
    document.body.appendChild(overlay)
    
    // Render charts after modal is added to DOM and sized
    setTimeout(function() {
      // Set canvas dimensions based on container size
      const throughputCanvas = document.getElementById('throughputChart')
      if (throughputCanvas) {
        const container = throughputCanvas.parentElement
        const rect = container.getBoundingClientRect()
        const titleHeight = container.querySelector('h3') ? 30 : 0
        throughputCanvas.width = Math.floor(rect.width - 24)  // account for padding
        throughputCanvas.height = Math.floor(rect.height - titleHeight - 24)  // account for title and padding
      }
      
      const projCanvas = document.getElementById('projectionChart')
      if (projCanvas) {
        const container = projCanvas.parentElement
        const rect = container.getBoundingClientRect()
        const titleHeight = container.querySelector('h3') ? 30 : 0
        projCanvas.width = Math.floor(rect.width - 24)
        projCanvas.height = Math.floor(rect.height - titleHeight - 24)
      }
      
      // Now render charts
      if (typeof K.renderThroughputChart === 'function') {
        K.renderThroughputChart(stats.data)
      }
      if (typeof K.renderProjectionChart === 'function') {
        K.renderProjectionChart(stats.data)
      }
      
      // Analyze and display insights
      if (typeof K.analyzeRunChart === 'function') {
        const analysis = K.analyzeRunChart(stats.data)
        const insightBox = document.getElementById('chartInsight')
        if (insightBox) {
          insightBox.innerHTML = `
            <div class="insight-icon">${analysis.icon}</div>
            <div class="insight-message">${analysis.message}</div>
          `
          insightBox.className = `chart-insight pattern-${analysis.pattern}`
        }
      }
    }, 50)
  }

  // Wire up Throughput button
  document.addEventListener('DOMContentLoaded', function() {
    const throughputBtn = document.getElementById('throughputButton')
    if (throughputBtn) {
      throughputBtn.addEventListener('click', function() {
        if (typeof K.openThroughputModal === 'function') {
          K.openThroughputModal()
        }
      })
    }
  })

})(window.Kanban)
