// tutorial.js — Tutorial director and orchestration
(function(K){
  K = K || (window.Kanban = window.Kanban || {})
  
  // Tutorial state
  K.Tutorial = {
    active: false,
    currentStep: 0,
    steps: [],
    originalHandlers: {},
    
    // Initialize tutorial system
    init: function(){
      console.log('Tutorial system initialized')
      this.active = true
      this.setupSteps()
      this.setupUI()
      this.start()
    },
    
    // Define tutorial steps
    setupSteps: function(){
      this.steps = [
        {
          message: 'Bem-vindo ao Kanban Rony Game! Este tutorial irá guiá-lo pelos conceitos básicos do jogo.',
          highlight: null,
          onEnter: () => {
            // Limpar board e criar estado inicial limpo
            K.Tutorial.clearBoard()
            K.Tutorial.disableAllActions()
          }
        },
        {
          message: 'Este é o board Kanban. Aqui você gerencia o fluxo de trabalho dos cards através das colunas.',
          highlight: '#board',
          onEnter: () => {
            K.Tutorial.disableAllActions()
          }
        },
        {
          message: 'Vamos criar nosso primeiro card no Backlog. Clique no botão "Iniciar Turno".',
          highlight: '#startButton',
          onEnter: () => {
            K.Tutorial.enableElement('#startButton')
            K.Tutorial.waitForAction('turnStarted', () => {
              K.Tutorial.nextStep()
            })
          }
        },
        {
          message: 'Ótimo! Um novo card foi criado no Backlog. Cards representam tarefas que precisam ser realizadas.',
          highlight: '.cards[data-col="Backlog"]',
          onEnter: () => {
            K.Tutorial.disableAllActions()
          }
        },
        {
          message: 'Cada card possui indicadores de dificuldade para cada etapa do processo. Vamos mover este card para Refinamento.',
          highlight: null,
          onEnter: () => {
            const card = document.querySelector('.cards[data-col="Backlog"] .card')
            if(card){
              K.Tutorial.highlightElement(card)
              K.Tutorial.enableCardDrag(card, 'Refinamento')
            }
          }
        },
        {
          message: 'Parabéns! Você completou o tutorial básico. Continue explorando o jogo!',
          highlight: null,
          onEnter: () => {
            K.Tutorial.enableAllActions()
          }
        }
      ]
    },
    
    // Setup UI elements
    setupUI: function(){
      const overlay = document.getElementById('tutorialOverlay')
      const nextBtn = document.getElementById('tutorialNextButton')
      const prevBtn = document.getElementById('tutorialPrevButton')
      
      if(nextBtn){
        nextBtn.addEventListener('click', () => this.nextStep())
      }
      
      if(prevBtn){
        prevBtn.addEventListener('click', () => this.prevStep())
      }
    },
    
    // Start tutorial
    start: function(){
      this.currentStep = 0
      this.showStep(0)
    },
    
    // Show specific step
    showStep: function(stepIndex){
      if(stepIndex < 0 || stepIndex >= this.steps.length) return
      
      const step = this.steps[stepIndex]
      this.currentStep = stepIndex
      
      // Update UI
      const overlay = document.getElementById('tutorialOverlay')
      const messageEl = document.getElementById('tutorialMessage')
      const stepNumberEl = document.getElementById('tutorialStepNumber')
      const nextBtn = document.getElementById('tutorialNextButton')
      const prevBtn = document.getElementById('tutorialPrevButton')
      
      if(overlay){
        overlay.classList.remove('hidden')
        overlay.classList.add('active')
      }
      
      if(messageEl) messageEl.textContent = step.message
      if(stepNumberEl) stepNumberEl.textContent = stepIndex + 1
      
      // Button states
      if(prevBtn) prevBtn.disabled = stepIndex === 0
      if(nextBtn){
        nextBtn.textContent = stepIndex === this.steps.length - 1 ? 'Finalizar' : 'Próximo'
      }
      
      // Highlight element if specified
      if(step.highlight){
        this.highlightElement(step.highlight)
      } else {
        this.clearHighlight()
      }
      
      // Execute step's onEnter callback
      if(step.onEnter) step.onEnter()
    },
    
    // Next step
    nextStep: function(){
      if(this.currentStep < this.steps.length - 1){
        this.showStep(this.currentStep + 1)
      } else {
        this.finish()
      }
    },
    
    // Previous step
    prevStep: function(){
      if(this.currentStep > 0){
        this.showStep(this.currentStep - 1)
      }
    },
    
    // Finish tutorial
    finish: function(){
      this.active = false
      const overlay = document.getElementById('tutorialOverlay')
      if(overlay){
        overlay.classList.add('hidden')
        overlay.classList.remove('active')
      }
      this.clearHighlight()
      this.enableAllActions()
      console.log('Tutorial completed!')
    },
    
    // Highlight specific element
    highlightElement: function(selector){
      const highlight = document.getElementById('tutorialHighlight')
      if(!highlight) return
      
      const element = typeof selector === 'string' ? document.querySelector(selector) : selector
      if(!element) return
      
      const rect = element.getBoundingClientRect()
      highlight.style.left = rect.left - 5 + 'px'
      highlight.style.top = rect.top - 5 + 'px'
      highlight.style.width = rect.width + 10 + 'px'
      highlight.style.height = rect.height + 10 + 'px'
      highlight.classList.remove('hidden')
    },
    
    // Clear highlight
    clearHighlight: function(){
      const highlight = document.getElementById('tutorialHighlight')
      if(highlight) highlight.classList.add('hidden')
    },
    
    // Disable all game actions
    disableAllActions: function(){
      document.querySelectorAll('.start-button, .reset-button, .card, .role').forEach(el => {
        el.classList.add('tutorial-disabled')
      })
    },
    
    // Enable all game actions
    enableAllActions: function(){
      document.querySelectorAll('.tutorial-disabled').forEach(el => {
        el.classList.remove('tutorial-disabled')
      })
      document.querySelectorAll('.tutorial-enabled').forEach(el => {
        el.classList.remove('tutorial-enabled')
      })
    },
    
    // Enable specific element
    enableElement: function(selector){
      const element = document.querySelector(selector)
      if(element){
        element.classList.remove('tutorial-disabled')
        element.classList.add('tutorial-enabled')
      }
    },
    
    // Enable card dragging to specific column
    enableCardDrag: function(cardEl, targetColumn){
      if(!cardEl) return
      cardEl.classList.remove('tutorial-disabled')
      cardEl.classList.add('tutorial-enabled')
      
      // Enable target column
      const targetZone = document.querySelector(`.cards[data-col="${targetColumn}"]`)
      if(targetZone){
        targetZone.classList.add('tutorial-enabled')
      }
      
      // Wait for card movement
      this.waitForAction('cardMoved', (movedCard) => {
        if(movedCard === cardEl){
          setTimeout(() => this.nextStep(), 500)
        }
      })
    },
    
    // Wait for specific action
    waitForAction: function(action, callback){
      this.actionCallbacks = this.actionCallbacks || {}
      this.actionCallbacks[action] = callback
    },
    
    // Trigger action callback
    triggerAction: function(action, ...args){
      if(this.actionCallbacks && this.actionCallbacks[action]){
        this.actionCallbacks[action](...args)
        delete this.actionCallbacks[action]
      }
    },
    
    // Clear board for tutorial
    clearBoard: function(){
      K.columnNames.forEach(name => {
        const zone = document.querySelector('.cards[data-col="' + name + '"]')
        if(zone) zone.innerHTML = ''
      })
    },
    
    // Setup initial tutorial state
    setupInitialState: function(){
      // Clear any existing state
      if(typeof K.resetGame === 'function'){
        // Don't call resetGame directly to avoid confirmation
        localStorage.removeItem(K.STORAGE_KEY)
        K.dayCount = 0
        K.money = 0
        K.roleAssignments = {}
        K.roleModels = {}
      }
    }
  }
  
  // Hook into game events for tutorial tracking
  // Store original functions
  if(K.startTurn){
    K.Tutorial.originalStartTurn = K.startTurn
    K.startTurn = function(){
      K.Tutorial.originalStartTurn()
      if(K.Tutorial.active){
        K.Tutorial.triggerAction('turnStarted')
      }
    }
  }
  
  // Initialize tutorial when page loads
  window.addEventListener('DOMContentLoaded', function(){
    // Small delay to ensure game is initialized
    setTimeout(() => {
      if(typeof K.Tutorial !== 'undefined'){
        K.Tutorial.init()
      }
    }, 100)
  })
  
})(window.Kanban)
