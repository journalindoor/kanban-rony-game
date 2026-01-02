# INFRAESTRUTURA DO TUTORIAL — BLOCO 0

**Status:** ✅ Concluído  
**Data:** 2025

---

## ARQUITETURA TÉCNICA

### 🏗️ Estrutura de Arquivos

```
src/
├── tutorial.state.js      (Estado + Flag tutorialActive)
├── tutorial.ui.js         (Interface visual)
├── tutorial.steps.js      (Array de passos - vazio por enquanto)
└── tutorial.controller.js (Orquestrador + Hooks)

css/
└── tutorial.css           (Estilo sem overlay opaco)

tutorial.html              (HTML idêntico ao index.html)
```

---

## MÓDULOS

### 1. `tutorial.state.js`
**Responsabilidade:** Gerenciamento de estado

**Flag Global:**
```javascript
tutorialActive: true
```

**Sistema de Filtro:**
```javascript
allowedActions: {
  startTurn: false,
  resetGame: false,
  toggleArchived: false,
  dragCard: false,
  dragRole: false,
  moveCardButton: false,
  removeRole: false
}
```

**Funções Principais:**
- `isActionAllowed(action)` — Verifica permissão
- `allowAction(action)` — Permite ação
- `blockAction(action)` — Bloqueia ação
- `registerCallback(event, fn)` — Registra callback para evento real
- `executeCallback(event)` — Executa callback quando evento ocorre

---

### 2. `tutorial.ui.js`
**Responsabilidade:** Interface visual não-bloqueante

**REGRAS OBRIGATÓRIAS:**
- ❌ NÃO escurecer tela
- ❌ NÃO usar overlay opaco
- ❌ NÃO bloquear visualmente o jogo
- ✅ Jogo sempre visível
- ✅ Apenas highlights nos elementos

**Elementos:**
- `tutorialMessageBox` — Caixa flutuante (top-right)
- `tutorialMessageTitle` — Título da mensagem
- `tutorialMessageText` — Conteúdo HTML
- `tutorialNext/Prev/Skip` — Botões de navegação
- `tutorialClose` — Botão × para pular
- `tutorialStepCounter` — Contador de passos

**Funções Principais:**
- `show()` / `hide()` — Mostra/esconde message box
- `setMessage(title, text)` — Define conteúdo
- `highlightElement(selector)` — Destaca elemento do jogo
- `clearHighlight()` — Remove destaque

---

### 3. `tutorial.steps.js`
**Responsabilidade:** Sequência pedagógica

**Estrutura de um Passo:**
```javascript
{
  title: 'Título',
  message: '<p>HTML da mensagem</p>',
  highlight: '#seletor-css',
  allowedActions: ['startTurn', 'dragCard'],
  onEnter: function() { /* lógica ao entrar */ },
  onExit: function() { /* lógica ao sair */ },
  waitFor: 'nomeEvento' // opcional
}
```

**Estado Atual:**
```javascript
K.TutorialSteps = []  // Vazio — infraestrutura primeiro
```

---

### 4. `tutorial.controller.js`
**Responsabilidade:** Orquestração central

**Hooks Não-Invasivos:**
O controller instala hooks nas funções do jogo que:
1. Preservam 100% da função original
2. Verificam permissão ANTES de executar
3. Notificam tutorial DEPOIS da execução

**Hooks Instalados:**
- `hookStartTurn()`
- `hookResetGame()`
- `hookToggleArchived()`
- `hookDragCard()`
- `hookDragRole()`
- `hookMoveCardButton()`
- `hookRemoveRole()`

**Exemplo de Hook:**
```javascript
hookStartTurn: function() {
  const original = window.startTurn;
  window.startTurn = function() {
    if (!K.TutorialState.isActionAllowed('startTurn')) {
      return; // BLOQUEIA
    }
    original.call(this); // EXECUTA ORIGINAL
    K.TutorialState.executeCallback('startTurn'); // NOTIFICA
  };
}
```

**Funções Principais:**
- `init()` — Inicializa sistema
- `hookGameActions()` — Instala todos os hooks
- `showCurrentStep()` — Exibe passo atual
- `nextStep()` / `previousStep()` — Navegação
- `skip()` / `finish()` — Finaliza tutorial

---

## CSS (`tutorial.css`)

### Message Box
- `position: fixed; top: 20px; right: 20px`
- Largura: `380px`
- Animação: `translateX(100%)` → `translateX(0)`
- Z-index: `9999`

### Highlight
- `outline: 3px solid #f39c12`
- `box-shadow: 0 0 0 9999px rgba(0,0,0,0.15)` — Escurece levemente ao redor
- Animação de pulso
- Z-index: `9998`

### Estados
- `.tutorial-message-box` — Inicialmente invisível
- `.tutorial-message-box.active` — Visível e desliza da direita

---

## HTML (`tutorial.html`)

**Diferenças em relação ao `index.html`:**
1. Badge "Tutorial" no título
2. Botão "Voltar ao Modo Livre"
3. Estrutura `#tutorialMessageBox` no final do body
4. Links para 4 scripts do tutorial

