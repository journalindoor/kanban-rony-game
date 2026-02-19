# Tutorial do RonyOffice
## Documentação Técnica e de Design

---

## Objetivo

O tutorial ensina os fundamentos do jogo através de uma experiência guiada usando **3 cards específicos** que o jogador pode manipular livremente.

**Filosofia:** O tutorial não ensina conceitos abstratos. Ele ensina mexendo em coisas reais. **O tutorial nunca impede o jogador de jogar - é apenas um guia educativo.**

---

## Nova Arquitetura: Tutorial Não-Bloqueante

### Mudança de Paradigma (Janeiro 2026)

**ANTES:** Tutorial bloqueante
- ❌ Travava botões
- ❌ Bloqueava colunas
- ❌ Impedia movimentação de cards
- ❌ Forçava sequência obrigatória

**AGORA:** Tutorial informativo
- ✅ Apenas orienta e sugere
- ✅ Jogador pode ignorar instruções
- ✅ Todos os botões sempre funcionam
- ✅ Cards podem ser movidos livremente
- ✅ Dias podem ser avançados sem restrições

### Princípio Fundamental

> **O tutorial mostra, mas não manda.**
> 
> O jogador pode:
> - Fechar os modais
> - Ignorar as instruções
> - Fazer ações diferentes das sugeridas
> - Continuar jogando normalmente

---

## Estrutura dos Arquivos

### Arquivos Principais

1. **`tutorial.html`** - Página HTML do tutorial
2. **`data/tutorial-basic-cards.js`** - Banco de cards exclusivos do tutorial
3. **`src/tutorial.steps.js`** - Roteiro de passos pedagógicos
4. **`src/tutorial.controller.js`** - Orquestrador do fluxo do tutorial
5. **`src/tutorial.state.js`** - Gerenciador de estado
6. **`src/tutorial.ui.js`** - Interface visual (mensagens e highlights)

### Separação de Responsabilidades

- **Steps (Pedagógico)**: O QUE ensinar e COMO apresentar
- **Controller (Coordenação)**: QUANDO avançar e QUAIS hooks instalar
- **State (Dados)**: ONDE estamos no tutorial e O QUE está permitido
- **UI (Visual)**: COMO mostrar ao jogador sem bloquear a visão do jogo

---

## Cards do Tutorial

O tutorial usa **3 cards predefinidos** com IDs específicos:

### Cards Obrigatórios

```javascript
{
  "id": 9001,
  "title": "📊 Relatório urgente que ninguém pediu",
  "indicators": {
    "Refinamento": 14,
    "Fazendo": 8,
    "Homologando": 7,
    "Ajustes": 0
  },
  "isTutorialCard": true
}

{
  "id": 9002,
  "title": "🔥 Corrigir bug que só acontece na sexta",
  "indicators": {
    "Refinamento": 10,
    "Fazendo": 15,
    "Homologando": 6,
    "Ajustes": 0
  },
  "isTutorialCard": true
}

{
  "id": 9003,
  "title": "🤡 Ajustar alinhamento do botão em produção",
  "indicators": {
    "Refinamento": 15,
    "Fazendo": 11,
    "Homologando": 6,
    "Ajustes": 0
  },
  "isTutorialCard": true
}
```

### Características dos Cards

- **IDs fixos**: 9001, 9002, 9003 (faixa reservada para tutorial)
- **Títulos irônicos**: Simulam situações reais e engraçadas do dia a dia
- **Indicadores variados**: Complexidades diferentes para demonstrar diversos cenários
- **Flag especial**: `isTutorialCard: true` para identificação

### Ordem de Criação

Os cards são criados **nesta ordem específica** ao iniciar o tutorial:
1. 9001 - Relatório urgente
2. 9002 - Bug da sexta
3. 9003 - Alinhamento do botão

---

## Roteiro Pedagógico

O tutorial é dividido em **3 blocos** com foco progressivo:

### BLOCO 1: Boas-vindas e Contexto
**Objetivo:** Ambientar o jogador no jogo

