# GUIA: COMO ADICIONAR CONTEÚDO PEDAGÓGICO

**Infraestrutura Técnica:** ✅ Completa  
**Próximo passo:** Adicionar passos ao tutorial

---

## ESTRUTURA DE UM PASSO

```javascript
{
  title: 'Título do Passo',
  message: '<p>Conteúdo em HTML</p>',
  highlight: '#seletorCSS',
  allowedActions: ['acao1', 'acao2'],
  onEnter: function() {
    // Executado AO ENTRAR neste passo
  },
  onExit: function() {
    // Executado AO SAIR deste passo
  },
  waitFor: 'nomeEvento' // opcional
}
```

---

## CAMPOS EXPLICADOS

### `title` (obrigatório)
**Tipo:** String  
**Descrição:** Título exibido no cabeçalho da message box

**Exemplo:**
```javascript
title: 'Bem-vindo ao Kanban Rony Game'
```

---

### `message` (obrigatório)
**Tipo:** String (HTML)  
**Descrição:** Conteúdo da mensagem. Pode usar HTML.

**Exemplo:**
```javascript
message: `
  <p>Este jogo é sobre <strong>decisões</strong>.</p>
  <p>Suas escolhas têm <strong>consequência</strong>.</p>
  <ul>
    <li>Gerencie pessoas</li>
    <li>Entregue valor</li>
    <li>Não destrua o time</li>
  </ul>
`
```

