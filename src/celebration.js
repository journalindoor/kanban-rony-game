// celebration.js — Visual celebration effects (non-intrusive)
(function(K) {
  K = K || (window.Kanban = window.Kanban || {});

  /**
   * Exibe balão de emoção/status do personagem (estilo RPG)
   * Sistema reutilizável para diferentes estados emocionais
   * @param {string} characterId - ID do personagem (ex: 'analista-1')
   * @param {string} emoji - Emoji a ser exibido (ex: '🤘🏽', '😷', '🤯', '😡', '😴', '💥')
   * @param {number} duration - Duração da exibição em ms (padrão: 1800ms)
   */
  K.showEmotionBubble = function(characterId, emoji, duration = 1800) {
    // Buscar o tile do personagem na videochamada
    const tile = document.querySelector(`[data-character-id="${characterId}"]`);
    if (!tile) {
      console.warn('[EmotionBubble] Tile não encontrado para:', characterId);
      return;
    }

    // Prevenir empilhamento: remover balões anteriores deste personagem
    const existingBubble = tile.querySelector('.emotion-bubble');
    if (existingBubble) {
      existingBubble.remove();
    }

    // Criar estrutura do balão de emoção
    const bubbleContainer = document.createElement('div');
    bubbleContainer.className = 'emotion-bubble';
    bubbleContainer.setAttribute('aria-hidden', 'true'); // Acessibilidade
    bubbleContainer.setAttribute('role', 'presentation');

    const bubbleContent = document.createElement('div');
    bubbleContent.className = 'emotion-bubble-content';
    bubbleContent.textContent = emoji;

    bubbleContainer.appendChild(bubbleContent);

    // Adicionar ao tile
    tile.appendChild(bubbleContainer);

    // Remover automaticamente após a duração
    setTimeout(() => {
      if (bubbleContainer.parentNode === tile) {
        bubbleContainer.classList.add('emotion-bubble-exit');
        // Aguardar animação de saída antes de remover
        setTimeout(() => {
          bubbleContainer.remove();
        }, 300);
      }
    }, duration);
  };

  /**
   * Alias para compatibilidade com código existente
   * @deprecated Use showEmotionBubble() para maior clareza semântica
   */
  K.showAssignmentCelebration = function(characterId, emoji = '🤘🏽', duration = 1800) {
    K.showEmotionBubble(characterId, emoji, duration);
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
