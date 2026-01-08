# Sistema de Balões de Emoção (Emotion Bubbles)

## Visão Geral

Sistema reutilizável de balões de emoção estilo RPG para exibir estados emocionais/temporários dos personagens no painel de videochamada.

## API

### `Kanban.showEmotionBubble(characterId, emoji, duration)`

Exibe um balão de emoção sobre o personagem especificado.

**Parâmetros:**
- `characterId` (string): ID do personagem (ex: 'analista-1', 'programador-2')
- `emoji` (string): Emoji a ser exibido no balão
- `duration` (number, opcional): Duração em ms (padrão: 1800ms)

**Exemplo:**
```javascript
// Mostrar personagem feliz com tarefa
Kanban.showEmotionBubble('analista-1', '🤘🏽', 1800);

// Personagem doente
Kanban.showEmotionBubble('programador-2', '😷', 3000);

// Personagem em burnout
Kanban.showEmotionBubble('qa-1', '🤯', 2500);
```

### `Kanban.showAssignmentCelebration(characterId, emoji, duration)` *(deprecated)*

Alias mantido para compatibilidade com código existente. Use `showEmotionBubble()` em código novo.

## Visual

O balão possui:
- **Fundo:** Branco (#ffffff)
- **Borda:** Cinza claro (2px solid #d0d0d0)
- **Cantos:** Arredondados (12px)
- **Sombra:** Dupla (suave e profunda)
- **Ponta:** Triângulo inferior direito (estilo speech bubble)
- **Animação de entrada:** Pop com efeito de mola (0.4s)
- **Animação de saída:** Fade-out + scale-down (0.3s)

## Casos de Uso Futuros

### Estados de Personagem

```javascript
// Sistema de doenças/ausências
const CHARACTER_STATES = {
  SICK: '😷',           // Personagem doente (não pode trabalhar)
  STRESSED: '🤯',       // Personagem em burnout/estressado
  ANGRY: '😡',          // Personagem irritado (baixa eficiência)
  SLEEPING: '😴',       // Personagem ausente no dia
  QUIT: '💥',           // Personagem pediu demissão
  HAPPY: '🤘🏽',          // Personagem feliz com tarefa
  CONFUSED: '😵',       // Personagem confuso (bug/problema)
  TIRED: '😪',          // Personagem cansado (fim do dia)
  EXCITED: '🤩',        // Personagem animado (novo projeto)
  WORRIED: '😰'         // Personagem preocupado (prazo apertado)
};

// Exemplo de uso em sistema de eventos
function onCharacterGetsSick(characterId) {
  Kanban.showEmotionBubble(characterId, CHARACTER_STATES.SICK, 2500);
  // Lógica adicional: remover personagem do trabalho, etc.
}

function onCharacterQuits(characterId) {
  Kanban.showEmotionBubble(characterId, CHARACTER_STATES.QUIT, 3000);
  // Lógica adicional: desabilitar personagem, mostrar modal, etc.
}
```

### Integração com Sistema de Eventos (Futuro)

```javascript
// Em um futuro sistema de eventos de capítulo
const chapterEvents = {
  DAY_START: (day) => {
    if (day === 5) {
      // Sexta-feira: todos animados
      Object.keys(Kanban.unlockedCharacters).forEach(charId => {
        if (Kanban.unlockedCharacters[charId]) {
          Kanban.showEmotionBubble(charId, '🤩', 2000);
        }
      });
    }
  },
  
  DEADLINE_APPROACHING: (characterId) => {
    Kanban.showEmotionBubble(characterId, '😰', 2500);
  },
  
  BUG_FOUND: (characterId) => {
    Kanban.showEmotionBubble(characterId, '😵', 2000);
  }
};
```

### Sistema de Moral/Eficiência (Futuro)

```javascript
// Sistema que afeta produtividade baseado em estado emocional
const EMOTION_MODIFIERS = {
  '😡': -0.5,   // Irritado: -50% eficiência
  '🤯': -0.7,   // Burnout: -70% eficiência
  '😴': -1.0,   // Dormindo: sem trabalho
  '😷': -1.0,   // Doente: sem trabalho
  '🤘🏽': +0.2,   // Feliz: +20% eficiência
  '🤩': +0.3    // Animado: +30% eficiência
};

function applyEmotionToCharacter(characterId, emotion, duration) {
  Kanban.showEmotionBubble(characterId, emotion, duration);
  
  // Aplicar modificador de eficiência temporariamente
  const modifier = EMOTION_MODIFIERS[emotion] || 0;
  // ... lógica para modificar stats do personagem
}
```

## Arquitetura

### Estrutura HTML Gerada

```html
<div class="video-tile" data-character-id="analista-1">
  <!-- conteúdo do personagem -->
  
  <!-- Balão de emoção (adicionado dinamicamente) -->
  <div class="emotion-bubble" aria-hidden="true" role="presentation">
    <div class="emotion-bubble-content">
      🤘🏽
    </div>
  </div>
</div>
```

### CSS Classes

- `.emotion-bubble` - Container principal com posicionamento e animação
- `.emotion-bubble-content` - Conteúdo do balão (fundo branco, borda, emoji)
- `.emotion-bubble-exit` - Classe adicionada para animação de saída

### Fluxo de Execução

1. **Chamada:** `showEmotionBubble(characterId, emoji, duration)`
2. **Validação:** Verifica se tile do personagem existe
3. **Limpeza:** Remove balões existentes do mesmo personagem
4. **Criação:** Cria estrutura HTML do balão
5. **Inserção:** Adiciona ao DOM do tile
6. **Remoção:** Após `duration`, adiciona classe `.emotion-bubble-exit` e remove do DOM

## Notas de Implementação

- **Não-intrusivo:** `pointer-events: none` permite interação com personagem
- **Acessível:** Atributos ARIA indicam elemento decorativo
- **Performático:** Usa CSS animations (GPU-accelerated)
- **Reutilizável:** Emoji parametrizável, sem lógica hardcoded
- **Extensível:** Fácil adicionar novos estados sem modificar core

## Retrocompatibilidade

A API antiga `showAssignmentCelebration()` permanece funcional como alias para `showEmotionBubble()`, garantindo zero regressões no código existente.

## Próximos Passos

1. Criar constantes para emojis comuns em arquivo dedicado
2. Implementar sistema de eventos de capítulo que utilize os balões
3. Adicionar sons opcionais para cada tipo de emoção
4. Criar variações de balão (thought bubble vs speech bubble)
5. Sistema de animações especiais para estados críticos (burnout, demissão)
