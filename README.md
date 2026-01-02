# RonyOffice

Um jogo de simulação Kanban onde você gerencia cards através de um fluxo de trabalho, associa papéis (Analista, Programador, QA/Tester) aos cards e acompanha o progresso do desenvolvimento.

## 📋 Visão Geral

O RonyOffice simula um processo de desenvolvimento ágil onde:
- Cards representam tarefas que fluem através de diferentes colunas
- Papéis (roles) podem ser associados aos cards para realizar trabalho
- Cada papel tem eficiência baseada em Talento Natural e Felicidade
- O trabalho progride a cada turno, reduzindo os indicadores de dificuldade
- Cards podem ter ajustes identificados durante homologação
- Sistema de capítulos com objetivos e progressão
- Tutorial interativo para novos jogadores
- Sistema monetário com pagamentos por complexidade

## 🎮 Modos de Jogo

### Modo Livre (index.html)
- Jogo sandbox sem objetivos específicos
- Cards gerados aleatoriamente
- Ideal para praticar e experimentar

### Tutorial (tutorial.html)
- Sistema guiado passo a passo
- Cards pré-definidos com dificuldade reduzida
- Ensina mecânicas básicas do jogo

### Capítulos (chapter1.html, chapter2.html, etc.)
- Missões com objetivos específicos
- Cards pré-definidos temáticos
- Progressão entre capítulos
- **Capítulo 1**: "Sobreviva à Sprint" - Objetivo: Acumular $500

## 🎮 Como Jogar

### Fluxo Básico

1. **Iniciar Turno**: Clique em "Iniciar Turno" para:
   - Gerar novos cards no Backlog (máximo 5)
   - Aplicar eficiência dos papéis aos cards com papéis associados
   - Avançar o contador de dias

2. **Associar Papéis**: Arraste um papel da área inferior e solte em um card para associá-lo
   - Cards com papéis associados vão automaticamente para o **fim da coluna**

3. **Desassociar Papéis**: 
   - Clique no botão "×" ao lado do nome do papel no card
   - Ou aguarde a liberação automática quando o indicador da coluna chegar a zero

4. **Mover Cards**: Use o botão "Próxima Coluna" respeitando as regras de movimentação
   - Cards com indicador zerado vão automaticamente para o **topo da coluna**

5. **Acompanhar Progresso**: 
   - Observe os indicadores de dificuldade sendo reduzidos a cada turno
   - Indicador vermelho = coluna atual (em trabalho)
   - Indicador verde = trabalho concluído (valor zero)

6. **Ganhar Dinheiro**: 
   - Cards arquivados geram pagamento baseado na complexidade
   - Animação suave mostra o dinheiro sendo acumulado

### Controles

- **Iniciar Turno**: Executa um ciclo de trabalho
- **Reiniciar**: Reseta o jogo para o estado inicial
- **Arquivados**: Mostra/oculta cards já publicados
- **Tutorial**: Acessa o tutorial interativo
- **Iniciar Capítulo 1**: Inicia o primeiro capítulo com objetivos

## 🏗️ Estrutura do Projeto

```
kanbanRonyGame/
├── css/
│   ├── base.css                # Estilos base e reset
│   ├── layout.css              # Layout geral e grid
│   ├── board.css               # Estilos do board Kanban
│   ├── components.css          # Componentes (cards, botões)
│   ├── status-bar.css          # Barra de status
│   ├── top-controls.css        # Controles superiores
│   ├── office-panel.css        # Painel de escritório/personagens
│   └── modal.css               # Modais e overlays
├── src/
│   ├── storage.js              # Persistência em localStorage
│   ├── cards.js                # Criação e manipulação de cards
│   ├── dragdrop.js             # Sistema de drag & drop
│   ├── roles.js                # Associação e desassociação de papéis
│   ├── roleModel.js            # Modelo de dados e renderização de papéis
│   ├── movementRules.js        # Regras de movimentação entre colunas
│   ├── adjustmentsRules.js     # Lógica de geração de ajustes
│   ├── backlogRules.js         # Regras do Backlog
│   ├── progressionRules.js     # Progressão de indicadores e liberação de papéis
│   ├── gameLogic.js            # Lógica central do turno
│   ├── cardBankManager.js      # Gerenciamento de cards pré-definidos
│   ├── chapterManager.js       # Sistema de capítulos e progressão
│   ├── officeCharacters.js     # Personagens no painel de escritório
│   └── main.js                 # Inicialização e UI
├── data/
│   ├── chapter-1-cards.js      # Cards do Capítulo 1 (IDs 1001-1005)
│   └── tutorial-basic-cards.js # Cards do Tutorial (IDs 9001-9003)
├── docs/
│   ├── game_rules.md                    # Regras oficiais detalhadas
│   ├── chapters.md                      # Estrutura dos capítulos
│   ├── ARCHITECTURE_EFFICIENCY_SYSTEM.md # Sistema de eficiência (técnico)
│   └── PERSISTENCIA_FIX.md              # Sistema de persistência
├── index.html                  # Modo Livre
├── chapter1.html               # Capítulo 1
├── tutorial.html               # Tutorial
└── README.md                   # Este arquivo
```

