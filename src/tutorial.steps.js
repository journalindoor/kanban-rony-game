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
<p>Bem-vindo ao <strong>RonyOffice</strong>.</p>

<p>Esse jogo nasceu do meu jeito de trabalhar e aprender.<br>
Nada aqui acontece por acaso.</p>

<p>Cada escolha mexe no sistema.<br>
No fluxo, nas pessoas (ou nos dois).</p>

<p>Estou ansioso.<br>
Mas <strong>vamos começar com calma.</strong></p>


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
        <p>Está pronto para começar?</p>

        <p>Aqui você vê todo o fluxo do trabalho:<br>
        de onde as demandas nascem até onde elas são entregues.</p>

        <p>Os cards atravessam as colunas da esquerda para a direita.<br>
        Cada coluna representa um momento diferente do trabalho.</p>

        <p>Entender esse fluxo é essencial.<br>
        <strong>Todo o jogo acontece aqui.</strong></p>

      `,
      highlight: '#board',
      ronySprite: '-100px 0', // Rony Apontando
      ronyFlip: true, // Espelhar horizontalmente
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

    // ========================================
    // BLOCO 2: BACKLOG E LIMITE DE WIP
    // Objetivo: Ensinar que limite vem antes de velocidade
    // ========================================

    // Passo 2.1 — O Backlog
    {
      title: '📋 Esse é o Backlog.',
      message: `
        <p>Conseguiu visualizar o board?</p>

        <p>Esse espaço aceita no máximo 5 cards.<br>
        Mais do que isso não é produtividade,<br>
        é só bagunça organizada.</p>

        <p>Aqui ficam as demandas que vão puxar o fluxo.<br>
        Nem todas vão andar ao mesmo tempo, e isso é de propósito.</p>

        <p>Esse limite existe por um motivo:<br>
        proteger o fluxo e evitar que tudo trave junto.</p>

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
      title: '▶️ Vamos ver esses cards aparecerem',
      message: `
        <p>Entendeu o que é o Backlog?</p>

        <p>Vê o botão azul <span class="tutorial-decorative-button">▶️ Iniciar</span> ali na esquerda, na área da videochamada?</p>

        <p>Ele faz o jogo andar.<br>
        <strong>1 clique = 1 dia de trabalho.</strong></p>

        <p>Enquanto você não clicar nele,<br>
        nada acontece.<br>
        O jogo espera você se preparar.</p>

        <p class="tutorial-action">Clique agora em <span class="tutorial-decorative-button">▶️ Iniciar</span> para os cards entrarem no Backlog.</p>

        <p>Repara com atenção.<br>
        Leia os títulos.<br>
        Eles contam mais coisa do que parece.</p>

        <p>Mesmo com espaço sobrando,<br>
        o sistema não joga coisa no ar.</p>

        <p><strong>Nada aqui é coincidência.</strong></p>

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
      title: '✅ Pronto. São esses 3.',
      message: `
        <p>Os cards já apareceram no Backlog?</p>

        <p>Agora você tem 3 cards fixos no tutorial:</p>
        
        <p>• 9001 — 📊 Relatório urgente que ninguém pediu<br>
        • 9002 — 🔥 Corrigir bug que só acontece na sexta<br>
        • 9003 — 🤡 Ajustar alinhamento do botão em produção</p>
        
        <p>Durante o tutorial, vamos usar esses três cards para aprender o fluxo.</p>
        
        <p>Cada um vai passar pelas colunas em momentos diferentes,<br>
        para você entender que:</p>
        
        <p>✔ Nem tudo começa junto<br>
        ✔ Nem tudo termina junto<br>
        ✔ O fluxo é mais importante que o card isolado</p>
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

    // Passo 3.3 — Regra do Backlog
    {
      title: '⛔ Aqui ainda não é trabalho.',
      message: `
        <p>Você já viu os três cards no Backlog?</p>

        <p>No Backlog, ninguém trabalha ainda.</p>

        <p>Os cards 9001, 9002 e 9003 estão apenas esperando prioridade.</p>

        <p>Vamos começar pelo primeiro da fila:</p>

        <p class="tutorial-action">👉 Mova o card 9001 — 📊 Relatório urgente que ninguém pediu<br>
        para a coluna Refinamento.</p>

        <p>Depois você vai repetir o processo com os outros.</p>
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
        <p>Você conseguiu mover o card 9001 para o Refinamento?</p>

        <p><strong>👥 Esse é o seu time.</strong><br>
        Cada pessoa tem um talento natural 🎯<br>
        Você não escolhe isso. O jogo também não.</p>

        <p>Quando alguém trabalha alinhado com seu talento, a felicidade aumenta 😊 e isso gera bônus de eficiência ⚡.</p>

        <p><strong>Seu papel: Pensar na melhor forma de colocar cada pessoa onde ela consegue trabalhar melhor.</strong></p>

        <p class="tutorial-action">Arraste um Analista e solte em cima do card "9001 - 📊 Relatório urgente que ninguém pediu" que está na coluna Refinamento.</p>

        <p>Pessoas felizes produzem melhor.<br>
        <strong>O jogo leva isso a sério.</strong></p>
      `,
      highlight: '.roles-area',
      ronySprite: '-100px 0', // Rony Apontando
      position: 'left',
      allowedActions: ['dragRole', 'dragCard'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('dragRole');
        K.TutorialState.allowAction('dragCard'); // Permite mover cards também
        K.TutorialUI.highlightElement('.roles-area');
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
        <p>Você já associou um Analista ao card 9001?</p>

        <p class="tutorial-action">Clique em <span class="tutorial-decorative-button">▶️ Iniciar</span> novamente para ver o trabalho acontecer no card "9001 – 📊 Relatório urgente que ninguém pediu".</p>

        <p>Vê o <strong>indicador vermelho</strong> no card?<br>
        Ele mostra quanto trabalho ainda falta.</p>

        <p>Quando o turno roda,<br>
        <strong>esse indicador vai diminuir.</strong></p>

        <p>A eficiência da pessoa trabalhando<br>
        transforma em progresso real.<br>
        Quanto melhor a eficiência, mais o indicador diminui.</p>

        <p><strong>Observe os resultados.</strong></p>

      `,
      highlight: '#startButton',
      ronySprite: '-85px -100px', // Rony Thumbs Up
      position: 'left',
      allowedActions: ['startTurn', 'dragRole', 'dragCard', 'moveCardButton'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('startTurn');
        K.TutorialState.allowAction('dragRole');
        K.TutorialState.allowAction('dragCard');
        K.TutorialState.allowAction('moveCardButton');
        K.TutorialUI.highlightElement('#startButton');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: 'startTurn' // Avança quando iniciar turno
    },

    // ========================================
    // BLOCO 4: TURNOS E INDICADORES
    // Objetivo: Ensinar progresso, não milagre
    // ========================================

    // Passo 4.1 — Indicadores e Progresso
    {
      title: '🔴 Sobre os indicadores',
      message: `
        <p>Você rodou o turno e viu o indicador diminuir?</p>

        <p>Agora vamos trabalhar apenas no card 9001.</p>

        <p>Repare que os outros cards (9002 e 9003)<br>
        continuam parados no Backlog.</p>

        <p>Isso é proposital:</p>

        <p>✔ Um card avança<br>
        ✔ Os outros esperam</p>

        <p>Assim você enxerga o fluxo acontecendo.</p>
      `,
      highlight: '.card[data-card-id="9001"]',
      ronySprite: '-100px 0', // Rony Apontando
      position: 'left',
      allowedActions: ['startTurn', 'dragRole', 'dragCard', 'moveCardButton'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('startTurn');
        K.TutorialState.allowAction('dragRole');
        K.TutorialState.allowAction('dragCard');
        K.TutorialState.allowAction('moveCardButton');
        K.TutorialUI.highlightElement('.card[data-card-id="9001"]');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: 'dragCard' // Avança quando jogador mover o card
    },

    // ========================================
    // BLOCO 5: FLUXO ENTRE COLUNAS
    // Objetivo: Ensinar que fluxo é regra, não opinião
    // ========================================

    // Passo 5.1 — Mover para Sprint Backlog e depois Fazendo
    {
      title: '➡️ Avançando no fluxo',
      message: `
        <p>O indicador do card 9001 já zerou?</p>

        <p>Se sim, você pode movê-lo para Sprint Backlog e depois para Fazendo.</p>

        <p>Os cards 9002 e 9003 continuam aguardando no Backlog.</p>

        <p>Isso mostra uma regra importante:</p>

        <p>👉 O sistema não move tudo junto<br>
        👉 O fluxo é construído card por card</p>

        <p>Continue seguindo com o 9001 por enquanto.</p>
      `,
      highlight: '.card[data-card-id="9001"]',
      ronySprite: '-100px 0', // Rony Apontando
      position: 'left',
      allowedActions: ['dragCard', 'moveCardButton'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('dragCard');
        K.TutorialState.allowAction('moveCardButton');
        K.TutorialUI.highlightElement('.card[data-card-id="9001"]');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: 'dragCard' // Avança quando card 9001 for movido
    },

    // Passo 5.2 — Fazendo → Homologação
    {
      title: '💻 Hora de desenvolver',
      message: `
        <p>O card 9001 chegou na coluna Fazendo?</p>

        <p>Aqui o trabalho acontece de verdade.</p>

        <p class="tutorial-action">Associe um Programador ao card.<br>
        Rode turnos até o indicador de Fazendo zerar.<br>
        Depois, mova para Homologação.</p>

        <p><strong>Cada coluna tem seu trabalho.<br>
        Nada é pulado.</strong></p>
      `,
      highlight: '.card[data-card-id="9001"]',
      ronySprite: '-100px -120px', // Rony Dando Joinha
      position: 'left',
      allowedActions: ['dragRole', 'startTurn', 'dragCard', 'moveCardButton'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('dragRole');
        K.TutorialState.allowAction('startTurn');
        K.TutorialState.allowAction('dragCard');
        K.TutorialState.allowAction('moveCardButton');
        K.TutorialUI.highlightElement('.card[data-card-id="9001"]');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: 'dragCard' // Avança quando card 9001 for movido
    },

    // ========================================
    // BLOCO 6: HOMOLOGAÇÃO E AJUSTES
    // Objetivo: Ensinar que qualidade importa e bugs acontecem
    // ========================================

    // Passo 6.1 — Homologação
    {
      title: '🧪 Hora de testar',
      message: `
        <p>O card 9001 foi movido para Homologação?</p>

        <p>Aqui é onde bugs são descobertos.<br>
        QAs testam tudo antes de publicar.</p>

        <p class="tutorial-action">Associe um QA/Tester ao card.<br>
        Depois, rode turnos até o indicador zerar.</p>

        <p><strong>A eficiência do QA importa muito aqui.</strong></p>
      `,
      highlight: '.card[data-card-id="9001"]',
      ronySprite: '0 0', // Rony Normal
      position: 'left',
      allowedActions: ['dragRole', 'startTurn', 'dragCard', 'moveCardButton'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('dragRole');
        K.TutorialState.allowAction('startTurn');
        K.TutorialState.allowAction('dragCard');
        K.TutorialState.allowAction('moveCardButton');
        K.TutorialUI.highlightElement('.card[data-card-id="9001"]');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: 'dragCard' // Avança quando card for movido ou quando indicador zerar
    },

    // Passo 6.2 — Resultado da Homologação
    {
      title: '👀 O que aconteceu?',
      message: `
        <p>A Homologação do card 9001 terminou?</p>

        <p>Se o card recebeu pontos em Ajustes, corrija antes de publicar.<br>
        Se não, pode mover direto para Publicado.</p>

        <p>Agora você já viu um ciclo completo:</p>

        <p>Backlog → Refinamento → Fazendo → Homologação → Ajustes/Publicado</p>

        <p>Em breve, você fará o mesmo com:</p>

        <p>• 9002<br>
        • 9003</p>

        <p>Mas cada um terá seu próprio ritmo.</p>
      `,
      highlight: '.card[data-card-id="9001"]',
      ronySprite: '-100px 0', // Rony Apontando
      position: 'left',
      allowedActions: ['dragRole', 'startTurn', 'dragCard', 'moveCardButton'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('dragRole');
        K.TutorialState.allowAction('startTurn');
        K.TutorialState.allowAction('dragCard');
        K.TutorialState.allowAction('moveCardButton');
        K.TutorialUI.highlightElement('.card[data-card-id="9001"]');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: 'dragCard' // Avança quando mover o card
    },

    // ========================================
    // BLOCO 7: PUBLICAÇÃO E ENTREGA
    // Objetivo: Ensinar que entrega gera valor
    // ========================================

    // Passo 7.1 — Mover para Publicado
    {
      title: '🚀 Quase lá!',
      message: `
        <p>O card 9001 já está pronto (sem indicadores vermelhos)?</p>

        <p class="tutorial-action">Mova o card para a coluna <strong>Publicado</strong>.</p>

        <p>Mas atenção:<br>
        <strong>Estar em Publicado não significa que já foi entregue.</strong></p>

        <p>É só quando você rodar o próximo turno<br>
        que o card será de fato publicado e arquivado.</p>

        <p>É aí que a renda entra.</p>
      `,
      highlight: '.card[data-card-id="9001"]',
      ronySprite: '-100px 0', // Rony Apontando
      position: 'left',
      allowedActions: ['dragCard', 'moveCardButton'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('dragCard');
        K.TutorialState.allowAction('moveCardButton');
        K.TutorialUI.highlightElement('.card[data-card-id="9001"]');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: 'dragCard' // Avança quando mover para Publicado
    },

    // Passo 7.2 — Publicar e Gerar Renda
    {
      title: '💰 Hora de entregar',
      message: `
        <p>O card 9001 já está na coluna Publicado?</p>

        <p class="tutorial-action">Clique em <span class="tutorial-decorative-button">▶️ Iniciar</span> para publicar o card.</p>

        <p>Quando você rodar o turno:<br>
        • O card será <strong>arquivado</strong><br>
        • Você receberá a <strong>renda</strong> dele<br>
        • O indicador de dinheiro 💰 vai aumentar</p>

        <p><strong>Entregar é o que paga as contas.</strong><br>
        Trabalho que não sai não gera valor.</p>

        <p>Vamos ver acontecer.</p>
      `,
      highlight: '#startButton',
      ronySprite: '0 -120px', // Rony Sorrindo
      position: 'left',
      allowedActions: ['startTurn'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('startTurn');
        K.TutorialUI.highlightElement('#startButton');
      },
      onExit: function() {
        K.TutorialUI.clearHighlight();
      },
      waitFor: 'startTurn' // Avança quando rodar o turno
    },

    // Passo 7.3 — Tutorial Concluído
    {
      title: '✅ Parabéns!',
      message: `
        <p>O card 9001 foi publicado e você recebeu a renda?</p>

        <p>Você concluiu o tutorial usando três cards reais:</p>

        <p>• 9001<br>
        • 9002<br>
        • 9003</p>

        <p>Eles continuam no jogo.</p>

        <p>Agora você pode:</p>

        <p>✔ Decidir a ordem<br>
        ✔ Alocar pessoas<br>
        ✔ Controlar o fluxo<br>
        ✔ Entregar no seu ritmo</p>

        <p>O tutorial acaba,<br>
        mas o sistema continua funcionando.</p>
      `,
      highlight: null,
      ronySprite: '0 -120px', // Rony Sorrindo
      position: 'left',
      allowedActions: [],
      onEnter: function() {
        K.TutorialState.blockAllActions();
      },
      onExit: null,
      waitFor: null
    }
  ];

})(window.Kanban);
