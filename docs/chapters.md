# Kanban Rony Game — Estrutura de Capítulos
## Documento de Design Narrativo e Pedagógico

---

## Propósito deste Documento

Este arquivo documenta a estrutura narrativa e pedagógica dos capítulos do **Kanban Rony Game**. Serve como registro de design e referência para implementação futura.

**Importante:**
- Os capítulos descritos aqui **ainda não foram implementados**
- Cada capítulo será futuramente implementado como um arquivo `.html` independente
- O layout atual do jogo será ajustado antes da implementação real dos capítulos
- Este documento descreve conceitos, não detalhes técnicos de implementação

---

## Visão Geral da Progressão

O jogo é estruturado em **5 capítulos progressivos** que ensinam conceitos de Kanban e gestão de fluxo através de experiência prática.

### Abordagem Pedagógica

**Capítulos 1-2: Aprendizado Implícito**
- O jogador vivencia problemas reais sem conceitos teóricos explícitos
- Gargalos, limites e fluxo são descobertos através da experiência
- A frustração e o sucesso ensinam antes da teoria

**Capítulos 3-5: Aprendizado Intencional**
- Conceitos são apresentados explicitamente
- Métricas são introduzidas progressivamente
- O jogador aplica conhecimento teórico em cenários práticos

### Herança de Estado entre Capítulos

Todos os capítulos compartilham e herdam dados do capítulo anterior:

- **Dias passados**: Contador acumulado ao longo de todos os capítulos
- **Composição do Team Dev**: Papéis e integrantes contratados permanecem
- **Valor acumulado**: Dinheiro ganho com entregas que pode ser usado para contratar

**Exceção:** Ao iniciar um novo jogo, o jogador sempre começa do Capítulo 1 com estado zerado.

---

## Capítulo 1 — "Sobreviva à Sprint"

### Conceito

Primeiro contato do jogador com o sistema Kanban. Uma experiência pura de descoberta através do jogo livre, sem interferências ou orientações explícitas.

### Configuração Inicial

- **Team Dev**: 3 integrantes (1 Analista, 1 Programador, 1 QA/Tester)
- **Métricas visíveis**: Apenas contador de dias
- **Métricas ocultas**: Cycle time, throughput, WIP (ainda não são mostrados)
- **Mecânicas disponíveis**: Movimentação de cards, associação de papéis, execução de turnos

### Duração e Objetivo

- **Duração**: Exatamente 10 dias (1 sprint completa)
- **Objetivo principal**: Entregar o máximo de cards possível
- **Critério de conclusão**: Ao final do 10º dia, o capítulo termina automaticamente

### Recompensa

- O jogador **acumula valor** (dinheiro) baseado nos cards publicados
- Fórmula de recompensa será definida durante a implementação
- O valor acumulado será usado no Capítulo 2 para contratar novos integrantes

### Aprendizado Implícito

Através da experiência prática, o jogador descobre:

- **Gargalos naturais**: Onde o trabalho se acumula no fluxo
- **Limites do time**: O que 3 pessoas conseguem fazer em 10 dias
- **Impacto dos ajustes**: Como retrabalho afeta a capacidade de entrega
- **Importância do fluxo**: Movimentar cards vs. finalizar trabalho
- **Papel da homologação**: Como QA afeta a qualidade e ritmo

### Narrativa

> "Você tem 10 dias para provar seu valor. Uma equipe pequena, muitas tarefas, e o relógio correndo. Faça o melhor que puder."

---

## Capítulo 2 — "Mais gente resolve?"

### Conceito

Expansão do time através de contratação. O jogador experimenta a complexidade de escalar uma equipe e descobre que mais pessoas nem sempre significam mais velocidade.

### Configuração Inicial

- **Team Dev**: Continua do Capítulo 1 (3 integrantes)
- **Valor inicial**: O dinheiro acumulado no Capítulo 1
- **Nova mecânica**: **Contratação de novos integrantes**
- **Métricas visíveis**: Contador de dias, valor disponível

### Duração e Objetivo

- **Duração**: Sem limite de dias (jogo livre)
- **Objetivo principal**: Expandir o team dev até **6 integrantes** (2 por cargo)
  - 2 Analistas
  - 2 Programadores
  - 2 QA/Testers