- **Passo 1.1**: Mensagem de boas-vindas
- **Passo 1.2**: Visão geral do board (com Rony espelhado)
- **Passo 1.3**: Área de papéis (pessoas)
- **Passo 1.4**: Botão "Iniciar Turno"

### BLOCO 2: Backlog e Limite de WIP
**Objetivo:** Ensinar que limite vem antes de velocidade

- **Passo 2.1**: Explicação do Backlog (limite de 5)
- **Passo 2.2**: Gerar os 3 cards (evento: `startTurn`)
- **Passo 2.3**: Apresentação dos 3 cards específicos

### BLOCO 3: Papéis e Alocação
**Objetivo:** Ensinar como associar pessoas ao trabalho

- **Passo 3.1**: Conhecendo o time
- **Passo 3.2**: Talento, Felicidade e Eficiência
- **Passo 3.3**: Mover card 9001 do Backlog para Refinamento (evento: `dragCard`)
- **Passo 3.4**: Associar Analista ao card 9001 (evento: `dragRole`)
- **Passo 3.5**: Iniciar turno e observar resultados (evento: `startTurn`)

---

## Sistema de Avanço

### Tipos de Avanço

1. **Manual (Primário)**: Jogador clica em "Próximo" ou "Fechar"
2. **Tracking (Secundário)**: Sistema detecta ações para logs, mas não bloqueia

### Eventos de Espera (Apenas Informativos)

Os passos podem definir `waitFor` para **tracking** de ações sugeridas:

- `startTurn`: Detecta clique no botão "Iniciar Turno"
- `dragCard`: Detecta movimento de card entre colunas
- `dragRole`: Detecta associação de papel a card
- `moveCardButton`: Detecta uso do botão "Próxima coluna"

⚠️ **IMPORTANTE:** Estes eventos **NÃO bloqueiam** o jogo. São apenas para logs e estatísticas.

### Sistema de Permissões (Desabilitado)

O sistema de `allowedActions` está **mantido por compatibilidade** mas **não bloqueia** mais nada:

```javascript
allowedActions: ['startTurn', 'dragCard', 'dragRole']
```

- ✅ Todas as ações são sempre permitidas
- ✅ Arrays de permissões ignorados
- ✅ `isActionAllowed()` sempre retorna `true`

**Razão:** Tutorial não-bloqueante - jogador tem controle total.

---

## Interface Visual

### Princípios de Design

❌ **NÃO fazer:**
- Escurecer a tela
- Usar overlay opaco
- Bloquear visualmente o jogo

✅ **Fazer:**
- Jogo sempre totalmente visível
- Apenas highlights nos elementos relevantes
- Message box não-intrusiva

### Componentes Visuais

1. **Message Box** (`#tutorialMessageBox`)
   - Posição: Canto inferior direito
   - Contém: Título, mensagem, contador, botões
   - Personagem Rony com sprite variável

2. **Highlights** (`.tutorial-highlight`)
   - Aplicados via CSS aos elementos referenciados
   - Podem ser múltiplos elementos simultaneamente
   - Removidos automaticamente ao trocar de passo

3. **Sprite do Rony**
   - Posição controlada via `ronySprite` (ex: `'-100px 0'`)
   - Pode ser espelhado com `ronyFlip: true`
   - Usa `transform: scaleX(-1)` para espelhamento horizontal

---

## Regras de Controle (Antibugs)

### Sistema de Tracking (Não-Bloqueante)

O tutorial **detecta** ações para tracking, mas **nunca bloqueia**:
- Cards com ID 9001, 9002 ou 9003 são rastreados
- Outras ações são igualmente permitidas
- Sistema apenas registra eventos para logs

### Comportamento das Ações

✅ **Todas as ações sempre permitidas:**
- Mover qualquer card
- Associar qualquer papel
- Avançar dias
- Resetar jogo
- Publicar cards
- Arquivar cards

⚠️ **Tracking opcional:**
- Sistema registra eventos dos cards 9001-9003
- Não interfere com o fluxo do jogo
- Usado apenas para estatísticas

### Isolamento do Sistema

