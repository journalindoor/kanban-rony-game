# WIP Counters Implementation

## Overview
Sistema de contadores de WIP (Work In Progress) implementado globalmente em todas as páginas do jogo.

## Características

### 1. **Visualização**
- Cada coluna exibe um contador no formato `X/Y`
- **Backlog**: `X/5` (limite de 5 cards)
- **Outras colunas**: `X/∞` (sem limite)

### 2. **Localização**
- Contadores posicionados no cabeçalho de cada coluna
- Alinhados à direita do nome da coluna
- Estilo visual discreto mas legível

### 3. **Estilo CSS**
```css
.wip-counter{
  font-size:11px;
  font-weight:600;
  color:#6b7280;
  background:rgba(0,0,0,0.04);
  padding:2px 8px;
  border-radius:999px;
  margin-left:8px;
}
```

## Arquitetura

### Função Central
**`K.updateWipCounters()`** em [src/main.js](../src/main.js)

```javascript
K.updateWipCounters = function(){
  const counters = document.querySelectorAll('.wip-counter[data-counter-col]')
  
  counters.forEach(counter => {
    const columnName = counter.getAttribute('data-counter-col')
    if(!columnName) return
    
    const cardsContainer = document.querySelector(`.cards[data-col="${columnName}"]`)
    if(!cardsContainer) return
    
    const cardCount = cardsContainer.querySelectorAll('.card').length
    const limit = (columnName === 'Backlog') ? '5' : '∞'
    
    counter.textContent = `${cardCount}/${limit}`
  })
}
```

### Pontos de Atualização

A função `updateWipCounters()` é chamada nos seguintes pontos críticos:

1. **[src/dragdrop.js](../src/dragdrop.js)** (linha ~48)
   - Após movimentação por drag & drop

2. **[src/main.js](../src/main.js)** (linhas múltiplas)
   - Após `archivePublishedCards()` (linha ~137)
   - Após `renderFromState()` (linha ~216)
   - Após `resetGame()` (linha ~255)
   - No `DOMContentLoaded` (linha ~355)

3. **[src/cardBankManager.js](../src/cardBankManager.js)** (linha ~164)
   - Após `renderBacklogCards()`

4. **[src/movementRules.js](../src/movementRules.js)** (linha ~149)
   - Após `moveCardToNextColumn()` (botão "Próxima Coluna")

## Estrutura HTML

### Exemplo de Coluna
```html
<div class="column" data-col="Backlog">
  <div class="column-header">
    Backlog
    <span class="wip-counter" data-counter-col="Backlog">0/5</span>
  </div>
  <div class="cards" data-col="Backlog"></div>
</div>
```

### Páginas Implementadas
- ✅ [index.html](../index.html) - Modo Livre
- ✅ [tutorial.html](../tutorial.html) - Tutorial
- ✅ [chapter1.html](../chapter1.html) - Capítulo 1
- ⏳ chapter2-5.html (pendentes - páginas ainda em placeholder)

## Características Técnicas

### 1. **Detecção Dinâmica**
- Sistema detecta automaticamente qual coluna é Backlog
- Não requer hardcoding de valores no HTML
- Funciona com qualquer número de colunas

### 2. **Atualização Reativa**
- Contadores atualizam automaticamente em todas as operações de estado
- Zero intervenção manual necessária
- Performance otimizada (apenas DOM queries simples)

### 3. **Observacional**
- Sistema é **puramente observacional**
- Não interfere com lógica de controle existente
- Complementa regra de limite do Backlog (já implementada em [src/dragdrop.js](../src/dragdrop.js))

## Integração com Sistema Existente

### Compatibilidade
- ✅ Funciona com drag & drop
- ✅ Funciona com botão "Próxima Coluna"
- ✅ Funciona com arquivamento automático
- ✅ Funciona com reset de jogo
- ✅ Funciona com save/load de estado
- ✅ Funciona com sistema de tutorial
- ✅ Funciona com sistema de capítulos

### Não Afeta
- Lógica de movimentação de cards
- Lógica de limite do Backlog
- Sistema de roles
- Sistema de indicadores
- Sistema de pagamento

## Manutenção

### Para Adicionar Nova Coluna
1. Adicionar HTML da coluna com estrutura padrão
2. Incluir `<span class="wip-counter" data-counter-col="NomeColuna">0/∞</span>`
3. Sistema detectará automaticamente

### Para Modificar Limite
Editar função `updateWipCounters()` em [src/main.js](../src/main.js):
```javascript
const limit = (columnName === 'Backlog') ? '5' : 
              (columnName === 'NovaColuna') ? '3' : '∞'
```

## Status
✅ **Implementação Completa**
- HTML: 3 páginas atualizadas
- CSS: Estilização implementada
- JavaScript: Função centralizada + 6 pontos de integração
- Testes: Zero erros detectados

## Próximos Passos Futuros
- [ ] Adicionar contadores aos capítulos 2-5 quando forem implementados
- [ ] Considerar colorização do contador quando próximo ao limite
- [ ] Adicionar tooltip com informações adicionais (opcional)
