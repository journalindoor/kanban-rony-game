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
      closeButton: null,
      minimizeButton: null,
      maximizeButton: null
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
      this.elements.minimizeButton = document.getElementById('tutorialMinimize');
      this.elements.maximizeButton = document.getElementById('tutorialMaximize');
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

      // Minimizar/Maximizar
      if (this.elements.minimizeButton) {
        this.elements.minimizeButton.addEventListener('click', () => {
          this.setMinimized(true);
        });
      }
      if (this.elements.maximizeButton) {
        this.elements.maximizeButton.addEventListener('click', () => {
          this.setMinimized(false);
        });
      }
    },

    /**
     * Mostra message box
     */
    show: function() {
      if (this.elements.messageBox) {
        this.elements.messageBox.classList.add('active');
        // Sempre maximiza ao mostrar
        if (this.elements.messageBox.classList.contains('tutorial-minimized')) {
          this.setMinimized(false);
        }
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
     * Define posicionamento do modal
     */
    setPosition: function(position) {
      if (this.elements.messageBox) {
        if (position === 'left') {
          this.elements.messageBox.classList.add('left-aligned');
        } else {
          this.elements.messageBox.classList.remove('left-aligned');
        }
      }
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
        // Sempre maximiza o modal ao reativar o botão Próximo
        if (this.elements.messageBox && this.elements.messageBox.classList.contains('tutorial-minimized')) {
          this.setMinimized(false);
        }
        // Se o modal estiver fechado (não tem 'active'), reabre
        if (this.elements.messageBox && !this.elements.messageBox.classList.contains('active')) {
          this.show();
          // Se estava minimizado, maximiza
          if (this.elements.messageBox.classList.contains('tutorial-minimized')) {
            this.setMinimized(false);
          }
        }
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
    },

    /**
     * Define estado minimizado/maximizado do modal
     */
    setMinimized: function(minimized) {
      if (!this.elements.messageBox) return;
      if (minimized) {
        this.elements.messageBox.classList.add('tutorial-minimized');
        if (this.elements.minimizeButton) this.elements.minimizeButton.style.display = 'none';
        if (this.elements.maximizeButton) this.elements.maximizeButton.style.display = 'inline-block';
      } else {
        this.elements.messageBox.classList.remove('tutorial-minimized');
        if (this.elements.minimizeButton) this.elements.minimizeButton.style.display = 'inline-block';
        if (this.elements.maximizeButton) this.elements.maximizeButton.style.display = 'none';
      }
    },
  };

})(window.Kanban);
