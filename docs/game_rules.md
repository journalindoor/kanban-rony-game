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

- Um papel é **automaticamente removido** de um card quando:
  - **O indicador correspondente à coluna ATUAL do card chegar a zero**
  - Ou seja, se o card está em "Fazendo", o papel é liberado quando o indicador "Fazendo" chega a 0
  - Se o card está em "Homologando", o papel é liberado quando o indicador "Homologando" chega a 0
- Quando isso acontece:
  - O papel é desassociado do card
  - O papel retorna automaticamente para a `.roles-area`
  - O estado interno do jogo é atualizado
- **Importante**: A liberação automática só ocorre para a coluna onde o card **está atualmente posicionado**, não para outras colunas cujos indicadores podem ter chegado a zero anteriormente

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
  - Dados dos modelos de papéis (talento natural e felicidade)
- Recarregar a página restaura o estado salvo
- Reiniciar o jogo apaga o estado salvo e gera novos talentos naturais para os papéis
