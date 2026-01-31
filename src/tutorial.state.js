// tutorial.state.js — Estado do Tutorial
// Responsabilidade: Armazenar estado do tutorial (passo atual, ativo/inativo)
(function(K) {
  K = K || (window.Kanban = window.Kanban || {});

  /**
   * Tutorial State
   * 
   * FLAG GLOBAL: tutorialActive
   * - true → tutorial controla o jogo
   * - false → jogo funciona normalmente
   */
  K.TutorialState = {
    // FLAG PRINCIPAL
    tutorialActive: true,

    // Navegação
    currentStep: 0,
    totalSteps: 0,

    // Sistema de bloqueio centralizado
    // Define quais ações do jogo estão permitidas
    allowedActions: {
      startTurn: false,
      resetGame: false,
      toggleArchived: false,
      dragCard: false,
      dragRole: false,
      moveCardButton: false,
      removeRole: false
    },

    // Callbacks para eventos reais do jogo
    pendingCallbacks: {},

    /**
     * Verifica se ação está permitida (filtro centralizado)
     * ATUALIZADO: Tutorial não-bloqueante - sempre permite ações
     */
    isActionAllowed: function(action) {
      // Tutorial agora é apenas informativo, nunca bloqueia
      return true;
    },

    /**
     * Permite ação específica
     */
    allowAction: function(action) {
      if (this.allowedActions.hasOwnProperty(action)) {
        this.allowedActions[action] = true;
      }
    },

    /**
     * Bloqueia ação específica
     */
    blockAction: function(action) {
      if (this.allowedActions.hasOwnProperty(action)) {
        this.allowedActions[action] = false;
      }
    },

    /**
     * Permite múltiplas ações
     */
    allowActions: function(actions) {
      actions.forEach(action => this.allowAction(action));
    },

    /**
     * Bloqueia todas as ações
     */
    blockAllActions: function() {
      Object.keys(this.allowedActions).forEach(action => {
        this.allowedActions[action] = false;
      });
    },

    /**
     * Permite todas as ações
     */
    allowAllActions: function() {
      Object.keys(this.allowedActions).forEach(action => {
        this.allowedActions[action] = true;
      });
    },

    /**
     * Registra callback para evento
     */
    registerCallback: function(eventName, callback) {
      this.pendingCallbacks[eventName] = callback;
    },

    /**
     * Executa callback registrado
     */
    executeCallback: function(eventName, ...args) {
      if (this.pendingCallbacks[eventName]) {
        const callback = this.pendingCallbacks[eventName];
        delete this.pendingCallbacks[eventName];
        callback(...args);
      }
    },

    /**
     * Limpa callback
     */
    clearCallback: function(eventName) {
      delete this.pendingCallbacks[eventName];
    },

    /**
     * Navegação
     */
    nextStep: function() {
      if (this.currentStep < this.totalSteps - 1) {
        this.currentStep++;
        return true;
      }
      return false;
    },

    previousStep: function() {
      if (this.currentStep > 0) {
        this.currentStep--;
        return true;
      }
      return false;
    },

    setStep: function(stepIndex) {
      if (stepIndex >= 0 && stepIndex < this.totalSteps) {
        this.currentStep = stepIndex;
      }
    },

    /**
     * Reset
     */
    reset: function() {
      this.tutorialActive = true; // Garante que tutorial está ativo
      this.currentStep = 0;
      this.blockAllActions();
      this.pendingCallbacks = {};
    },

    /**
     * Finaliza tutorial
     */
    finish: function() {
      this.tutorialActive = false;
      this.allowAllActions();
      this.pendingCallbacks = {};
    }
  };

  // Debug
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.TutorialState = K.TutorialState;
  }

})(window.Kanban);
