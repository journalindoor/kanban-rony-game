# Tutorial do RonyOffice
## Documentação Técnica e de Design

---

## Objetivo

O tutorial ensina os fundamentos do jogo através de uma experiência guiada usando **3 cards específicos** que o jogador deve manipular diretamente.

**Filosofia:** O tutorial não ensina conceitos abstratos. Ele ensina mexendo em coisas reais.

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

1. **Manual**: Jogador clica em "Próximo"
2. **Automático**: Jogador completa ação esperada (`waitFor`)

### Eventos de Espera

Os passos podem definir `waitFor` para aguardar ações específicas:

- `startTurn`: Clicar no botão "Iniciar Turno"
- `dragCard`: Mover um card entre colunas
- `dragRole`: Associar um papel a um card
- `moveCardButton`: Usar botão "Próxima coluna"

### Controle de Ações

Cada passo define `allowedActions` - array de ações permitidas naquele momento:

```javascript
allowedActions: ['startTurn', 'dragCard', 'dragRole']
```

Ações não listadas são **bloqueadas temporariamente** pelo tutorial.

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

### Filtro de Cards

O tutorial **só avança** quando ações envolvem:
- Cards com ID 9001, 9002 ou 9003

Ações em outros cards:
- ❌ Não avançam o tutorial
- ✅ Não quebram o jogo
- ⚠️ São ignoradas pelo sistema de tutorial

### Isolamento do Sistema

⚠️ **Regra de Ouro:**
- Não criar `if (card.id >= 9000)` espalhado no código base do jogo
- Todo filtro deve ficar **dentro do sistema de tutorial**
- O jogo base não sabe que o tutorial existe

---

## Restrições de Implementação

### O Que NÃO Alterar

❌ Ordem dos passos
❌ Quantidade de passos
❌ Eventos (`waitFor`)
❌ Estrutura dos objetos de passo
❌ Regras do jogo base
❌ Modo livre ou capítulos

### O Que PODE Alterar

✅ Textos (`title` e `message`)
✅ Cards do tutorial (títulos, indicadores)
✅ Sprites do Rony (`ronySprite`, `ronyFlip`)
✅ Elementos destacados (`highlight`)

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