- **Critério de conclusão**: Quando o jogador tiver contratado todos os 3 integrantes adicionais

### Mecânica de Contratação

- O jogador pode contratar **+1 integrante por cargo**
- Cada contratação custa um valor fixo (a ser definido)
- Contratações usam o valor acumulado (cards publicados geram dinheiro)
- O jogador decide **quando** e **quem** contratar primeiro

### Recompensa

- Team dev completo (6 integrantes)
- Preparação para os desafios dos capítulos seguintes
- Valor restante é mantido para futuras mecânicas (se houver)

### Aprendizado Implícito

Através da experiência prática, o jogador descobre:

- **Mais pessoas ≠ mais velocidade**: Coordenação e gargalos afetam o fluxo
- **Balanceamento de cargos**: Contratar quem primeiro faz diferença
- **Custo vs. benefício**: Investir recursos exige planejamento
- **Capacidade vs. fluxo**: Ter mais pessoas não resolve todos os problemas

### Narrativa

> "Agora você tem recursos. Mais analistas? Mais programadores? Mais testers? Escolha bem. Às vezes, o problema não é a falta de gente... é o que você faz com ela."

---

## Capítulo 3 — "Cycle Time: quanto tempo dói"

### Conceito

Primeiro capítulo de **aprendizado intencional**. O jogador é apresentado explicitamente ao conceito de **Cycle Time** e aprende a medir o tempo que um card leva do início ao fim.

### Configuração Inicial

- **Team Dev**: 6 integrantes (completo do Capítulo 2)
- **Nova métrica introduzida**: **Cycle Time**
  - Definição mostrada na interface
  - Visualização do tempo de cada card
  - Cálculo do cycle time médio
- **Métricas visíveis**: Dias passados, cycle time por card, cycle time médio

### Duração e Objetivo

- **Duração**: Período definido (a ser especificado durante implementação)
- **Objetivo principal**: Publicar um número mínimo de cards mantendo o **cycle time médio abaixo de um limite**
- **Critério de conclusão**: Meta de entregas com cycle time controlado

### Conceito Ensinado: Cycle Time

**Definição apresentada ao jogador:**
> "Cycle Time é o tempo que um card leva desde que começa a ser trabalhado até ser publicado. Quanto menor, mais rápido você entrega valor."

**Aprendizado:**
- Medir tempo de trabalho, não tempo de espera
- Identificar cards que ficam muito tempo em uma coluna
- Entender que velocidade individual ≠ velocidade do sistema
- Ajustes e retrabalho aumentam cycle time drasticamente

### Narrativa

> "Entregar é importante. Mas entregar rápido é melhor. Descubra quanto tempo seus cards levam para atravessar o fluxo... e tente melhorar isso."

---

## Capítulo 4 — "Throughput: constância importa"

### Conceito

Segundo capítulo de aprendizado intencional. O jogador é apresentado explicitamente ao conceito de **Throughput** e aprende que ritmo sustentável é mais valioso que picos de entrega.

### Configuração Inicial

- **Team Dev**: 6 integrantes (continua do Capítulo 3)
- **Nova métrica introduzida**: **Throughput**
  - Definição mostrada na interface
  - Visualização de cards publicados por período
  - Gráfico de tendência ao longo do tempo
- **Métricas visíveis**: Dias passados, cycle time, throughput por período

### Duração e Objetivo

- **Duração**: Período contínuo (a ser especificado durante implementação)
- **Objetivo principal**: Manter um **throughput estável** ao longo do tempo
  - Evitar picos seguidos de quedas
  - Demonstrar consistência em entregas
- **Critério de conclusão**: Atingir throughput médio mínimo com baixa variação

### Conceito Ensinado: Throughput

**Definição apresentada ao jogador:**
> "Throughput é a quantidade de cards que você publica por unidade de tempo. Não importa fazer 20 entregas em um dia e zero nos próximos cinco. O que importa é ritmo constante."

**Aprendizado:**
- Previsibilidade é mais valiosa que velocidade explosiva
- Fluxo contínuo > trabalho em rajadas
- Planejamento sustentável evita burnout e retrabalho
- Variação alta indica problemas no sistema

### Narrativa

> "Velocidade impressiona. Constância constrói confiança. Mostre que seu time pode entregar de forma previsível, sprint após sprint."

