// tutorial.ui.js — Interface Visual do Tutorial
// Responsabilidade: Exibir mensagens e highlights (SEM bloquear visão do jogo)
(function(K) {
  K = K || (window.Kanban = window.Kanban || {});

  /**
   * Tutorial UI
   * 
   * REGRAS DE APRESENTAÇÃO:
   * ❌ NÃO escurece a tela
   * ❌ NÃO usa overlay opaco
   * ❌ NÃO bloqueia visualmente
   * ✅ Jogo sempre totalmente visível
   * ✅ Apenas highlights nos elementos
   */
  K.TutorialUI = {
    elements: {
      messageBox: null,
      messageTitle: null,
      messageText: null,
      nextButton: null,
      prevButton: null,
      skipButton: null,
      stepCounter: null,
      closeButton: null
    },

    /**
     * Inicializa UI
     */
    init: function() {
      this.cacheElements();
      this.attachEvents();
    },

    /**
     * Cacheia elementos
     */
    cacheElements: function() {
      this.elements.messageBox = document.getElementById('tutorialMessageBox');
      this.elements.messageTitle = document.getElementById('tutorialMessageTitle');
      this.elements.messageText = document.getElementById('tutorialMessageText');
      this.elements.nextButton = document.getElementById('tutorialNext');
      this.elements.prevButton = document.getElementById('tutorialPrev');
      this.elements.skipButton = document.getElementById('tutorialSkip');
      this.elements.stepCounter = document.getElementById('tutorialStepCounter');
      this.elements.closeButton = document.getElementById('tutorialClose');
    },

    /**
     * Anexa eventos
     */
    attachEvents: function() {
      const controller = K.TutorialController;

      if (this.elements.nextButton) {
        this.elements.nextButton.addEventListener('click', () => controller.nextStep());
      }

      if (this.elements.prevButton) {
        this.elements.prevButton.addEventListener('click', () => controller.previousStep());
      }

      if (this.elements.skipButton) {
        this.elements.skipButton.addEventListener('click', () => {
          if (confirm('Pular tutorial?')) {
            controller.skip();
          }
        });
      }

      if (this.elements.closeButton) {
        this.elements.closeButton.addEventListener('click', () => {
          if (confirm('Pular tutorial?')) {
            controller.skip();
          }
        });
      }
    },

    /**
     * Mostra message box
     */
    show: function() {
      if (this.elements.messageBox) {
        this.elements.messageBox.classList.add('active');
      }
    },

    /**
     * Esconde message box
     */
    hide: function() {
      if (this.elements.messageBox) {
        this.elements.messageBox.classList.remove('active');
      }
      this.clearHighlight();
    },

    /**
     * Define mensagem
     */
    setMessage: function(title, text) {
      if (this.elements.messageTitle) {
        this.elements.messageTitle.textContent = title;
      }
      if (this.elements.messageText) {
        this.elements.messageText.innerHTML = text;
      }
    },

    /**
     * Atualiza contador
     */
    updateStepCounter: function(current, total) {
      if (this.elements.stepCounter) {
        this.elements.stepCounter.textContent = `${current + 1} / ${total}`;
      }
    },

    /**
     * Atualiza botões
     */
    updateNavigationButtons: function(isFirstStep, isLastStep, disableNext) {
      if (this.elements.prevButton) {
        this.elements.prevButton.disabled = isFirstStep;
        this.elements.prevButton.style.opacity = isFirstStep ? '0.5' : '1';
      }

      if (this.elements.nextButton) {
        this.elements.nextButton.textContent = isLastStep ? 'Concluir' : 'Próximo';
        this.elements.nextButton.disabled = disableNext || false;
        this.elements.nextButton.style.opacity = disableNext ? '0.5' : '1';
      }
    },

    /**
     * Reabilita botão Próximo (usado quando ação waitFor é cumprida)
     */
    enableNextButton: function() {
      console.log('[Tutorial UI] enableNextButton chamado');
      console.log('[Tutorial UI] nextButton existe?', !!this.elements.nextButton);
      
      // Se não está em cache, tenta buscar novamente
      if (!this.elements.nextButton) {
        this.elements.nextButton = document.getElementById('tutorialNext');
        console.log('[Tutorial UI] Buscou novamente, encontrou?', !!this.elements.nextButton);
      }
      
      if (this.elements.nextButton) {
        console.log('[Tutorial UI] Estado antes:', {
          disabled: this.elements.nextButton.disabled,
          opacity: this.elements.nextButton.style.opacity
        });
        
        this.elements.nextButton.disabled = false;
        this.elements.nextButton.style.opacity = '1';
        
        console.log('[Tutorial UI] Estado depois:', {
          disabled: this.elements.nextButton.disabled,
          opacity: this.elements.nextButton.style.opacity
        });
      } else {
        console.error('[Tutorial UI] ERRO: Botão Próximo não encontrado!');
      }
    },

    /**
     * Destaca elemento do jogo
     */
    /**
     * Destaca elemento(s) no DOM
     * @param {string} selector - Seletor CSS (pode incluir múltiplos separados por vírgula)
     * @param {boolean} additive - Se true, adiciona highlight sem limpar anteriores
     */
    highlightElement: function(selector, additive) {
      if (!additive) {
        this.clearHighlight();
      }
      if (!selector) return;

      // Suporta múltiplos seletores separados por vírgula
      const selectors = selector.split(',').map(s => s.trim());
      selectors.forEach(sel => {
        const elements = document.querySelectorAll(sel);
        elements.forEach(element => {
          if (element) {
            element.classList.add('tutorial-highlight');
          }
        });
      });
    },

    /**
     * Remove destaque
     */
    clearHighlight: function() {
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
    },

    /**
     * Atualiza sprite do Rony
     * @param {string} position - Posição do sprite (ex: '0 0', '-100px 0')
     * @param {boolean} flip - Se true, espelha horizontalmente
     */
    setRonySprite: function(position, flip) {
      const ronySprite = document.querySelector('.tutorial-character > div');
      if (ronySprite && position) {
        ronySprite.style.backgroundPosition = position;
        ronySprite.style.transform = flip ? 'scaleX(-1)' : '';
      }
    }
  };

})(window.Kanban);
