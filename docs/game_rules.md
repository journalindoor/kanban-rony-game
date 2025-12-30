# Kanban – Rony Game
## Manual de Regras do Jogo

Este documento define as regras oficiais do jogo.
Qualquer lógica implementada no código deve respeitar este manual.

---

## 1. Backlog

- O backlog deve conter **sempre no máximo 5 cards**
- Se houver 5 cards no backlog:
  - Nenhum novo card deve ser criado ao clicar em "Iniciar"
- Cards só podem nascer no Backlog

---

## 2. Cards

- Cada card possui:
  - Um identificador único
  - Dificuldades por coluna:
    - Refinamento
    - SprintBacklog
    - Fazendo
    - Homologando
    - Ajustes (nasce em 0)
- Nenhuma dificuldade pode ser negativa

---

## 3. Papéis (Team Dev)

Papéis disponíveis:
- Analista
- Programador
- QA/Tester

- Cada papel possui um **Talento Natural** sorteado ao carregar o jogo
  - Valor inteiro entre **1 e 3**
  - Permanece imutável até o jogo ser reiniciado

Regras:
- Um papel só pode estar associado a **um card por vez**
- Um card pode ter **apenas um papel associado**
- Papéis livres ficam na `.roles-area`, que está localizada dentro da barra de status (`.status-bar`) no topo da interface, à direita das métricas
- Papéis não podem ser associados a cards que estão na coluna "Backlog"
- **Cards com papéis associados são automaticamente movidos para o final da coluna** (última posição) quando o papel é atribuído

---

## 4. Eficiência dos Papéis

- Cada papel possui:
  - **Talento Natural**: Sorteado uma única vez (1 a 3) no carregamento do jogo e não muda até reiniciar
  - **Felicidade**: Valor variável de 0 até o máximo permitido (atualmente 0, mas pode ser implementado no futuro)
  - **Eficiência Máxima**: 6 (limite superior independente do talento e felicidade)
- A **eficiência atual** é calculada como:
  - `eficiência = min(6, talentoNatural + felicidade)`
- Ao iniciar o turno:
  - Um valor aleatório entre `1` e `eficiência máxima` é sorteado
  - Esse valor é subtraído da dificuldade do indicador correspondente à coluna onde o card está posicionado
  - Apenas o indicador da coluna atual é afetado (não se reduz dificuldade de outras colunas)

---

## 5. Execução do Turno (Botão Iniciar)

Ao clicar em "Iniciar":

1. **Incrementa o contador de dias** em 1
2. Verifica se pode gerar novos cards no backlog (máximo 5)
3. Aplica a lógica de eficiência nos cards com papel associado
4. Nunca reduz dificuldades de colunas incorretas
5. Nenhum indicador pode ficar negativo
6. **Arquivamento automático**: Move todos os cards da coluna "Publicado" para "Arquivados"
7. Persiste o estado atualizado (incluindo contador de dias)

---

## 6. Indicadores e Colunas


## 6.2 Regras específicas da coluna Ajustes

- Ao nascer no Backlog, o indicador de Ajustes inicia sempre em **0**.
- Ao clicar no botão "Iniciar", **durante o turno de trabalho**:
  - Se o card estiver na coluna Homologando **e** tiver um papel associado, decide-se se há ajustes necessários
  - A decisão é baseada na eficiência do papel que está homologando:
    - Eficiência 1 a 2 → 50% de chance de gerar ajustes
    - Eficiência 3 a 4 → 25% de chance de gerar ajustes
    - Eficiência 5 a 6 → 5% de chance de gerar ajustes
    - Eficiência 0 → Nenhum ajuste é gerado (permanece zero)
- Se gerar ajustes:
  - O valor de Ajustes é **> 0**, aleatório, com máximo **2 × eficiência** do papel em Homologando.
- Se não gerar ajustes:
  - O indicador de Ajustes permanece **0** e o card pode pular a coluna Ajustes (Homologando → Publicado).

---

## 6.1 Fluxo de Movimentação entre Colunas

A movimentação de cards entre colunas segue regras rígidas baseadas no estado de conclusão do trabalho.

### Regras de fluxo:

- **Backlog → Refinamento**
  - Permitido a qualquer momento

- **Refinamento → SprintBacklog**
  - Permitido somente quando o indicador de Refinamento for igual a zero

- **SprintBacklog**
  - Coluna de fila
  - Não possui indicador de dificuldade próprio

- **SprintBacklog → Fazendo**
  - Permitido somente quando o indicador de Refinamento for igual a zero

- **Fazendo → Homologando**
  - Permitido somente quando o indicador de Fazendo for igual a zero

- **Homologando → Ajustes**
  - Permitido somente quando o indicador de Homologando for igual a zero

- **Homologando → Publicado**
  - Permitido quando o indicador de Homologando for igual a zero **e** o indicador de Ajustes for igual a zero (pode pular Ajustes neste caso)

- **Ajustes → Publicado**
  - Permitido somente quando o indicador de Ajustes for igual a zero

### Regras gerais:

- Um card **não pode** avançar de coluna se a regra correspondente não for atendida
- Tentativas inválidas de movimentação não devem alterar o estado do jogo
- A interface deve refletir fielmente se a movimentação é permitida ou não

### Movimentação via botão:

- Cada card possui um botão "Próxima Coluna" que permite movê-lo para a próxima coluna válida
- O botão só funciona se as regras de transição forem atendidas
- Se as condições não forem atendidas, o card permanece na coluna atual

### Movimentação via drag-and-drop:

- Cards podem ser arrastados entre colunas
- As mesmas regras de validação se aplicam
- Tentativas de mover para colunas inválidas são bloqueadas


---

## 7. Liberação de Papéis

### 7.1 Liberação Automática

Um papel é **automaticamente removido** de um card nas seguintes situações:

#### 7.1.1 Conclusão do Trabalho na Coluna Atual

- Quando o **indicador correspondente à coluna ATUAL do card chegar a zero**:
  - Card em "Fazendo" → papel liberado quando indicador "Fazendo" = 0
  - Card em "Homologando" → papel liberado quando indicador "Homologando" = 0
  - Card em "Refinamento" → papel liberado quando indicador "Refinamento" = 0
- Quando isso acontece:
  - O papel é desassociado do card
  - O papel retorna automaticamente para a `.roles-area`
  - O estado interno do jogo é atualizado
- **Importante**: A liberação só ocorre para a coluna onde o card **está atualmente posicionado**, não para outras colunas

#### 7.1.2 Proteção contra Arquivamento

- **Antes de um card ser movido para "Arquivados"**, qualquer papel associado é automaticamente desassociado
- Objetivo: Evitar que papéis sejam "perdidos" junto com cards arquivados
- Momento da verificação: Durante o arquivamento automático ao clicar em "Iniciar Turno"
- Mesmo que o card em "Publicado" ainda tenha um papel associado (cenário improvável), o papel é liberado antes do arquivamento
- Papéis liberados retornam imediatamente para a `.roles-area` e ficam disponíveis para uso

### 7.2 Desassociação Manual

- O jogador pode **desassociar manualmente** um papel de um card a qualquer momento:
  - Um botão "×" (remover) aparece ao lado do nome do papel quando ele está associado a um card
  - Ao clicar no botão "×":
    - O papel é imediatamente desassociado do card
    - O papel retorna automaticamente para a `.roles-area`
    - O estado interno do jogo é atualizado
    - A persistência é acionada
- Regras da desassociação manual:
  - Pode ser feita em qualquer coluna
  - Não afeta os indicadores de dificuldade do card
  - Não interfere nas regras de movimentação entre colunas
  - Compatível com a liberação automática (quando indicador chega a zero)

---

## 8. Estados Visuais

### 8.1 Cards
- Card com papel associado:
  - Fundo azul claro
  - Classe CSS: `.has-role`

### 8.2 Indicadores
- Indicador com valor zero:
  - Fundo verde
  - Classe CSS: `.indicator-done`
- **Indicador ativo** (baseado na coluna atual do card):
  - Fundo vermelho claro com borda vermelha
  - Classe CSS: `.indicator-active`
  - Aplica-se ao indicador correspondente à coluna onde o card está posicionado
  - Exemplo: Card em "Fazendo" → indicador "Fazendo" fica vermelho
  - Prioridade visual: `.indicator-done` (verde) sobrepõe `.indicator-active` quando valor = 0