**Dica:** Use template literals (\`...\`) para múltiplas linhas.

---

### `highlight` (opcional)
**Tipo:** String (seletor CSS) ou `null`  
**Descrição:** Elemento do jogo a destacar. Se `null`, nenhum destaque.

**Exemplos:**
```javascript
highlight: '#startButton'           // Destaca botão "Iniciar Turno"
highlight: '#kanbanBoard'           // Destaca o board inteiro
highlight: '.column[data-col="Backlog"]'  // Destaca coluna Backlog
highlight: null                     // Sem destaque
```

**Seletores úteis:**
- `#startButton` — Botão "Iniciar Turno"
- `#resetButton` — Botão "Reiniciar"
- `#toggleArchivedButton` — Botão "Arquivados"
- `#kanbanBoard` — Board completo
- `.column[data-col="Backlog"]` — Coluna específica
- `.kanban-card` — Primeira carta (ou use ID específico)
- `#rolesArea` — Área de papéis

---

### `allowedActions` (obrigatório)
**Tipo:** Array de strings  
**Descrição:** Ações que o jogador PODE fazer neste passo.

**Ações disponíveis:**
- `'startTurn'` — Iniciar turno
- `'resetGame'` — Reiniciar jogo
- `'toggleArchived'` — Ver arquivados
- `'dragCard'` — Arrastar carta
- `'dragRole'` — Arrastar papel
- `'moveCardButton'` — Botões de mover carta
- `'removeRole'` — Remover papel de carta

**Exemplos:**
```javascript
allowedActions: []  // Nada permitido (apenas leitura)
allowedActions: ['startTurn']  // Apenas iniciar turno
allowedActions: ['dragCard', 'dragRole']  // Arrastar cartas e papéis
allowedActions: ['startTurn', 'resetGame', 'toggleArchived', 'dragCard', 'dragRole', 'moveCardButton', 'removeRole']  // Tudo
```

---

### `onEnter` (opcional)
**Tipo:** Function ou `null`  
**Descrição:** Função executada quando o passo é exibido.

**Exemplo:**
```javascript
onEnter: function() {
  console.log('Entrou no passo 1');
  // Lógica customizada
}
```

**Casos de uso:**
- Resetar estado do jogo
- Carregar cartas específicas
- Configurar estado inicial

---

### `onExit` (opcional)
**Tipo:** Function ou `null`  
**Descrição:** Função executada quando o jogador SAI do passo.

**Exemplo:**
```javascript
onExit: function() {
  console.log('Saiu do passo 1');
  K.TutorialUI.clearHighlight();
}
```

**Casos de uso:**
- Limpar highlights
- Salvar progresso
- Preparar próximo passo

---

### `waitFor` (opcional)
**Tipo:** String ou `null`  
**Descrição:** Nome do evento que deve ocorrer para avançar automaticamente.

**Eventos disponíveis:**
- `'startTurn'` — Espera jogador iniciar turno
- `'dragCard'` — Espera jogador arrastar carta
- `'dragRole'` — Espera jogador arrastar papel
- `'moveCardButton'` — Espera jogador clicar em botão de mover
- `'removeRole'` — Espera jogador remover papel

**Exemplo:**
```javascript
{
  title: 'Inicie seu Primeiro Turno',
  message: '<p>Clique em "Iniciar Turno" para começar.</p>',
  highlight: '#startButton',
  allowedActions: ['startTurn'],
  waitFor: 'startTurn'  // Avança automaticamente quando jogador clicar
}
```

**Fluxo:**
1. Jogador clica "Iniciar Turno"
2. Hook executa função original
3. Hook chama `executeCallback('startTurn')`
4. Tutorial avança automaticamente para próximo passo

---

## EXEMPLO COMPLETO: BLOCO 1 (Boas-vindas)

```javascript
K.TutorialSteps = [
  // Passo 1: Boas-vindas
  {
    title: 'Kanban Rony Game',
    message: `
      <p>Este não é um jogo sobre cartas e pontos.</p>
      <p>É sobre <strong>decisões</strong>.</p>
      <p>Decisões têm <strong>consequência</strong>.</p>
    `,
    highlight: null,
    allowedActions: [],
    onEnter: null,
    onExit: null,
    waitFor: null
  },

  // Passo 2: Premissa
  {
    title: 'A Premissa',
    message: `
      <p>Você controla <strong>pessoas</strong>.</p>
      <p>Elas têm limites. Elas podem falhar.</p>
      <p>Seu objetivo é <strong>entregar valor</strong> sem destruir o time.</p>
    `,
    highlight: null,
    allowedActions: [],
    onEnter: null,
    onExit: null,
    waitFor: null
  },

  // Passo 3: Elementos do Jogo
  {
    title: 'O Board Kanban',
    message: `
      <p>Este é o seu <strong>Kanban Board</strong>.</p>
      <p>Aqui você gerencia o fluxo de trabalho:</p>
      <ul>
        <li><strong>Backlog</strong>: Trabalho a fazer</li>
        <li><strong>Refinamento</strong>: Análise</li>
        <li><strong>Sprint Backlog</strong>: Priorizado</li>
        <li><strong>Desenvolvimento</strong>: Em andamento</li>
        <li><strong>Teste</strong>: Validação</li>
        <li><strong>Done</strong>: Concluído</li>
      </ul>
    `,
    highlight: '#kanbanBoard',
    allowedActions: [],
    onEnter: function() {
      K.TutorialUI.highlightElement('#kanbanBoard');
    },
    onExit: function() {
      K.TutorialUI.clearHighlight();
    },
    waitFor: null
  },

  // Passo 4: Papéis
  {
    title: 'Os Papéis (Pessoas)',
    message: `
      <p>Estes são seus <strong>papéis</strong> (pessoas do time):</p>
      <ul>
        <li><strong>Analistas</strong> (Azul): Refinam requisitos</li>
        <li><strong>Programadores</strong> (Verde): Desenvolvem features</li>
        <li><strong>QAs</strong> (Amarelo): Testam e validam</li>
      </ul>
      <p>Cada papel tem <strong>capacidade limitada</strong>.</p>
    `,
    highlight: '#rolesArea',
    allowedActions: [],
    onEnter: function() {
      K.TutorialUI.highlightElement('#rolesArea');
    },
    onExit: function() {
      K.TutorialUI.clearHighlight();
    },
    waitFor: null
  },

  // Passo 5: Turnos
  {
    title: 'Como Funciona',
    message: `
      <p>O jogo avança em <strong>turnos</strong>.</p>
      <p>Cada turno você:</p>
      <ol>
        <li>Aloca papéis nas cartas</li>
        <li>Move cartas entre colunas</li>
        <li>Clica em <strong>"Iniciar Turno"</strong></li>
      </ol>
      <p>O sistema calcula os resultados e te mostra as consequências.</p>
    `,
    highlight: '#startButton',
    allowedActions: [],
    onEnter: function() {
      K.TutorialUI.highlightElement('#startButton');
    },
    onExit: function() {
      K.TutorialUI.clearHighlight();
    },
    waitFor: null
  },

  // Passo 6: Vamos Começar
  {
    title: 'Preparado?',
    message: `
      <p>Agora você vai aprender <strong>fazendo</strong>.</p>
      <p>O tutorial vai te guiar passo a passo.</p>
      <p>Clique em <strong>"Próximo"</strong> quando estiver pronto.</p>
    `,
    highlight: null,
    allowedActions: [],
    onEnter: null,
    onExit: null,
    waitFor: null
  }
];
```

---

## PADRÕES RECOMENDADOS

### ✅ BOM: Passos incrementais
```javascript
// Passo N: Apenas explica
{ allowedActions: [] }

// Passo N+1: Permite ação
{ allowedActions: ['startTurn'], waitFor: 'startTurn' }

// Passo N+2: Reage ao resultado
{ allowedActions: [] }
```

### ❌ MAU: Permitir tudo de uma vez
```javascript
// Confuso para o jogador
{ allowedActions: ['dragCard', 'dragRole', 'startTurn', 'resetGame'] }
```

### ✅ BOM: Mensagens diretas
```javascript
message: '<p>Clique em "Iniciar Turno".</p>'
```

### ❌ MAU: Mensagens vagas
```javascript
message: '<p>Agora você pode fazer algo.</p>'
```

### ✅ BOM: Usar `waitFor` para interatividade
```javascript
{
  message: '<p>Arraste uma carta para a coluna Doing.</p>',
  allowedActions: ['dragCard'],
  waitFor: 'dragCard'  // Avança automaticamente
}
```

### ❌ MAU: Jogador precisa clicar "Próximo" após ação
```javascript
{
  message: '<p>Arraste uma carta e depois clique em Próximo.</p>',
  allowedActions: ['dragCard'],
  waitFor: null  // Jogador faz ação mas precisa clicar Próximo = redundante
}
```

---

## DICAS DE DESIGN PEDAGÓGICO

### 1. **Contextualização primeiro, ação depois**
Explique o "porquê" antes do "como".

```javascript
// Passo 1: Contexto
{ message: '<p>Cartas representam trabalho real.</p>' }

// Passo 2: Ação
{ message: '<p>Arraste uma carta.</p>', allowedActions: ['dragCard'] }
```

### 2. **Um conceito por vez**
Não ensine 3 regras no mesmo passo.

```javascript
// ❌ MAU
{ message: '<p>Arraste cartas, aloque papéis e inicie turnos.</p>' }

// ✅ BOM (3 passos separados)
{ message: '<p>Arraste cartas entre colunas.</p>' }
{ message: '<p>Aloque papéis nas cartas.</p>' }
{ message: '<p>Clique em "Iniciar Turno".</p>' }
```

### 3. **Use `waitFor` para interatividade**
Sempre que possível, faça o jogador FAZER algo.

```javascript
{
  title: 'Seu Primeiro Turno',
  message: '<p>Clique em "Iniciar Turno".</p>',
  allowedActions: ['startTurn'],
  waitFor: 'startTurn'  // Interativo, não passivo
}
```

### 4. **Destaque elementos com `highlight`**
Guie o olhar do jogador.

```javascript
{
  message: '<p>Esta é a coluna Backlog.</p>',
  highlight: '.column[data-col="Backlog"]'
}
```

### 5. **Tom consistente**
Mantenha o tom sério, direto e consequencial.

```javascript
// ✅ BOM
message: '<p>Decisões têm consequência.</p>'

// ❌ EVITAR
message: '<p>Yay! Vamos nos divertir! 🎉</p>'
```

---

## COMO ADICIONAR SEU CONTEÚDO

### Passo 1: Abrir `tutorial.steps.js`
```
src/tutorial.steps.js
```

### Passo 2: Substituir array vazio
```javascript
K.TutorialSteps = [
  // Cole seus passos aqui
];
```

### Passo 3: Testar no navegador
```
Abrir tutorial.html
```

### Passo 4: Debugar (se necessário)
```javascript
// Console do navegador
TutorialState.currentStep
TutorialState.allowedActions
```

---

## CHECKLIST DE VALIDAÇÃO

Antes de considerar um bloco completo:

- [ ] Cada passo tem `title` e `message`
- [ ] `allowedActions` está definido (mesmo que vazio)
- [ ] Highlights são usados quando faz sentido
- [ ] `waitFor` é usado para ações interativas
- [ ] Navegação entre passos funciona
- [ ] Não há erros no console
- [ ] Jogador consegue completar sem travar

---

## ESTRUTURA DOS BLOCOS

### BLOCO 1: BOAS-VINDAS E CONTEXTO ✅ (pronto para implementar)
- **Objetivo:** Ambientar o jogador
- **Tom:** Sério, direto
- **Ações permitidas:** Nenhuma (apenas leitura)
- **Passos:** 6

### BLOCO 2: PRIMEIRO TURNO
- **Objetivo:** Ensinar mecânica de turnos
- **Passos sugeridos:**
  1. "Observe o estado inicial"
  2. "Clique em Iniciar Turno" (`waitFor: 'startTurn'`)
  3. "Veja o que aconteceu"

### BLOCO 3: MOVENDO CARTAS
- **Objetivo:** Ensinar drag-and-drop de cartas
- **Passos sugeridos:**
  1. "Cartas representam trabalho"
  2. "Arraste uma carta do Backlog para Refinamento" (`waitFor: 'dragCard'`)
  3. "Observe as regras de movimento"

### BLOCO 4: ALOCANDO PAPÉIS
- **Objetivo:** Ensinar alocação de pessoas
- **Passos sugeridos:**
  1. "Papéis executam trabalho"
  2. "Arraste um Analista para uma carta" (`waitFor: 'dragRole'`)
  3. "Veja a capacidade diminuir"

### BLOCO 5: ESTRATÉGIA E FINALIZAÇÃO
- **Objetivo:** Conceitos avançados
- **Passos sugeridos:**
  1. "Débito técnico acumula"
  2. "Dependências bloqueiam cartas"
  3. "Você está pronto para jogar livremente"

---

**Infraestrutura pronta. Adicione seu conteúdo pedagógico em `tutorial.steps.js`.**
