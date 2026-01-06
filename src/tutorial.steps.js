// tutorial.steps.js — Passos do Tutorial
// Responsabilidade: Definir sequência de passos (pedagógico)
(function(K) {
  K = K || (window.Kanban = window.Kanban || {});

  /**
   * Detecta se o usuário está em mobile
   * @returns {boolean} true se largura <= 768px
   */
  const isMobile = () => window.innerWidth <= 768;
  
  /**
   * Retorna texto adaptado para mobile/desktop
   * @param {string} desktopText - Texto para desktop
   * @param {string} mobileText - Texto para mobile
   * @returns {string} Texto apropriado
   */
  const adaptText = (desktopText, mobileText) => {
    return isMobile() ? mobileText : desktopText;
  };

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
        <p>Vê o botão azul <strong>▶️ Iniciar</strong> ${adaptText(
          'ali na esquerda, na área da videochamada',
          'logo acima'
        )}?</p>

<p>Ele faz o jogo andar.<br>
<strong>1 clique = 1 dia de trabalho.</strong></p>

${adaptText(
  '',
  '<p><em>(Dica: No mobile, existem 2 botões Iniciar — um acima e outro na área de videochamada abaixo. Ambos fazem a mesma coisa!)</em></p>'
)}

<p>Enquanto você não clicar nele,<br>
nada acontece.<br>
O jogo espera você se preparar.</p>

<p class="tutorial-action">Clique agora em <strong>▶️ Iniciar</strong> para os cards entrarem no Backlog.</p>

<p>Repara com atenção.<br>
Leia os títulos.<br>
Eles contam mais coisa do que parece.</p>

<p>Mesmo com espaço sobrando,<br>
o sistema não joga coisa no ar.</p>

<p><strong>Nada aqui é coincidência.</strong></p>

      `,
      get highlight() {
        return isMobile() ? '#mobileStartButton' : '#startButton';
      },
      ronySprite: '-100px 0', // Rony Apontando
      allowedActions: ['startTurn'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('startTurn');
        const buttonSelector = isMobile() ? '#mobileStartButton' : '#startButton';
        K.TutorialUI.highlightElement(buttonSelector);
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
        <p><strong>"📊 Relatório urgente que ninguém pediu"</strong><br>
        <strong>"🔥 Corrigir bug que só acontece na sexta"</strong><br>        
        <strong>"🤡 Ajustar alinhamento do botão em produção"</strong></p>
        <p>Eles vão ser seus companheiros até o fim do tutorial.</p>
        <p>Agora você vai aprender a movê-los,<br>
        alocar pessoas e fazer o trabalho acontecer.</p>
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
        <p>No Backlog, nada anda e ninguém trabalha.</p>

  <p>Esses cards ainda estão na fila.<br>
  Enquanto eles ficam aqui,<br>
  ninguém encosta neles.</p>

  <p class="tutorial-action">Comece movendo o card:<br>
  "9001 - 📊 Relatório urgente que ninguém pediu"<br>
  para a coluna Refinamento.</p>

  <p>Se quiser, você pode mover mais de um.<br>
  Mas vamos focar nesse primeiro.</p>
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

  <p><strong>👥 Esse é o seu time.</strong><br>
Cada pessoa tem um talento natural 🎯<br>
Você não escolhe isso. O jogo também não.</p>

  <p>Quando alguém trabalha alinhado com seu talento, a felicidade aumenta 😊 e isso gera bônus de eficiência ⚡.</p>

  <p><strong>Seu papel: Pensar na melhor forma de colocar cada pessoa onde ela consegue trabalhar melhor.</strong></p>

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
        <p class="tutorial-action">Clique em <strong>▶️ Iniciar</strong> novamente para ver o trabalho acontecer no card "9001 – 📊 Relatório urgente que ninguém pediu".</p>

<p>Vê o <strong>indicador vermelho</strong> no card?<br>
Ele mostra quanto trabalho ainda falta.</p>

<p>Quando o turno roda,<br>
<strong>esse indicador vai diminuir.</strong></p>

<p>A eficiência da pessoa trabalhando<br>
transforma em progresso real.<br>
Quanto melhor a eficiência, mais o indicador diminui.</p>

<p><strong>Observe os resultados.</strong></p>

      `,
      get highlight() {
        return isMobile() ? '#mobileStartButton' : '#startButton';
      },
      ronySprite: '-85px -100px', // Rony Thumbs Up
      position: 'left',
      allowedActions: ['startTurn', 'dragRole', 'dragCard', 'moveCardButton'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('startTurn');
        K.TutorialState.allowAction('dragRole');
        K.TutorialState.allowAction('dragCard');
        K.TutorialState.allowAction('moveCardButton');
        const buttonSelector = isMobile() ? '#mobileStartButton' : '#startButton';
        K.TutorialUI.highlightElement(buttonSelector);
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
        <p><strong>Regra importante:</strong><br>
        Só pode mover o card quando o indicador chegar a zero.</p>

        <p>Trabalho incompleto não avança.<br>
        Essa é a base do fluxo Kanban.</p>

        <p class="tutorial-action">Continue rodando turnos até o indicador do card 9001 chegar a zero. Quando zerar, avance-o para Sprint Backlog.</p>
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
        <p>O indicador chegou a zero.<br>
        O trabalho do Refinamento está pronto.</p>

        <p>Moveu o card <strong>9001</strong> para <strong>Sprint Backlog</strong>?</p>

        <p><strong>Sprint Backlog é outra fila.</strong><br>
        Serve para organizar o que vai ser feito.<br>
        Não precisa de papel aqui.</p>

        <p class="tutorial-action">Mova direto para Fazendo depois.<br>
        Lá sim, você vai precisar associar um papel.</p>

        <p><strong>O fluxo não tem atalhos.</strong></p>
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
        <p>Agora o card <strong>9001</strong> está em <strong>Fazendo</strong>.</p>

        <p>Aqui o trabalho acontece de verdade.</p>

        <p class="tutorial-action">Associe um <strong>Dev (Programador)</strong> ao card.<br>
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
        <p>O card <strong>9001</strong> está em <strong>Homologação</strong>.</p>

        <p>Aqui é onde bugs são descobertos.<br>
        QAs testam tudo antes de publicar.</p>

        <p class="tutorial-action">Associe um <strong>QA (Tester)</strong> ao card.<br>
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
        <p>A Homologação terminou.<br>
        O jogo calculou se bugs foram encontrados.</p>

        <p><strong>Se o card recebeu pontos em Ajustes:</strong><br>
        O QA encontrou bugs antes da publicação.<br>
        Associe um <strong>Dev (Programador)</strong>, corrija e avance para Publicado.</p>

        <p><strong>Se não tem indicador de Ajustes:</strong><br>
        Nenhum bug foi encontrado!<br>
        Pode mover direto para Publicado.</p>

        <p>QA eficiente evita Retrabalho.<br>
        <strong>Qualidade custa menos que pressa.</strong></p>
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
        <p>O card <strong>9001</strong> está pronto para ser publicado.</p>

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
        <p>O card está em <strong>Publicado</strong>.</p>

        <p class="tutorial-action">Clique em <strong>▶️ Iniciar</strong> para publicar o card.</p>

        <p>Quando você rodar o turno:<br>
        • O card será <strong>arquivado</strong><br>
        • Você receberá a <strong>renda</strong> dele<br>
        • O indicador de dinheiro 💰 vai aumentar</p>

        <p><strong>Entregar é o que paga as contas.</strong><br>
        Trabalho que não sai não gera valor.</p>

        <p>Vamos ver acontecer.</p>
      `,
      get highlight() {
        return isMobile() ? '#mobileStartButton' : '#startButton';
      },
      ronySprite: '0 -120px', // Rony Sorrindo
      position: 'left',
      allowedActions: ['startTurn'],
      onEnter: function() {
        K.TutorialState.blockAllActions();
        K.TutorialState.allowAction('startTurn');
        const buttonSelector = isMobile() ? '#mobileStartButton' : '#startButton';
        K.TutorialUI.highlightElement(buttonSelector);
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
        <p>Você completou o tutorial! 🎉</p>

        <p>Agora você sabe:<br>
        • Como o fluxo Kanban funciona<br>
        • Como alocar pessoas nos cards<br>
        • Como indicadores guiam o progresso<br>
        • Como qualidade evita retrabalho<br>
        • Como entrega gera renda</p>

        <p><strong>O jogo começa agora.</strong></p>

        <p>Cada decisão tem consequência.<br>
        Cada pessoa importa.<br>
        Cada entrega conta.</p>

        <p>Boa sorte! 🚀</p>
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
