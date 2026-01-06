// celebration.js — Visual celebration effects (non-intrusive)
(function(K) {
  K = K || (window.Kanban = window.Kanban || {});

  /**
   * Exibe emoji comemorativo temporariamente no container do personagem
   * @param {string} characterId - ID do personagem (ex: 'analista-1')
   * @param {string} emoji - Emoji a ser exibido (padrão: '🤘')
   * @param {number} duration - Duração da animação em ms (padrão: 800ms)
   */
  K.showAssignmentCelebration = function(characterId, emoji = '🤘', duration = 800) {
    // Buscar o tile do personagem na videochamada
    const tile = document.querySelector(`[data-character-id="${characterId}"]`);
    if (!tile) {
      console.warn('[Celebration] Tile não encontrado para:', characterId);
      return;
    }

    // Prevenir empilhamento: remover celebrações anteriores deste personagem
    const existingCelebration = tile.querySelector('.celebration-emoji');
    if (existingCelebration) {
      existingCelebration.remove();
    }

    // Criar elemento do emoji
    const emojiElement = document.createElement('div');
    emojiElement.className = 'celebration-emoji';
    emojiElement.textContent = emoji;
    emojiElement.setAttribute('aria-hidden', 'true'); // Acessibilidade

    // Adicionar ao tile
    tile.appendChild(emojiElement);

    // Remover automaticamente após a animação
    setTimeout(() => {
      if (emojiElement.parentNode === tile) {
        emojiElement.remove();
      }
    }, duration);
  };

  /**
   * Converte nome de papel para ID de personagem
   * Ex: "Analista 1" → "analista-1"
   * @param {string} roleName - Nome do papel
   * @returns {string|null} - ID do personagem ou null
   */
  K.roleNameToCharacterId = function(roleName) {
    if (!roleName) return null;

    // Mapeamento direto de nomes para IDs
    const roleToCharacterMap = {
      'Analista 1': 'analista-1',
      'Analista 2': 'analista-2',
      'Analista 3': 'analista-3',
      'Programador 1': 'programador-1',
      'Programador 2': 'programador-2',
      'Programador 3': 'programador-3',
      'QA/Tester 1': 'qa-1',
      'QA/Tester 2': 'qa-2',
      'QA/Tester 3': 'qa-3'
    };

    return roleToCharacterMap[roleName] || null;
  };

})(window.Kanban);