### 8.3 Papéis
- Cada papel exibe:
  - Nome do papel (Analista, Programador, QA/Tester)
  - **⚡ Eficiência**: Valor calculado (talentoNatural + felicidade, máximo 6)
  - **😊 Felicidade**: Valor atual
  - **🎯 Talento Natural**: Valor fixo (1-3)
- Quando um papel está associado a um card:
  - Um botão "×" (remover) aparece ao lado do nome
  - O papel tem classe CSS `.role-attached`
  - O card onde está anexado recebe classe `.has-role`

### 8.4 Regra Geral
- O estado visual deve refletir fielmente o estado lógico do jogo em todos os momentos

---

## 10. Contador de Dias

- O jogo mantém um contador de dias que:
  - Inicia em 0 quando o jogo é carregado pela primeira vez
  - É incrementado em 1 a cada clique no botão "Iniciar Turno"
  - É exibido na interface na seção `.status-metrics`
  - É persistido junto com o estado do jogo
  - É resetado para 0 quando o jogador clica em "Reiniciar"

---

## 11. Arquivamento Automático

- Ao final de cada turno (após clicar "Iniciar"):
  - Todos os cards na coluna "Publicado" são **automaticamente movidos** para a coluna "Arquivados"
  - A coluna "Arquivados" fica oculta por padrão
  - O jogador pode visualizar cards arquivados clicando no botão "Arquivados"
  - Cards arquivados não participam mais do fluxo do jogo

---

## 12. Persistência

- O estado salvo contém:
  - Cards em todas as colunas (incluindo Arquivados)
  - Indicadores de dificuldade de cada card
  - Papéis associados aos cards
  - Contador de ID para geração de novos cards
  - Contador de dias
  - Dinheiro acumulado
  - Status de pagamento de cada card (paid flag)
  - Dados dos modelos de papéis (talento natural e felicidade)
- Recarregar a página restaura o estado salvo
- Reiniciar o jogo apaga o estado salvo e gera novos talentos naturais para os papéis

---

## 13. Sistema Monetário

### 13.1 Contador de Dinheiro

- O jogador possui um contador de dinheiro exibido na barra de status (`.status-metrics`)
- Valor inicial: $0
- O dinheiro é persistido junto com o estado do jogo
- É resetado para $0 quando o jogador clica em "Reiniciar"

### 13.2 Valor dos Cards

- Cada card possui um valor monetário fixo calculado na sua criação
- O valor é baseado na **complexidade total** do card (soma dos 3 indicadores principais)
- Complexidade = Refinamento + Fazendo + Homologando
- O indicador "Ajustes" NÃO é incluído no cálculo da complexidade

### 13.3 Faixas de Pagamento

O sistema usa faixas (tiers) de complexidade para determinar o valor do card:

| Complexidade Total | Valor do Card |
|-------------------|---------------|
| 3 a 12            | $10          |
| 13 a 24           | $25          |
| 25 a 36           | $50          |
| 37 a 54           | $100         |

### 13.4 Pagamento ao Arquivar

- O valor de um card é pago **UMA ÚNICA VEZ** quando o card é arquivado
- Momento do pagamento: Quando o card sai de "Publicado" e entra em "Arquivados"
- Cada card possui uma flag interna (`data-paid`) que controla se já foi pago
- Garantias do sistema:
  - ❌ Cards já arquivados não geram valor recorrente
  - ❌ Re-renderizações não duplicam pagamento
  - ❌ Movimento manual não aciona pagamento
  - ✅ Apenas a transição Publicado → Arquivado paga
  - ✅ Flag permanente impede qualquer duplicação

### 13.5 Feedback Visual

- Quando um card é pago, o valor é **imediatamente somado** ao contador de dinheiro
- Aparece uma animação de incremento visual no contador
- O sistema usa um contador animado que incrementa gradualmente do valor antigo para o novo
- A animação ocorre em passos rápidos (20ms por incremento) para dar feedback visual ao jogador
- Durante a animação, uma flag `moneyAnimationActive` impede que múltiplas animações ocorram simultaneamente

