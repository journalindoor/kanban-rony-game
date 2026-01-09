/**
 * HOME.JS
 * Script para animação dos sprites na tela inicial do RonyOffice
 * 
 * Lógica de animação:
 * 1. Sprites começam "offline" (PC sem ninguém)
 * 2. Após um delay, o Rony "aparece" no PC
 * 3. Animação contínua de digitação/trabalho
 */

(function() {
    'use strict';

    /**
     * Inicializa as animações dos sprites quando a página carrega
     */
    function initSpriteAnimations() {
        // Busca todos os sprites na página
        const sprites = document.querySelectorAll('.option-sprite');
        
        sprites.forEach((sprite, index) => {
            // Delay escalonado para cada sprite (300ms entre cada)
            const delay = (index + 1) * 500;
            
            // Aguarda o delay e então inicia a animação
            setTimeout(() => {
                animateSprite(sprite);
            }, delay);
        });
    }

    /**
     * Anima um sprite individual
     * @param {HTMLElement} spriteElement - Elemento do sprite a ser animado
     */
    function animateSprite(spriteElement) {
        // Primeiro, mostra o sprite "offline" por 800ms
        setTimeout(() => {
            // Adiciona a classe 'animated' que inicia a animação CSS
            spriteElement.classList.add('animated');
            
            // Adiciona efeito de "entrada" suave
            spriteElement.style.opacity = '0';
            spriteElement.style.transition = 'opacity 0.5s ease';
            
            // Fade in
            setTimeout(() => {
                spriteElement.style.opacity = '1';
            }, 50);
            
        }, 800);
    }

    /**
     * Adiciona interatividade aos cards
     */
    function initCardInteractions() {
        const cards = document.querySelectorAll('.option-card');
        
        cards.forEach(card => {
            // Ao passar o mouse sobre o card, acelera a animação do sprite
            card.addEventListener('mouseenter', function() {
                const sprite = this.querySelector('.option-sprite');
                if (sprite && sprite.classList.contains('animated')) {
                    sprite.style.animationDuration = '0.8s';
                }
            });
            
            // Ao tirar o mouse, volta à velocidade normal
            card.addEventListener('mouseleave', function() {
                const sprite = this.querySelector('.option-sprite');
                if (sprite && sprite.classList.contains('animated')) {
                    sprite.style.animationDuration = '1.5s';
                }
            });
        });
    }

    /**
     * Adiciona efeito de clique nos botões
     */
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.option-button');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Efeito de ripple/onda ao clicar
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                ripple.style.width = ripple.style.height = '100px';
                ripple.style.marginLeft = '-50px';
                ripple.style.marginTop = '-50px';
                ripple.style.animation = 'ripple 0.6s';
                ripple.style.pointerEvents = 'none';
                
                const rect = this.getBoundingClientRect();
                ripple.style.left = (e.clientX - rect.left) + 'px';
                ripple.style.top = (e.clientY - rect.top) + 'px';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    /**
     * Adiciona animação de entrada para os cards (stagger effect)
     */
    function initStaggerAnimation() {
        const cards = document.querySelectorAll('.option-card');
        
        cards.forEach((card, index) => {
            // Define o delay da animação baseado no index
            card.style.animationDelay = `${index * 0.2}s`;
        });
    }

    /**
     * Verifica se há um modo salvo e destaca o card correspondente
     */
    function highlightLastPlayedMode() {
        const lastMode = localStorage.getItem('kanban_last_mode');
        
        if (lastMode) {
            const card = document.querySelector(`.option-card.${lastMode}`);
            if (card) {
                // Adiciona um badge "Continuar" ao card do último modo jogado
                const badge = document.createElement('div');
                badge.textContent = '◀ Continue de onde parou';
                badge.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    box-shadow: 0 2px 10px rgba(245, 158, 11, 0.4);
                    animation: pulse 2s infinite;
                `;
                card.appendChild(badge);
            }
        }
    }

    /**
     * Salva o modo escolhido antes de navegar
     */
    function trackModeSelection() {
        const tutorialButton = document.querySelector('.tutorial .option-button');
        const modoLivreButton = document.querySelector('.modo-livre .option-button');
        const capitulosButton = document.querySelector('.capitulos .option-button');
        
        if (tutorialButton) {
            tutorialButton.addEventListener('click', () => {
                localStorage.setItem('kanban_last_mode', 'tutorial');
            });
        }
        
        if (modoLivreButton) {
            modoLivreButton.addEventListener('click', () => {
                localStorage.setItem('kanban_last_mode', 'modo-livre');
            });
        }
        
        if (capitulosButton) {
            capitulosButton.addEventListener('click', () => {
                localStorage.setItem('kanban_last_mode', 'capitulos');
            });
        }
    }

    /**
     * Adiciona estilo de animação para o ripple
     */
    function injectRippleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                from {
                    opacity: 1;
                    transform: scale(0);
                }
                to {
                    opacity: 0;
                    transform: scale(4);
                }
            }
            
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Inicializa tudo quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎮 RonyOffice Home - Inicializando...');
        
        // Injeta estilos necessários
        injectRippleStyles();
        
        // Inicializa animações e interações
        initStaggerAnimation();
        // initSpriteAnimations(); // Desabilitado - sprites estáticos
        // initCardInteractions(); // Desabilitado - sem interação com sprites
        initButtonEffects();
        highlightLastPlayedMode();
        trackModeSelection();
        
        console.log('✅ RonyOffice Home - Pronto!');
    });

})();