---

## Capítulo 5 — "WIP: o inimigo invisível"

### Conceito

Capítulo final de aprendizado intencional. O jogador é apresentado explicitamente ao conceito de **WIP (Work In Progress)** e descobre que trabalho em excesso paralisa o fluxo.

### Configuração Inicial

- **Team Dev**: 6 integrantes (continua do Capítulo 4)
- **Nova métrica introduzida**: **WIP (Work In Progress)**
  - Definição mostrada na interface
  - Contador visual de cards em andamento
  - Penalidades progressivas por excesso de WIP
- **Métricas visíveis**: Dias passados, cycle time, throughput, WIP atual

### Duração e Objetivo

- **Duração**: Período contínuo (a ser especificado durante implementação)
- **Objetivo principal**: Equilibrar WIP, cycle time e throughput
  - Manter WIP dentro de limites saudáveis
  - Publicar cards mantendo métricas equilibradas
  - Demonstrar compreensão do sistema completo
- **Critério de conclusão**: Atingir metas de entrega sem exceder WIP máximo

### Conceito Ensinado: WIP (Work In Progress)

**Definição apresentada ao jogador:**
> "WIP é a quantidade de trabalho que está sendo feito ao mesmo tempo. Quanto mais cards em andamento, mais lento tudo fica. Menos é mais."

**Aprendizado:**
- Trabalho em excesso gera gargalos e espera
- Finalizar trabalho > iniciar trabalho
- Limites de WIP forçam priorização
- Impactos do WIP alto:
  - Aumento de cycle time
  - Redução de throughput
  - Mais ajustes e retrabalho
  - Perda de eficiência dos papéis

### Mecânica de Penalidades (conceitual)

Quando o WIP ultrapassa limites saudáveis:
- Eficiência dos papéis é reduzida progressivamente
- Probabilidade de ajustes aumenta
- Cycle time de todos os cards em andamento aumenta
- Feedback visual indica sobrecarga do sistema

### Narrativa

> "Você aprendeu a medir tempo, a manter ritmo... mas ainda há um inimigo escondido: tentar fazer tudo ao mesmo tempo. Limite o trabalho em andamento. Finalize antes de começar."

---

## Implementação Futura

### Arquivos HTML Independentes

Cada capítulo será implementado como um arquivo `.html` separado:
- `chapter1.html` — Sobreviva à Sprint
- `chapter2.html` — Mais gente resolve?
- `chapter3.html` — Cycle Time: quanto tempo dói
- `chapter4.html` — Throughput: constância importa
- `chapter5.html` — WIP: o inimigo invisível

### Navegação entre Capítulos

- Ao concluir um capítulo, o jogador é direcionado automaticamente ao próximo
- O estado é transferido através de localStorage ou API
- Possibilidade de revisitar capítulos anteriores (a definir)

### Ajustes de Layout

Antes da implementação dos capítulos:
- Interface será otimizada para diferentes resoluções
- Componentes serão modularizados para reutilização
- Sistema de telas de transição entre capítulos será criado
- Tutorial contextual será desenvolvido

---

## Observações Finais

### Filosofia Pedagógica

1. **Capítulos 1-2**: Ensinar através da experiência
   - O jogador descobre problemas reais
   - Frustração e sucesso são ferramentas de ensino
   - Conceitos emergem da prática, não da teoria

2. **Capítulos 3-5**: Ensinar através da reflexão
   - O jogador aplica conhecimento explícito
   - Métricas orientam decisões
   - Teoria complementa a experiência

### Progressão de Complexidade

- **Capítulo 1**: Sobrevivência básica
- **Capítulo 2**: Crescimento e complexidade
- **Capítulo 3**: Medição e otimização (tempo)
- **Capítulo 4**: Previsibilidade e ritmo (quantidade)
- **Capítulo 5**: Controle e equilíbrio (sistema completo)

### Status Atual

**Este documento é apenas design conceitual.**

A implementação dos capítulos será realizada em etapas futuras, após:
- Validação do design com stakeholders
- Refinamento do layout atual
- Planejamento técnico detalhado
- Definição de valores e parâmetros de jogo

---

**Documento criado em:** 27 de dezembro de 2025  
**Versão:** 1.0 (design inicial)  
**Status:** Conceitual — aguardando implementação