**Estrutura da Message Box:**
```html
<div id="tutorialMessageBox" class="tutorial-message-box">
  <div class="tutorial-message-header">
    <span id="tutorialStepCounter">0 / 0</span>
    <button id="tutorialClose">×</button>
  </div>
  <div class="tutorial-message-body">
    <h3 id="tutorialMessageTitle">Tutorial</h3>
    <div id="tutorialMessageText">Mensagem</div>
  </div>
  <div class="tutorial-message-footer">
    <button id="tutorialPrev">Anterior</button>
    <button id="tutorialSkip">Pular</button>
    <button id="tutorialNext">Próximo</button>
  </div>
</div>
```

---

## MODELO CONCEITUAL

### 🎯 Três Pilares

1. **Orquestrador de Estados**
   - Controla qual estado o tutorial está (passo atual)
   - Coordena transições entre passos
   - Flag `tutorialActive` como controle mestre

2. **Guia Reativo**
   - Aguarda eventos REAIS do jogo
   - Não simula, não inventa lógica fake
   - Reage com `callbacks` registrados

3. **Filtro de Ações**
   - Sistema centralizado em `allowedActions`
   - Cada passo define quais ações são permitidas
   - Hooks verificam permissão antes de executar

---

## FLUXO DE EXECUÇÃO

### Inicialização
1. `DOMContentLoaded` dispara
2. Verifica se `tutorialActive === true`
3. `TutorialController.init()` é chamado
4. `TutorialState.reset()` zera estado
5. `TutorialUI.init()` cacheia elementos
6. `hookGameActions()` instala hooks
7. `showCurrentStep()` exibe primeiro passo (se houver)

### Durante um Passo
1. Jogador tenta ação (ex: clicar "Iniciar Turno")
2. Hook intercepta: verifica `isActionAllowed('startTurn')`
3. Se **bloqueado**: retorna sem executar
4. Se **permitido**: executa função original do jogo
5. Após execução: `executeCallback('startTurn')` notifica tutorial
6. Tutorial reage (ex: avança para próximo passo)

### Navegação Manual
1. Jogador clica "Próximo"
2. `TutorialController.nextStep()` é chamado
3. Executa `onExit` do passo atual
4. Incrementa `currentStep`
5. Executa `showCurrentStep()`
6. Atualiza UI com novo conteúdo
7. Executa `onEnter` do novo passo
8. Configura `allowedActions` do novo passo

---

## GARANTIAS TÉCNICAS

✅ **Funções originais 100% preservadas**  
Hooks envolvem funções, não as substituem.

✅ **Zero lógica fake**  
Nenhuma simulação, apenas observação de eventos reais.

✅ **Estado do jogo isolado**  
Tutorial não altera `gameState`, apenas controla interações.

✅ **Interface não-bloqueante**  
Jogo sempre visível, sem escurecimento opaco.

✅ **Sistema de callbacks robusto**  
Permite passos que aguardam eventos específicos.

✅ **Navegação bidirecional**  
Suporta "Próximo" e "Anterior" (quando fizer sentido).

---

## PRÓXIMOS PASSOS (Pedagógicos)

### BLOCO 1: BOAS-VINDAS E CONTEXTO
- 6 passos introdutórios
- Tom: sério, direto, consequencial
- Objetivo: ambientar jogador SEM ensinar regras ainda

### BLOCO 2: PRIMEIRO TURNO
- Ensinar mecânica básica de turnos
- Permitir `startTurn` pela primeira vez
- Observar impacto real

### BLOCO 3: MOVENDO CARTAS
- Ensinar drag-and-drop
- Permitir `dragCard`
- Observar regras de movimento (WIP, capacidade)

### BLOCO 4: ALOCANDO PAPÉIS
- Ensinar drag-and-drop de roles
- Permitir `dragRole`
- Observar regras de capacidade e habilidades

### BLOCO 5: ESTRATÉGIA E PROGRESSÃO
- Conceitos avançados (débito técnico, dependências)
- Permitir todas as ações
- Finalização do tutorial

---

## COMANDOS ÚTEIS

### Testar Tutorial
```
Abrir tutorial.html no navegador
```

### Verificar Estado
```javascript
// Console do navegador
TutorialState.tutorialActive
TutorialState.currentStep
TutorialState.allowedActions
```

### Forçar Pular Tutorial
```javascript
// Console do navegador
Kanban.TutorialController.skip()
```

### Debug de Callbacks
```javascript
// Console do navegador
TutorialState.pendingCallbacks
```

---

## VALIDAÇÃO DA INFRAESTRUTURA

- [x] `tutorialActive = true` funciona
- [x] Hooks preservam funções originais
- [x] Filtro de ações bloqueia corretamente
- [x] UI não escurece a tela
- [x] Message box aparece no canto superior direito
- [x] Highlights funcionam sem bloquear jogo
- [x] Botão "Pular" redireciona para `index.html`
- [x] Sistema de callbacks registra e executa
- [x] Navegação entre passos funciona
- [x] Auto-start em `DOMContentLoaded` ativo

---

**Infraestrutura técnica completa.**  
**Pronto para receber conteúdo pedagógico (Blocos 1-5).**