---

## 15. Sistema de Banco de Cards

### 15.1 Cards Pré-definidos

- O jogo utiliza **bancos de cards pré-definidos** armazenados em arquivos JavaScript
- Localização: `/data/`
- Formato: Objetos JavaScript atribuídos a `window.NOME_DO_BANCO`
- Bancos disponíveis:
  - **Tutorial**: `window.TUTORIAL_BASIC_CARDS` (arquivo: `tutorial-basic-cards.js`)
  - **Capítulo 1**: `window.CHAPTER_1_CARDS` (arquivo: `chapter-1-cards.js`)
  - Capítulos 2-5: A serem implementados

### 15.2 Estrutura dos Cards do Banco

Cada card no banco possui:
- **id**: Identificador único no formato:
  - Tutorial: `tut-01`, `tut-02`, etc.
  - Capítulos: `c1-01`, `c2-01`, etc.
- **title**: Nome descritivo do card
- **indicators**: Objeto com os valores de Refinamento, Fazendo, Homologando e Ajustes

### 15.3 Prioridade de Geração

Quando o backlog precisa ser preenchido:
1. **Primeiro**: Até 3 cards são selecionados do banco de dados (se disponíveis)
2. **Depois**: O restante é preenchido com cards aleatórios até completar 5

### 15.4 Sistema de Cards Usados

- Cada card do banco **só pode ser usado uma única vez**
- Quando um card entra no Backlog, seu ID é registrado no localStorage
- Chave de armazenamento: `[storageKey]_usedCards`
  - Exemplo: `kanbanState_chapter1_usedCards`
- Cards já usados são **permanentemente excluídos** da lista de cards disponíveis
- Este controle é independente por modo de jogo:
  - Tutorial tem sua própria lista de usados
  - Cada capítulo tem sua própria lista de usados
  - Modo livre não usa banco de cards

### 15.5 Detecção de Contexto

O sistema detecta automaticamente qual banco usar baseado no arquivo HTML:
- `tutorial.html` → `TUTORIAL_BASIC_CARDS`
- `chapter1.html` → `CHAPTER_1_CARDS`
- `chapter2.html` → `CHAPTER_2_CARDS` (quando implementado)
- `index.html` (modo livre) → Nenhum banco, apenas cards aleatórios

### 15.6 Importação nos HTMLs

- Cada página importa seu banco de dados específico antes do `cardBankManager.js`
- Ordem de importação:
  1. `src/storage.js`
  2. `data/[banco-especifico].js` (ex: `chapter-1-cards.js`)
  3. `src/cardBankManager.js`
  4. Demais scripts do jogo

---

## 16. Sistema de Capítulos

### 16.1 Estrutura de Capítulos

O jogo possui 5 capítulos sequenciais:
- Cada capítulo tem suas próprias metas e desafios
- Cada capítulo mantém estado separado no localStorage
- Nomenclatura dos arquivos: `chapter1.html`, `chapter2.html`, etc.

### 16.2 Configuração do Capítulo 1

- **Nome**: "Sobreviva à Sprint"
- **Meta principal**: Acumular $500
- **Acesso ao próximo capítulo**: Habilitado ao atingir a meta

### 16.3 Botão de Progressão

- Cada capítulo exibe um botão "Capítulo X" na barra superior
- Estados do botão:
  - **Desabilitado** (cinza): Meta não atingida
  - **Habilitado** (ativo): Meta atingida, pode avançar
- O botão está sempre visível, mas apenas clicável quando a meta for concluída

### 16.4 Transferência de Estado

Quando o jogador avança para o próximo capítulo:
- O estado final do capítulo atual é salvo
- Personagens desbloqueados são transferidos
- Dinheiro acumulado é transferido
- Papéis com seus atributos são transferidos
- Cards em andamento NÃO são transferidos (capítulo começa limpo)

### 16.5 Verificação de Metas

- A verificação da meta ocorre:
  - Após cada arquivamento de card (quando dinheiro é adicionado)
  - Ao carregar o jogo (se já tinha atingido anteriormente)