## 📖 Documentação

- **[docs/game_rules.md](docs/game_rules.md)**: Regras oficiais e completas do jogo
- **[docs/chapters.md](docs/chapters.md)**: Estrutura e progressão dos capítulos
- **[docs/ARCHITECTURE_EFFICIENCY_SYSTEM.md](docs/ARCHITECTURE_EFFICIENCY_SYSTEM.md)**: Arquitetura técnica do sistema de eficiência
- **[docs/PERSISTENCIA_FIX.md](docs/PERSISTENCIA_FIX.md)**: Sistema de persistência e correções

## 🎯 Características Principais

### Sistema de Cards Pré-definidos

O jogo agora possui **bancos de cards** organizados por contexto:
- **IDs Numéricos Padronizados**:
  - Cards Aleatórios: 1, 2, 3, 4...
  - Tutorial: 9001, 9002, 9003...
  - Capítulo 1: 1001-1005
  - Capítulos Futuros: 2001+, 3001+, etc.
- **Sistema de Cards Usados**: Cada card só pode ser usado uma vez por sessão
- **Prioridade**: Até 3 cards do banco aparecem primeiro, o resto é aleatório
- **Contextual**: Cada modo de jogo tem seu próprio banco

### Sistema Monetário

- Cards completados geram pagamento baseado em **complexidade total**
- Faixas de pagamento:
  - 3-12 pontos: $10
  - 13-24 pontos: $25
  - 25-36 pontos: $50
  - 37-54 pontos: $100
- **Animação suave** ao receber dinheiro (800ms, ~60fps)
- Pagamentos múltiplos simultâneos são acumulados na animação

### Sistema de Capítulos

- **Capítulo 1**: "Sobreviva à Sprint"
  - Objetivo: Acumular $500
  - 5 cards pré-definidos temáticos
  - Botão de progressão para Capítulo 2 (habilitado ao atingir meta)
- Transferência de estado entre capítulos:
  - Dinheiro acumulado
  - Talentos dos personagens
  - Dias jogados
- Cada capítulo sempre inicia do zero (fresh start)

### Tutorial Interativo

- Sistema de passos guiados
- Cards pré-definidos com menor dificuldade
- Navegação livre entre tutorial e modo livre

### Papéis (Roles)
- **Analista 1, 2, 3** (Azul): Especialistas em refinamento
- **Programador 1, 2, 3** (Verde): Especialistas em desenvolvimento
- **QA/Tester 1, 2, 3** (Amarelo): Especialistas em homologação

Cada papel possui:
- **Talento Natural**: 1-3 (sorteado no início, fixo até reiniciar)
- **Felicidade Contextual**: Varia de acordo com a coluna onde o card está (0-3)
- **Eficiência**: Talento + Felicidade (máximo 6)
- **Sistema Pré-calculado**: Estados de eficiência calculados uma única vez no início

### Escritório Virtual (Painel de Videochamada)

- Grid 3x3 com 9 personagens pixel art (3 de cada cargo)
- Estados visuais: Idle (parado) / Working (trabalhando)
- Sincronização automática com papéis associados aos cards
- Exibição de cargo identificado (ex: "Analista 1", "Programador 2", "QA/Tester 3")
- Área `.info-stats` obsoleta foi removida

### Colunas do Kanban

1. **Backlog**: Limite de 5 cards
2. **Refinamento**: Análise inicial
3. **SprintBacklog**: Fila para desenvolvimento
4. **Fazendo**: Desenvolvimento ativo
5. **Homologando**: Testes e validação
6. **Ajustes**: Correções identificadas
7. **Publicado**: Trabalho concluído
8. **Arquivados**: Cards finalizados (ocultos por padrão)

### Indicadores de Dificuldade

Cada card possui indicadores para:
- Refinamento
- Fazendo
- Homologando
- Ajustes (gerado dinamicamente)

**Estados Visuais**:
- 🔴 Vermelho: Indicador ativo (coluna atual, em trabalho)
- 🟢 Verde: Indicador concluído (valor zero)
- ⚪ Padrão: Indicador pendente

### Posicionamento Automático de Cards

- **Card com papel associado**: Move para o **fim da coluna** automaticamente
- **Card com indicador zerado**: Move para o **topo da coluna** automaticamente
- Sistema visual claro de prioridade de trabalho

### Regras de Movimentação

- Cards só avançam quando o indicador da coluna atual estiver em **zero**
- Backlog → Refinamento: sempre permitido
- Refinamento → SprintBacklog: requer indicador zero
- Homologando → Publicado: pode pular Ajustes se não houver ajustes

### Desassociação de Papéis

**Automática**: Quando o indicador da coluna chega a zero

**Manual**: Clique no botão "×" ao lado do papel para desassociá-lo a qualquer momento

## 🚀 Como Executar

### Opção 1: Abrir Diretamente
```powershell
start index.html
```

