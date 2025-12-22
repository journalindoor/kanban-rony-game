# Kanban Rony Game

Um jogo de simulação Kanban onde você gerencia cards através de um fluxo de trabalho, associa papéis (Analista, Programador, QA/Tester) aos cards e acompanha o progresso do desenvolvimento.

## 📋 Visão Geral

O Kanban Rony Game simula um processo de desenvolvimento ágil onde:
- Cards representam tarefas que fluem através de diferentes colunas
- Papéis (roles) podem ser associados aos cards para realizar trabalho
- Cada papel tem eficiência baseada em Talento Natural e Felicidade
- O trabalho progride a cada turno, reduzindo os indicadores de dificuldade
- Cards podem ter ajustes identificados durante homologação

## 🎮 Como Jogar

### Fluxo Básico

1. **Iniciar Turno**: Clique em "Iniciar Turno" para:
   - Gerar novos cards no Backlog (máximo 5)
   - Aplicar eficiência dos papéis aos cards com papéis associados
   - Avançar o contador de dias

2. **Associar Papéis**: Arraste um papel da área inferior e solte em um card para associá-lo

3. **Desassociar Papéis**: 
   - Clique no botão "×" ao lado do nome do papel no card
   - Ou aguarde a liberação automática quando o indicador da coluna chegar a zero

4. **Mover Cards**: Arraste cards entre colunas respeitando as regras de movimentação

5. **Acompanhar Progresso**: Observe os indicadores de dificuldade sendo reduzidos a cada turno

### Controles

- **Iniciar Turno**: Executa um ciclo de trabalho
- **Reiniciar**: Reseta o jogo para o estado inicial
- **Arquivados**: Mostra/oculta cards já publicados

## 🏗️ Estrutura do Projeto

```
kanbanRonyGame/
├── css/
│   └── styles.css              # Estilos principais do board e componentes
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
│   └── main.js                 # Inicialização e UI
├── index.html                  # Arquivo principal
├── game_rules.md               # Regras oficiais do jogo
├── PERSISTENCIA_FIX.md         # Documentação de correções
└── README.md                   # Este arquivo
```

## 📖 Documentação

- **[game_rules.md](game_rules.md)**: Regras oficiais e detalhadas do jogo
- **[PERSISTENCIA_FIX.md](PERSISTENCIA_FIX.md)**: Histórico de correções

## 🎯 Características Principais

### Papéis (Roles)
- **Analista** (Azul): Especialista em refinamento
- **Programador** (Verde): Especialista em desenvolvimento
- **QA/Tester** (Amarelo): Especialista em homologação

Cada papel possui:
- **Talento Natural**: 1-3 (sorteado no início do jogo)
- **Felicidade**: 0-3 (ajustável durante o jogo)
- **Eficiência**: Talento + Felicidade (máximo 6)

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

Para limpar o estado salvo, clique em **Reiniciar**.

## 🎨 Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Grid, Flexbox, transições
- **JavaScript Vanilla**: Sem frameworks, apenas ES6+
- **LocalStorage API**: Persistência de dados

## 📝 Roadmap / Futuras Melhorias

- [ ] Métricas avançadas (Cycle Time, Lead Time, Throughput)
- [ ] Sistema de conquistas
- [ ] Eventos aleatórios durante o jogo
- [ ] Mais papéis e especializações
- [ ] Modo multiplayer/competitivo
- [ ] Gráficos de desempenho

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