- Quando a meta é atingida:
  - Botão do próximo capítulo é habilitado automaticamente
  - Uma notificação visual indica a conquista

---

## 17. Sistema de Tutorial

### 17.1 Estrutura do Tutorial

- Página dedicada: `tutorial.html`
- Sistema de overlay que cobre a interface do jogo
- Guia passo-a-passo interativo
- Destaque visual de elementos específicos

### 17.2 Componentes do Tutorial

- **Overlay**: Camada semi-transparente que cobre toda a tela
- **Message Box**: Caixa de mensagem flutuante com instruções
- **Highlight**: Contorno que destaca elementos específicos da UI
- **Botões de navegação**: "Próximo", "Anterior", "Pular Tutorial"

### 17.3 Modal de Boas-Vindas

- Aparece automaticamente na primeira visita ao jogo (`index.html`)
- Pergunta se o jogador deseja fazer o tutorial
- Controle de exibição via localStorage: `kanban_welcome_seen`
- Opções:
  - **Fazer Tutorial**: Redireciona para `tutorial.html`
  - **Pular**: Fecha o modal e inicia no modo livre

### 17.4 Acesso ao Tutorial

- Botão "Tutorial" disponível na barra superior de todas as páginas
- Cor roxa (#8b5cf6) para diferenciação visual
- Permite revisitar o tutorial a qualquer momento
- Botão de retorno em `tutorial.html` para voltar ao modo livre

### 17.5 Gerenciamento de Ações

Durante o tutorial:
- Ações do jogo podem ser desabilitadas seletivamente
- Classe `.tutorial-disabled` aplicada a elementos bloqueados
- Efeito visual: opacidade reduzida + grayscale
- `pointer-events: none` impede interação

---

## 14. Sistema de Escritório (Office Panel)

### 14.1 Grid de Videochamada

- O painel de escritório exibe um grid 3×3 com 9 áreas de videochamada
- Organização por tipo de papel:
  - Linha 1: 3 Analistas (analista-1, analista-2, analista-3)
  - Linha 2: 3 Programadores (programador-1, programador-2, programador-3)
  - Linha 3: 3 QAs (qa-1, qa-2, qa-3)

### 14.2 Composição Visual dos Personagens

Cada área de videochamada usa um sistema de camadas (layers):

1. **Camada inferior (character-body)**: Sprite do personagem
   - Varia conforme o status (idle/working)
   - Exemplo: `programador1-idle.gif`, `programador1-working.gif`

2. **Camada superior (character-computer)**: Computador
   - Sempre visível acima do personagem
   - Sprite: `computador1.png`

### 14.3 Sistema de Status

- Cada personagem possui um status atual: `idle` ou `working`
- Status inicial: `idle`
- Mudanças de status:
  - `idle` → `working`: Quando um papel é associado a um card
  - `working` → `idle`: Quando o papel é desassociado do card

### 14.4 Mapeamento Role → Character

- Cada papel da `.roles-area` está mapeado para um personagem específico:
  - "Analista" → `analista-1`
  - "Programador" → `programador-1`
  - "QA/Tester" → `qa-1`
- Quando um papel é arrastado para um card, o personagem correspondente muda para status `working`
- Quando o papel é removido (manual ou automaticamente), o personagem volta para `idle`

### 14.5 Sistema de Desbloqueio

- Estado inicial do jogo:
  - 3 personagens desbloqueados: `analista-1`, `programador-1`, `qa-1`
  - 6 personagens bloqueados: todos os demais
- Personagens desbloqueados:
  - Exibem sprites normalmente (personagem + computador)
  - Respondem a mudanças de status
- Personagens bloqueados:
  - Exibem apenas sprite `offline.png` com opacidade reduzida
  - Não respondem a mudanças de status
- Os 9 slots estão sempre visíveis no grid (layout fixo)

### 14.6 Sprites e Assets

- Todos os sprites são renderizados com `image-rendering: pixelated` para manter estilo pixel art
- Assets organizados na pasta `/assets`
- Nomenclatura dos sprites:
  - Personagens: `[tipo][numero]-[status].gif` (ex: `programador1-idle.gif`)
  - Computador: `computador1.png`
  - Offline: `offline.png`

---
