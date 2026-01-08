// tutorial.controller.js — Orquestrador do Tutorial
// Responsabilidade: Coordenar state + ui + steps + hooks no jogo
(function(K) {
  K = K || (window.Kanban = window.Kanban || {});

  /**
   * Tutorial Controller
   * 
   * Responsabilidades:
   * 1. Inicializar tutorial
   * 2. Instalar hooks NÃO-INVASIVOS no motor do jogo
   * 3. Navegar entre passos
   * 4. Coordenar state/ui/steps
   */
  K.TutorialController = {
    initialized: false,

    /**
     * Inicializa tutorial
     */
    init: function() {
      if (this.initialized) return;

      // Setup state
      K.TutorialState.totalSteps = K.TutorialSteps.length;
      K.TutorialState.reset();

      // Setup UI
      K.TutorialUI.init();

      // Instala hooks
      this.hookGameActions();

      // Exibe primeiro passo (se existir)
      if (K.TutorialSteps.length > 0) {
        this.showCurrentStep();
      }

      this.initialized = true;
    },

    /**
     * HOOKS NÃO-INVASIVOS
     * Preserva funções originais 100%
     */
    hookGameActions: function() {
      this.hookStartTurn();
      this.hookResetGame();
      this.hookToggleArchived();
      this.hookDragCard();
      this.hookDragRole();
      this.hookMoveCardButton();
      this.hookRemoveRole();
      this.hookCardCompletion();
    },

    hookStartTurn: function() {
      // Hook no evento do botão (não existe window.startTurn)
      document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'startButton') {
          console.log('[Tutorial] startButton clicado, permitido?', K.TutorialState.isActionAllowed('startTurn'));
          if (!K.TutorialState.isActionAllowed('startTurn')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
          }
          // Permite a execução
          console.log('[Tutorial] Executando callback startTurn');
          setTimeout(() => {
            K.TutorialState.executeCallback('startTurn');
          }, 100);
        }
      }, true); // Capture phase para interceptar antes do handler do jogo
    },

    hookResetGame: function() {
      const original = window.resetGame;
      window.resetGame = function() {
        if (!K.TutorialState.isActionAllowed('resetGame')) {
          return;
        }
        original.call(this);
        K.TutorialState.executeCallback('resetGame');
      };
    },

    hookToggleArchived: function() {
      const original = window.toggleArchived;
      window.toggleArchived = function() {
        if (!K.TutorialState.isActionAllowed('toggleArchived')) {
          return;
        }
        original.call(this);
        K.TutorialState.executeCallback('toggleArchived');
      };
    },

    hookDragCard: function() {
      let dragStartAllowed = false;
      
      document.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('card')) {
          console.log('[Tutorial] dragCard dragstart, permitido?', K.TutorialState.isActionAllowed('dragCard'));
          dragStartAllowed = K.TutorialState.isActionAllowed('dragCard');
          if (!dragStartAllowed) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
          }
        }
      }, true); // Capture phase
      
      // Observer: detecta quando card é movido para outra coluna via DOM
      // Funciona tanto para drag&drop quanto para botão "Próxima Coluna"
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === Node.ELEMENT_NODE && node.classList && node.classList.contains('card')) {
                // Card foi adicionado a uma nova coluna
                const cardId = node.getAttribute('data-id');
                const newColumn = node.closest('.column')?.getAttribute('data-col');
                console.log('[Tutorial] Card moved detected via DOM observer - Card:', cardId, '| Column:', newColumn);
                
                // Pequeno delay para garantir que DOM está estável
                setTimeout(() => {
                  K.TutorialState.executeCallback('dragCard', { cardId, column: newColumn });
                }, 150);
              }
            });
          }
        });
      });
      
      // Observa todas as áreas de cards existentes
      document.querySelectorAll('.cards').forEach(function(cardsContainer) {
        observer.observe(cardsContainer, { childList: true });
        console.log('[Tutorial] Observer instalado em coluna:', cardsContainer.getAttribute('data-col'));
      });
      
      // Observer adicional: monitora o board inteiro caso novas colunas sejam criadas dinamicamente
      const boardElement = document.querySelector('.board');
      if (boardElement) {
        observer.observe(boardElement, { childList: true, subtree: true });
        console.log('[Tutorial] Observer instalado no board (subtree)');
      }
    },

    hookDragRole: function() {
      document.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('role-item')) {
          if (!K.TutorialState.isActionAllowed('dragRole')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
          }
        }
      }, true);
      
      // Observer: detecta quando role é anexado a um card via DOM
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === Node.ELEMENT_NODE && node.classList && node.classList.contains('role')) {
                const card = node.closest('.card');
                if (card) {
                  console.log('[Tutorial] Role attached to card detected via DOM observer');
                  setTimeout(() => {
                    K.TutorialState.executeCallback('dragRole');
                  }, 100);
                }
              }
            });
          }
        });
      });
      
      // Observa todos os cards para detectar quando roles são adicionados
      const boardElement = document.querySelector('.board');
      if (boardElement) {
        observer.observe(boardElement, { childList: true, subtree: true });
      }
    },

    hookMoveCardButton: function() {
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('move-card-button')) {
          console.log('[Tutorial] moveCardButton clicado, permitido?', K.TutorialState.isActionAllowed('moveCardButton'));
          if (!K.TutorialState.isActionAllowed('moveCardButton')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
          }
          // Note: Callback execution for dragCard is now handled by movementRules.js
          // after the card is successfully moved
        }
      }, true);
    },

    hookRemoveRole: function() {
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-role-button')) {
          if (!K.TutorialState.isActionAllowed('removeRole')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
          setTimeout(() => {
            K.TutorialState.executeCallback('removeRole');
          }, 100);
        }
      }, true);
    },

    hookCardCompletion: function() {
      // Não usado - card completion é detectado via movimento de card (dragCard event)
    },

    /**
     * Exibe passo atual
     */
    showCurrentStep: function() {
      const state = K.TutorialState;
      const step = K.TutorialSteps[state.currentStep];

      if (!step) {
        this.finish();
        return;
      }

      // OnExit do passo anterior
      if (state.currentStep > 0) {
        const prevStep = K.TutorialSteps[state.currentStep - 1];
        if (prevStep.onExit) prevStep.onExit();
      }

      // Configura permissões
      state.blockAllActions();
      if (step.allowedActions) {
        state.allowActions(step.allowedActions);
      }

      // UI
      K.TutorialUI.setMessage(step.title, step.message);
      K.TutorialUI.updateStepCounter(state.currentStep, state.totalSteps);
      K.TutorialUI.updateNavigationButtons(
        state.currentStep === 0,
        state.currentStep === state.totalSteps - 1,
        !!step.waitFor // Desabilita Próximo se passo requer ação específica
      );

      // Position
      if (step.position) {
        K.TutorialUI.setPosition(step.position);
      } else {
        K.TutorialUI.setPosition('center');
      }

      // Update Rony sprite
      if (step.ronySprite) {
        K.TutorialUI.setRonySprite(step.ronySprite, step.ronyFlip);
      }

      // Highlight
      if (step.highlight) {
        K.TutorialUI.highlightElement(step.highlight);
      } else {
        K.TutorialUI.clearHighlight();
      }

      // OnEnter
      if (step.onEnter) step.onEnter();

      // Mostra
      K.TutorialUI.show();

      // Sempre reabre e maximiza o modal ao mostrar um novo passo
      if (K.TutorialUI.elements.messageBox) {
        K.TutorialUI.elements.messageBox.classList.add('active');
        if (K.TutorialUI.elements.messageBox.classList.contains('tutorial-minimized')) {
          K.TutorialUI.setMinimized(false);
        }
      }

      // WaitFor
      if (step.waitFor) {
        console.log('[Tutorial] Registrando callback para:', step.waitFor);
        state.registerCallback(step.waitFor, () => {
          console.log('[Tutorial] Callback executado para:', step.waitFor);
          // Reabilita botão Próximo em vez de avançar automaticamente
          // Pequeno delay para garantir que a ação foi processada
          setTimeout(() => {
            console.log('[Tutorial] Reabilitando botão Próximo');
            K.TutorialUI.enableNextButton();
          }, 100);
        });
      }
    },

    /**
     * Próximo
     */
    nextStep: function() {
      const state = K.TutorialState;
      if (state.currentStep === state.totalSteps - 1) {
        this.finish();
        return;
      }
      if (state.nextStep()) {
        this.showCurrentStep();
      }
    },

    /**
     * Anterior
     */
    previousStep: function() {
      if (K.TutorialState.previousStep()) {
        this.showCurrentStep();
      }
    },

    /**
     * Pula
     */
    skip: function() {
      K.TutorialState.finish();
      K.TutorialState.reset(); // Reseta para reiniciar na próxima vez
      K.TutorialUI.hide();
      window.location.href = 'index.html';
    },

    /**
     * Finaliza
     */
    finish: function() {
      K.TutorialState.finish();
      K.TutorialState.reset(); // Reseta para reiniciar na próxima vez
      K.TutorialUI.hide();
      
      // Alerta de conclusão
      alert('🎉 Parabéns! Você concluiu o tutorial!\n\nAgora você pode explorar livremente o jogo.\n\nQuando estiver pronto, clique em "Voltar ao Modo Livre" no menu superior para retornar ao modo livre.');
      
      // NÃO redireciona automaticamente
      // O jogador permanece no tutorial.html e pode explorar livremente
      // Usa o botão "Voltar ao Modo Livre" quando quiser sair
    }
  };

  // Helper function to reset game without confirmation
  function silentResetGame() {
    try{ localStorage.removeItem(K.STORAGE_KEY) }catch(e){}
    
    // Clear used cards list to allow reusing cards from bank
    try{
      const usedCardsKey = K.getUsedCardsKey ? K.getUsedCardsKey() : null
      if(usedCardsKey){
        localStorage.removeItem(usedCardsKey)
        console.log('[Tutorial] Lista de cards usados limpa')
      }
    }catch(e){
      console.warn('[Tutorial] Erro ao limpar cards usados:', e)
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
    if(typeof K.updateDayCounterDisplay === 'function') K.updateDayCounterDisplay()
    if(typeof K.updateMoneyDisplay === 'function') K.updateMoneyDisplay()
    if(typeof K.updateWipCounters === 'function') K.updateWipCounters()
    if(typeof K.saveState === 'function') K.saveState()
    
    console.log('[Tutorial] Game state reset complete')
  }

  // Auto-start
  document.addEventListener('DOMContentLoaded', function() {
    // SEMPRE reseta o jogo ao carregar tutorial.html
    silentResetGame();
    
    // SEMPRE reseta o tutorial ao carregar tutorial.html
    K.TutorialState.reset();
    
    if (K.TutorialState.tutorialActive) {
      K.TutorialController.init();
    }
    
    // Botão "Voltar ao Modo Livre" (tutorial.html)
    const backToFreeModeBtn = document.getElementById('backToFreeModeButton');
    if (backToFreeModeBtn) {
      backToFreeModeBtn.addEventListener('click', function() {
        const confirmed = confirm(
          'Voltar ao Modo Livre?\n\n' +
          'Você pode retornar ao tutorial a qualquer momento.\n\n' +
          'Deseja continuar?'
        );
        if (confirmed) {
          K.TutorialState.reset(); // Reseta tutorial para começar do zero na próxima vez
          window.location.href = 'modo-livre.html';
        }
      });
    }
  });

})(window.Kanban);
