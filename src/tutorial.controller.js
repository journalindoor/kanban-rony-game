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
    },

    hookStartTurn: function() {
      const original = window.startTurn;
      window.startTurn = function() {
        if (!K.TutorialState.isActionAllowed('startTurn')) {
          return;
        }
        original.call(this);
        K.TutorialState.executeCallback('startTurn');
      };
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
      document.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('kanban-card')) {
          if (!K.TutorialState.isActionAllowed('dragCard')) {
            e.preventDefault();
            return false;
          }
        }
      }, true);

      document.addEventListener('drop', function(e) {
        if (e.target.closest('.kanban-column')) {
          setTimeout(() => {
            K.TutorialState.executeCallback('dragCard');
          }, 100);
        }
      }, true);
    },

    hookDragRole: function() {
      document.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('role-item')) {
          if (!K.TutorialState.isActionAllowed('dragRole')) {
            e.preventDefault();
            return false;
          }
        }
      }, true);

      document.addEventListener('drop', function(e) {
        if (e.target.closest('.kanban-card')) {
          setTimeout(() => {
            K.TutorialState.executeCallback('dragRole');
          }, 100);
        }
      }, true);
    },

    hookMoveCardButton: function() {
      document.addEventListener('click', function(e) {
        if (e.target.classList.contains('move-card-button')) {
          if (!K.TutorialState.isActionAllowed('moveCardButton')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
          setTimeout(() => {
            K.TutorialState.executeCallback('moveCardButton');
          }, 100);
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
        state.currentStep === state.totalSteps - 1
      );

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

      // WaitFor
      if (step.waitFor) {
        state.registerCallback(step.waitFor, () => this.nextStep());
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
      K.TutorialUI.hide();
      window.location.href = 'index.html';
    },

    /**
     * Finaliza
     */
    finish: function() {
      K.TutorialState.finish();
      K.TutorialUI.hide();
      window.location.href = 'index.html';
    }
  };

  // Auto-start
  document.addEventListener('DOMContentLoaded', function() {
    if (K.TutorialState.tutorialActive) {
      K.TutorialController.init();
    }
  });

})(window.Kanban);
