// tutorial.steps.js — Passos do Tutorial
// Responsabilidade: Definir sequência de passos (pedagógico)
(function(K) {
  K = K || (window.Kanban = window.Kanban || {});

  /**
   * Array de passos do tutorial
   * 
   * Estrutura de cada passo:
   * - title: Título da mensagem
   * - message: HTML da mensagem
   * - highlight: Seletor CSS do elemento a destacar
   * - allowedActions: Array de ações permitidas
   * - onEnter: Função executada ao entrar no passo
   * - onExit: Função executada ao sair do passo
   * - waitFor: Evento que deve ocorrer para avançar (opcional)
   */
  K.TutorialSteps = [
    // ========================================
    // BLOCO 1: BOAS-VINDAS E CONTEXTO
    // Objetivo: Ambientar o jogador
    // ========================================

    // Passo 1.1 — Boas-vindas
    {
      title: '🎮 Bem-vindo ao RonyOffice!',
      message: `
        <p>Se você é ansioso, ótimo.<br>
        Aqui a ansiedade aparece rápido quando o sistema responde às suas decisões.</p>
        <p>Nada acontece por acaso.<br>
        Cada escolha puxa um fio.<br>
        E o jogo sempre devolve algo em troca.</p>
        <p>Respira fundo.<br>
        <strong>Vamos começar com calma.</strong></p>
      `,
      highlight: null,
      ronySprite: '0 0', // Rony Normal
      allowedActions: [],
      onEnter: function() {
        K.TutorialState.blockAllActions();
      },
      onExit: null,
      waitFor: null
    },

    // Passo 1.2 — Visão Geral do Board
    {
      title: '👀 Esse é o seu board.',
      message: `
        <p>Aqui você vê todo o fluxo do trabalho:<br>
        de onde as demandas nascem até onde elas são entregues.</p>
        <p>Os cards se movem da esquerda para a direita, passando por etapas diferentes.<br>
        Cada coluna representa um momento do trabalho.</p>
        <p>Entender esse fluxo é essencial.<br>
        <strong>Todo o jogo acontece aqui.</strong></p>
      `,
      highlight: '#board',
      ronySprite: '-100px 0', // Rony Apontando
      allowedActions: [],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialUI.highlightElement('#board');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: null
    },

    // Passo 1.3 — Área de Papéis (Pessoas)
    {
      title: '🧠 Aqui estão as pessoas do seu time.',
      message: `
        <p>Este é um jogo de turnos.<br>
        Antes de iniciar um turno, você se prepara.</p>
        <p>Os papéis representam pessoas e eles são associados aos cards.</p>
        <p><strong>Escolher quem vai trabalhar em cada card faz parte do planejamento do turno.</strong></p>
      `,
      highlight: '#rolesArea',
      ronySprite: '-100px 0', // Rony Apontando
      allowedActions: [],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialUI.highlightElement('#rolesArea');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: null
    },

    // Passo 1.4 — Botão "Iniciar Turno"
    {
      title: '▶️ Este botão inicia o turno.',
      message: `
        <p>Cada turno representa 1 dia de trabalho.</p>
        <p>Enquanto ele não for clicado, nada acontece.<br>
        O jogo espera você se preparar.</p>
        <p>Mover cards, associar papéis e pensar nas decisões vem antes de iniciar o turno.</p>
        <p>Quando você clica em Iniciar Turno, o dia passa, o trabalho acontece<br>
        <strong>e as consequências aparecem.</strong></p>
      `,
      highlight: '#startButton',
      ronySprite: '-85px -100px', // Rony Thumbs Up
      allowedActions: [],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialUI.highlightElement('#startButton');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: null
    },

    // ========================================
    // BLOCO 2: BACKLOG E LIMITE DE WIP
    // Objetivo: Ensinar que limite vem antes de velocidade
    // ========================================

    // Passo 2.1 — O Backlog
    {
      title: '📋 Esse é o Backlog.',
      message: `
        <p>Ele aceita no máximo 5 cards.<br>
        Mais do que isso não é produtividade, é só bagunça organizada.</p>
        <p>Esse limite existe por um motivo:<br>
        proteger o fluxo e evitar que tudo trave ao mesmo tempo.</p>
        <p>Aqui, limite não é castigo.<br>
        <strong>É estratégia.</strong></p>
      `,
      highlight: '.column[data-col="Backlog"]',
      ronySprite: '-200px 0', // Rony Sério
      allowedActions: [],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialUI.highlightElement('.column[data-col="Backlog"]');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: null
    },

    // Passo 2.2 — Gerar Cards
    {
      title: '▶️ Agora vamos preencher o Backlog',
      message: `
        <p>Clique em <strong>Iniciar Turno</strong><br>
        para o jogo gerar os cards.</p>
        <p>Repara bem:<br>
        o sistema respeita o limite,<br>
        mesmo quando ainda tem demanda.</p>
      `,
      highlight: '#startButton',
      ronySprite: '-100px 0', // Rony Apontando
      allowedActions: ['startTurn'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('startTurn');
        K.TutorialUI.highlightElement('#startButton');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: 'startTurn' // Avança automaticamente quando jogador iniciar turno
    },

    // Passo 2.3 — Limite Atingido
    {
      title: '🚫 Viu só?',
      message: `
        <p>Sem espaço,<br>
        sem card novo.</p>
        <p>Enquanto o Backlog estiver cheio,<br>
        nada entra.</p>
        <p><strong>Primeiro flui.<br>
        Depois acelera.</strong></p>
      `,
      highlight: '.column[data-col="Backlog"]',
      ronySprite: '-200px 0', // Rony Sério
      allowedActions: [],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialUI.highlightElement('.column[data-col="Backlog"]');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: null
    },

    // ========================================
    // BLOCO 3: PAPÉIS E ALOCAÇÃO
    // Objetivo: Ensinar como associar pessoas ao trabalho
    // ========================================

    // Passo 3.1 — Conhecendo o Time
    {
      title: '👥 Esse é o seu time.',
      message: `
        <p>Cada pessoa nasce com um talento natural 🎯<br>
        Você não escolhe isso. O jogo também não.</p>
        <p>Seu papel aqui não é mudar as pessoas,<br>
        é colocar cada uma <strong>onde ela consegue trabalhar melhor.</strong></p>
      `,
      highlight: '#rolesArea',
      ronySprite: '-100px 0', // Rony Apontando
      allowedActions: [],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialUI.highlightElement('#rolesArea');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: null
    },

    // Passo 3.2 — Talento, Felicidade e Eficiência
    {
      title: '🧠 Vamos falar de como o trabalho acontece de verdade',
      message: `
        <p><strong>🎯 Talento Natural</strong> é a base.<br>
        É o que a pessoa faz bem, sem esforço extra.</p>
        <p><strong>😊 Felicidade</strong> é o multiplicador.<br>
        Quando alguém trabalha no que combina com seu talento,<br>
        a felicidade sobe.</p>
        <p><strong>⚡ Eficiência</strong> é o resultado final.<br>
        Ela nasce do talento<br>
        e cresce ou diminui com a felicidade.</p>
        <p><strong>Talento + Felicidade<br>
        definem o quanto uma pessoa consegue produzir em um turno.</strong></p>
      `,
      highlight: '#rolesArea',
      ronySprite: '-200px 0', // Rony Sério
      allowedActions: [],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialUI.highlightElement('#rolesArea');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: null
    },

    // Passo 3.3 — Regra do Backlog
    {
      title: '⛔ Aqui ainda não é trabalho.',
      message: `
        <p>No Backlog, nada anda e ninguém trabalha.</p>
        <p>Papéis só entram em cena quando o card sai da fila e começa de verdade.</p>
        <p><strong>Mova um card do Backlog para a coluna Refinamento.</strong><br>
        (Arraste ou clique em "Próxima coluna")</p>
      `,
      highlight: '.column[data-col="Backlog"]',
      ronySprite: '-100px 0', // Rony Apontando
      allowedActions: ['dragCard', 'moveCardButton'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('dragCard');
        K.TutorialState.allowAction('moveCardButton');
        K.TutorialUI.highlightElement('.column[data-col="Backlog"]');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: 'dragCard' // Aguarda mover card (por drag ou botão)
    },

    // Passo 3.4 — Associar Papel ao Card
    {
      title: '▶️ Agora associe um papel.',
      message: `
        <p>Arraste um Analista e solte em cima de um card na coluna Refinamento.</p>
        <p><strong>Essa escolha importa.</strong></p>
        <p>Quando uma pessoa trabalha em algo alinhado com seu talento,<br>
        a felicidade aumenta 😊 e isso gera bônus de eficiência ⚡.</p>
        <p>Pessoas felizes produzem melhor.<br>
        <strong>O jogo leva isso a sério.</strong></p>
      `,
      highlight: '.roles-area, .column[data-col="Refinamento"]',
      ronySprite: '-100px 0', // Rony Apontando
      allowedActions: ['dragRole', 'dragCard'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('dragRole');
        K.TutorialState.allowAction('dragCard'); // Permite mover cards também
        K.TutorialUI.highlightElement('.roles-area');
        // Também destaca a coluna Refinamento após 500ms
        setTimeout(() => {
          K.TutorialUI.highlightElement('.column[data-col="Refinamento"]', true);
        }, 100);
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: 'dragRole' // Avança quando jogador arrastar um papel
    },

    // Passo 3.5 — Iniciar Turno
    {
      title: '🎯 Agora inicie o turno',
      message: `
        <p>Clique em <strong>Iniciar Turno</strong><br>
        para ver o trabalho acontecer.</p>
        <p>O sistema vai processar:<br>
        • Quem trabalha onde<br>
        • Como cada pessoa se sente<br>
        • Quanto progresso foi feito</p>
        <p><strong>Observe os resultados.</strong></p>
      `,
      highlight: '#startButton',
      ronySprite: '-85px -100px', // Rony Thumbs Up
      allowedActions: ['startTurn', 'dragRole', 'dragCard'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('startTurn');
        K.TutorialState.allowAction('dragRole');
        K.TutorialState.allowAction('dragCard');
        K.TutorialUI.highlightElement('#startButton');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: 'startTurn' // Avança quando iniciar turno
    }
  ];

})(window.Kanban);
