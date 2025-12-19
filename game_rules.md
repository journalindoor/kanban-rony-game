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
- Papéis livres ficam na `.roles-area`

---

## 4. Eficiência dos Papéis

- Cada papel possui:
  - Talento
  - Disposição
- A eficiência máxima é definida por esses atributos
  - Talento é sorteado uma única vez (1 a 3) no carregamento do jogo e não muda até reiniciar
- Ao iniciar o turno:
  - Um valor aleatório entre `1` e `eficiência máxima` é sorteado
  - Esse valor é subtraído da dificuldade correta

---

## 5. Execução do Turno (Botão Iniciar)

Ao clicar em "Iniciar":

1. Verifica se pode gerar novos cards no backlog
2. Aplica a lógica de eficiência nos cards com papel associado
3. Nunca reduz dificuldades de colunas incorretas
4. Nenhum indicador pode ficar negativo

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


---

## 7. Liberação de Papéis

- Um papel só deve ser removido de um card quando:
  - O card estiver em uma coluna específica
  - **O indicador daquela coluna chegar a zero**
- Quando isso acontece:
  - O papel é desassociado do card
  - O papel retorna automaticamente para a `.roles-area`
  - O estado interno do jogo é atualizado

---

## 8. Estados Visuais

- Card com papel associado:
  - Fundo azul claro
- Indicador com valor zero:
  - Fundo verde
- O estado visual deve refletir fielmente o estado lógico

---

## 9. Persistência (se aplicável)

- O estado salvo deve conter:
  - Cards
  - Colunas
  - Indicadores
  - Papéis associados e livres
- Recarregar a página não pode gerar estados inválidos