⚠️ **Regra de Ouro (Mantida):**
- Não criar `if (card.id >= 9000)` espalhado no código base do jogo
- Todo tracking deve ficar **dentro do sistema de tutorial**
- O jogo base não sabe que o tutorial existe
- **NOVO:** Tutorial não interfere com o jogo base

---

## Restrições de Implementação

### O Que NÃO Alterar

❌ Textos dos modais (mantém pedagogia)
❌ Ordem dos passos
❌ Estrutura dos objetos de passo
❌ Regras do jogo base
❌ Modo livre ou capítulos

### O Que PODE Alterar

✅ Sistema de bloqueio (agora desabilitado)
✅ Lógica de `isActionAllowed` (sempre true)
✅ Comportamento dos hooks (apenas tracking)
✅ Cards do tutorial (títulos, indicadores)
✅ Sprites do Rony (`ronySprite`, `ronyFlip`)
✅ Elementos destacados (`highlight`)

### Filosofia de Implementação

**Princípio:** Tutorial como camada educativa, não como camada de controle

- Tutorial **orienta** → não **controla**
- Tutorial **sugere** → não **obriga**  
- Tutorial **ensina** → não **trava**

---

## Reinicialização

### Ao Carregar `tutorial.html`

O tutorial **sempre**:
1. Reseta o estado do jogo (silenciosamente)
2. Reseta o estado do tutorial
3. Carrega os 3 cards predefinidos
4. Inicia do passo 1

### Finalização

Quando o jogador conclui o tutorial:
1. Exibe mensagem de conclusão
2. **NÃO redireciona automaticamente**
3. Jogador pode explorar livremente
4. Usa botão "Voltar ao Modo Livre" quando desejar

---

## Mensagens Atualizadas

### Tom de Escrita

- **Direto e honesto**: Sem marketing, sem enrolação
- **Pedagógico**: Ensina fazendo, não apenas falando
- **Irônico**: Reflete situações reais do desenvolvimento
- **Pessoal**: O autor fala diretamente com o jogador

### Exemplos de Mensagens

**Boas-vindas:**
> "Esse jogo nasceu do meu jeito de trabalhar e aprender.
> Nada aqui acontece por acaso.
> Cada escolha mexe no sistema."

**Apresentação dos Cards:**
> "Repara com atenção.
> Leia os títulos.
> Eles contam mais coisa do que parece."

**Instrução Específica:**
> "Comece movendo o card:
> '9001 - 📊 Relatório urgente que ninguém pediu'
> para a coluna Refinamento."

---

## Changelog Recente

### 2026-01-04: Refatoração Completa do Tutorial

**Cards:**
- ✅ Reduzido de 10 para 3 cards
- ✅ IDs fixos: 9001, 9002, 9003
- ✅ Títulos irônicos e memoráveis
- ✅ Indicadores mais realistas (14-15 em vez de 1-2)
- ✅ Flag `isTutorialCard: true` adicionada

**Roteiro:**
- ✅ Textos reescritos com tom mais direto
- ✅ Referências explícitas aos cards específicos
- ✅ Instruções mencionam números de ID
- ✅ Passo 1.2 agora espelha o Rony horizontalmente

**Sistema:**
- ✅ Suporte a `ronyFlip: true` para espelhar sprite
- ✅ Implementação limpa via parâmetro booleano
- ✅ CSS puro: `transform: scaleX(-1)`

---

## Próximos Passos (Futuro)

### Expansão do Tutorial

1. **Bloco 4**: Continuar o fluxo do card 9001
   - Mover para Fazendo
   - Associar Programador
   - Executar turnos até conclusão

2. **Bloco 5**: Homologação e Ajustes
   - Trabalhar card 9002
   - Demonstrar sistema de bugs
   - Ensinar coluna Ajustes

3. **Bloco 6**: Publicação
   - Finalizar cards
   - Ensinar arquivamento
   - Transição para modo livre

### Melhorias Técnicas

- [ ] Validação de cards específicos nos eventos
- [ ] Sistema de dicas contextuais
- [ ] Replay do tutorial
- [ ] Analytics de conclusão
