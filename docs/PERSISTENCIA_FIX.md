# Correção de Persistência - Reset Indevido ao Recarregar

## Problema Identificado

Ao recarregar a página (F5), os valores dos indicadores eram **redefinidos** para valores hardcodados:
- Refinamento: 10
- Fazendo: 15
- Homologando: 8
- Ajustes: 6
- etc.

Isso violava a regra fundamental: **valores só devem mudar por lógica de jogo, não por reload**.

## Causa Raiz

Dois blocos de código estavam causando o problema:

### 1. **gameLogic.js** (linhas 8-16)
```javascript
K.columnDifficulties = K.columnDifficulties || {
  Refinamento: 10,
  SprintBacklog: 12,
  Fazendo: 15,
  Homologando: 8,
  Ajustes: 6,
  Backlog: 2,
  Publicado: 2
}
```

Este objeto mantinha valores hardcodados globais.

### 2. **main.js** (linhas 133-145)
```javascript
// sync displayed indicators with current column difficulties
if(K.columnDifficulties){
  Object.keys(K.columnDifficulties).forEach(colName=>{
    document.querySelectorAll('.indicator').forEach(ind=>{
      const label = (ind.querySelector('.ind-label') || {}).textContent || ''
      if(label === colName){
        const valEl = ind.querySelector('.ind-value')
        if(valEl) valEl.textContent = String(K.columnDifficulties[colName])
      }
    })
  })
}
```

**Este bloco sobrescrevia os valores restaurados do localStorage com os hardcodados.**

## Solução Aplicada

### ✅ Removido de gameLogic.js
Deletada a definição de `K.columnDifficulties` que continha valores fixos. Não é responsabilidade do gameLogic.js manter dificuldades de colunas globais.

### ✅ Removido de main.js
Deletado o bloco que sincronizava indicadores com `K.columnDifficulties`. Agora os valores vêm **exclusivamente** do localStorage via `K.loadState()` → `K.renderFromState()`.

## Fluxo de Persistência Correto (Após Fix)

1. **Reload da página (F5)**
   - `DOMContentLoaded` dispara em main.js
   - `K.loadState()` lê localStorage
   - Se encontrar estado salvo:
     - `K.renderFromState(saved)` restaura cards com seus indicadores originais
     - Valores vêm do `saved.columns[colName][i].indicators`
   - Se não encontrar estado:
     - Cria 1 card padrão no Backlog
     - Indicadores inicializam: Ajustes=0, demais=randInt(2,18)
     - Salva com `K.saveState()`

2. **Durante o jogo**
   - Ao clicar "Iniciar": `K.runStartTurn()` reduz apenas indicadores corretos
   - Ao arrastar cards: `K.saveState()` persiste novo estado
   - Nenhuma sobrescrita global ocorre

## Garantias Mantidas

✅ Nenhuma dificuldade fica negativa (validação em cards.js e gameLogic.js)
✅ Ajustes só nascem em 0 (cards.js: `if(name === 'Ajustes') initial = 0`)
✅ Ajustes só são gerados quando há papel em Homologando (gameLogic.js e adjustmentsRules.js)
✅ Valores persistem corretamente (storage.js: `Number.isFinite(raw)` preserva zeros)
✅ Reload restaura estado completo: cards, posições, indicadores, papéis associados

## Testando a Correção

1. Crie um card no Backlog
2. Mova-o para Refinamento
3. Clique "Iniciar" algumas vezes (indica reduzem)
4. Pressione F5 (reload)
5. **Esperado:** Valores dos indicadores são **restaurados exatamente como estavam antes do reload**
6. Nenhum valor fixo é reimposto

## Resumo das Mudanças

| Arquivo | Mudança | Razão |
|---------|---------|-------|
| `src/gameLogic.js` | Removidas linhas 8-16 (K.columnDifficulties hardcoded) | Não deve manter dificuldades globais |
| `src/main.js` | Removidas linhas 133-145 (sincronização com columnDifficulties) | Valores vêm do localStorage, não são sobrescritos |

---

**Resultado Final:** Sistema de persistência agora respeita as regras de jogo. Valores só mudam por lógica explícita, nunca por reload.