### Opção 2: Servidor Local (Recomendado)
```powershell
# Com Python
python -m http.server 8000

# Com Node.js (http-server)
npx http-server

# Com Live Server (VS Code)
# Clique com botão direito em index.html → "Open with Live Server"
```

Depois abra no navegador: `http://localhost:8000`

## 🛠️ Desenvolvimento

### Estrutura Modular

Os scripts estão organizados em módulos em `src/` para facilitar manutenção:
- Cada arquivo tem uma responsabilidade específica
- Os módulos são carregados via `<script defer>` no `index.html`
- A ordem de carregamento é importante (veja `index.html`)

### Adicionar Novas Funcionalidades

1. Crie um novo arquivo em `src/`
2. Envolva o código em um IIFE: `(function(K){ ... })(window.Kanban)`
3. Adicione o script no `index.html` na ordem correta
4. Documente as alterações em `game_rules.md` se aplicável

### Convenções de Código

- Use o namespace `window.Kanban` (alias `K`)
- Funções públicas devem ser expostas via `K.nomeFuncao = ...`
- Use `defer` nos scripts para garantir carregamento após o DOM

## 🧪 Lint (ESLint)

Para checar o código com ESLint:

### Instalar Dependências
```powershell
npm install
```

### Executar Lint
```powershell
# Verificar problemas
npm run lint

# Aplicar correções automáticas
npm run lint:fix
```

Arquivos de configuração: `.eslintrc.json`, `.eslintignore`, `package.json`

## 💾 Persistência

O jogo salva automaticamente o estado no `localStorage` do navegador:
- Posição dos cards em cada coluna
- Indicadores de dificuldade
- Papéis associados aos cards
- Dados dos papéis (Talento Natural, Felicidade)
- Contador de dias
- Dinheiro acumulado
- Cards já usados (para não reutilizar cards do banco)
- Estado de pagamento dos cards (flag `paid`)

**Chaves de Storage por Modo**:
- Modo Livre: `kanbanState_freemode`
- Tutorial: `kanbanState_tutorial`
- Capítulo 1: `kanbanState_chapter1`
- Cards Usados: `[chave]_usedCards`

Para limpar o estado salvo, clique em **Reiniciar**.

## 🎨 Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Grid, Flexbox, transições, animações
- **JavaScript Vanilla**: Sem frameworks, apenas ES6+
- **LocalStorage API**: Persistência de dados
- **Responsive Design**: Adaptação para mobile (max-width: 800px)

## 🔄 Atualizações Recentes

### Sistema de Eficiência Pré-calculada (v2.0)
- Estados de eficiência calculados uma única vez na inicialização
- Método `getActiveEfficiency(columnName)` retorna eficiência contextual correta
- 100% controlado por CSS via atributos `data-*`
- Sem recalculação dinâmica ou acúmulos indevidos
- Documentação completa em `ARCHITECTURE_EFFICIENCY_SYSTEM.md`

### Painel de Videochamada
- 9 personagens identificados (Analista 1-3, Programador 1-3, QA/Tester 1-3)
- Cargos hardcoded no HTML para performance
- Remoção da área `.info-stats` obsoleta
- Melhor clareza visual dos papéis

### Sistema de Cards Pré-definidos
- Banco de cards organizado por contexto (Tutorial, Capítulos)
- IDs numéricos padronizados para melhor gestão
- Sistema de rastreamento de cards usados

### Sistema de Capítulos
- Capítulo 1 implementado com objetivo de $500
- Transferência de estado entre capítulos
- Botões de navegação com confirmações

### Melhorias Visuais
- Indicadores coloridos (vermelho = ativo, verde = concluído)
- Animação suave de dinheiro (suporta múltiplos pagamentos)
- Painel de escritório com personagens animados
- Layout responsivo para mobile

### Correções de Bugs
- **Sistema de Eficiência**: Estados calculados corretamente com talento + felicidade contextual
- **Recalculação em fromJSON**: Eficiências recalculadas quando talento muda
- **CSS Duplicado**: Removidas duplicações em role-states.css
- IDs numéricos resolvem problema de conversão NaN
- Animação de dinheiro funciona com pagamentos simultâneos
- Cards do banco agora têm dificuldade reduzida corretamente
- Reset do jogo limpa lista de cards usados

## 📝 Roadmap / Futuras Melhorias

- [ ] Capítulos 2-5 com novos objetivos e desafios
- [ ] Mais cards pré-definidos para cada capítulo
- [ ] Métricas avançadas (Cycle Time, Lead Time, Throughput)
- [ ] Sistema de conquistas e badges
- [ ] Eventos aleatórios durante o jogo
- [ ] Mais papéis e especializações
- [ ] Sistema de níveis e upgrades de personagens
- [ ] Modo multiplayer/competitivo
- [ ] Gráficos de desempenho e estatísticas
- [ ] Sons e música de fundo
- [ ] Animações mais elaboradas para personagens

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é educacional e está disponível para uso livre.

---

**Divirta-se jogando e aprendendo sobre Kanban! 🎯**
