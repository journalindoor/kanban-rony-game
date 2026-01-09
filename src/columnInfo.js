// columnInfo.js — Sistema de informações contextuais das colunas
(function(K) {
  K = K || (window.Kanban = window.Kanban || {})

  // Conteúdo informativo de cada coluna
  K.columnInfoData = {
    'Backlog': {
      title: 'Backlog',
      description: 'O Backlog é onde nascem todas as ideias e demandas do projeto. É como uma lista de espera de trabalhos que precisam ser feitos.',
      mechanics: 'Cards novos aparecem aqui automaticamente (máximo 5). Para começar a trabalhar em um card, arraste-o para Refinamento.',
      happiness: {
        'Analista': 'Contente (🙂 +2)',
        'Programador': 'Contente (🙂 +2)',
        'QA/Tester': 'Contente (🙂 +2)'
      },
      tip: 'Dica: Não deixe o Backlog ficar vazio! Mantenha sempre cards esperando para garantir que a equipe tenha trabalho.'
    },
    'Refinamento': {
      title: 'Refinamento',
      description: 'Aqui os Analistas refinam as ideias, definem requisitos e preparam os cards para entrarem no sprint. É o momento de entender O QUE precisa ser feito.',
      mechanics: 'Associe um Analista ao card para reduzir a dificuldade. Quando chegar a zero, o card pode ir para SprintBacklog.',
      happiness: {
        'Analista': 'Feliz! (😊 +6) — Analistas adoram refinar requisitos',
        'Programador': 'Contente (🙂 +2)',
        'QA/Tester': 'Contente (🙂 +2)'
      },
      tip: 'Estratégia: Use Analistas aqui! Eles trabalham até 3× mais rápido nesta coluna.'
    },
    'SprintBacklog': {
      title: 'SprintBacklog',
      description: 'Coluna de espera estratégica. Cards refinados ficam aqui até que um Programador esteja disponível para começar a implementação.',
      mechanics: 'Não há trabalho a fazer aqui. É apenas uma fila organizada. Arraste cards para "Fazendo" quando estiver pronto.',
      happiness: {
        'Analista': 'Contente (🙂 +2)',
        'Programador': 'Contente (🙂 +2)',
        'QA/Tester': 'Contente (🙂 +2)'
      },
      tip: 'Organização: Mantenha esta coluna organizada para visualizar o trabalho planejado.'
    },
    'Fazendo': {
      title: 'Fazendo',
      description: 'É aqui que a mágica acontece! Programadores implementam as funcionalidades, escrevem código e dão vida às ideias.',
      mechanics: 'Associe um Programador ao card para reduzir a dificuldade. Quando chegar a zero, o card pode ir para Homologando.',
      happiness: {
        'Analista': 'Contente (🙂 +2)',
        'Programador': 'Feliz! (😊 +6) — Programadores amam codificar',
        'QA/Tester': 'Contente (🙂 +2)'
      },
      tip: 'Foco: Programe radores aqui são super eficientes! Use-os nesta coluna para máxima produtividade.'
    },
    'Homologando': {
      title: 'Homologando',
      description: 'Momento de validação! QAs testam se tudo funciona corretamente, buscam bugs e garantem qualidade antes da publicação.',
      mechanics: 'Associe um QA ao card para reduzir a dificuldade. Quando chegar a zero, se houver bugs (Ajustes), o card vai para Ajustes. Se não, vai direto para Publicado!',
      happiness: {
        'Analista': 'Contente (🙂 +2)',
        'Programador': 'Contente (🙂 +2)',
        'QA/Tester': 'Feliz! (😊 +6) — QAs são experts em testes'
      },
      tip: 'Qualidade: QAs eficientes (felizes) encontram menos bugs! Use-os aqui para reduzir retrabalho.'
    },
    'Ajustes': {
      title: 'Ajustes',
      description: 'Ops! Foram encontrados bugs durante a homologação. Programadores voltam aqui para corrigir os problemas antes da publicação.',
      mechanics: 'Associe um Programador ao card para corrigir os bugs. Quando os Ajustes chegarem a zero, o card pode ir para Publicado.',
      happiness: {
        'Analista': 'Contente (🙂 +2)',
        'Programador': 'Satisfeito (😌 +3) — Programadores não adoram bugs, mas gostam de resolvê-los',
        'QA/Tester': 'Contente (🙂 +2)'
      },
      tip: 'Prevenção: Quanto melhor a homologação, menos trabalho aqui! QAs eficientes = menos ajustes.'
    },
    'Publicado': {
      title: 'Publicado',
      description: 'Vitória! O trabalho foi concluído, testado e está pronto para os usuários. Esta é a meta final de todo card.',
      mechanics: 'Cards ficam aqui temporariamente. No próximo turno, são automaticamente movidos para Arquivados.',
      happiness: {
        'Analista': 'Contente (🙂 +2)',
        'Programador': 'Contente (🙂 +2)',
        'QA/Tester': 'Contente (🙂 +2)'
      },
      tip: 'Meta: Quanto mais cards publicados, melhor seu desempenho no jogo!'
    },
    'Arquivados': {
      title: 'Arquivados',
      description: 'Histórico de conquistas! Todos os cards publicados vêm para cá. É seu registro de trabalho concluído.',
      mechanics: 'Cards aqui não precisam mais de atenção. São apenas registros do trabalho finalizado.',
      happiness: {
        'Analista': 'Contente (🙂 +2)',
        'Programador': 'Contente (🙂 +2)',
        'QA/Tester': 'Contente (🙂 +2)'
      },
      tip: 'Acompanhamento: Visualize quantos cards você já completou!'
    }
  }

  // Adiciona ícones de info aos headers das colunas
  K.setupColumnInfoIcons = function() {
    document.querySelectorAll('.column-header').forEach(header => {
      // Evitar adicionar múltiplos ícones
      if (header.querySelector('.column-info-icon')) return

      const column = header.closest('.column')
      const colName = column?.dataset.col
      if (!colName || !K.columnInfoData[colName]) return

      // Criar ícone de info
      const infoIcon = document.createElement('span')
      infoIcon.className = 'column-info-icon'
      infoIcon.textContent = 'ⓘ'
      infoIcon.title = `Informações sobre ${colName}`
      infoIcon.dataset.column = colName

      // Inserir antes do wip-counter
      const wipCounter = header.querySelector('.wip-counter')
      if (wipCounter) {
        header.insertBefore(infoIcon, wipCounter)
      } else {
        header.appendChild(infoIcon)
      }

      // Evento de clique
      infoIcon.addEventListener('click', (e) => {
        e.stopPropagation()
        K.openColumnInfoModal(colName)
      })
    })
  }

  // Abre o modal com informações da coluna
  K.openColumnInfoModal = function(columnName) {
    const data = K.columnInfoData[columnName]
    if (!data) return

    const modal = document.getElementById('columnInfoModal')
    if (!modal) return

    // Preencher conteúdo
    modal.querySelector('.column-info-title').textContent = data.title
    modal.querySelector('.column-info-description').textContent = data.description
    modal.querySelector('.column-info-mechanics').textContent = data.mechanics

    // Preencher bônus de felicidade
    const happinessList = modal.querySelector('.column-info-happiness-list')
    happinessList.innerHTML = ''
    Object.entries(data.happiness).forEach(([role, bonus]) => {
      const li = document.createElement('li')
      li.textContent = `${role}: ${bonus}`
      happinessList.appendChild(li)
    })

    // Preencher dica
    modal.querySelector('.column-info-tip').textContent = data.tip

    // Mostrar modal
    modal.style.display = 'flex'
  }

  // Fecha o modal
  K.closeColumnInfoModal = function() {
    const modal = document.getElementById('columnInfoModal')
    if (modal) modal.style.display = 'none'
  }

  // Configura eventos do modal
  K.setupModalEvents = function() {
    const modal = document.getElementById('columnInfoModal')
    if (!modal) return

    // Remover event listeners antigos (se existirem)
    const closeBtn = modal.querySelector('.column-info-close')
    if (closeBtn) {
      closeBtn.replaceWith(closeBtn.cloneNode(true))
      modal.querySelector('.column-info-close').addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        K.closeColumnInfoModal()
      })
    }

    // Fechar ao clicar no backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('column-info-modal')) {
        K.closeColumnInfoModal()
      }
    })
  }

  // Inicialização
  K.initColumnInfo = function() {
    K.setupColumnInfoIcons()
    K.setupModalEvents()
  }

  // Setup ao carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', K.initColumnInfo)
  } else {
    K.initColumnInfo()
  }

})(window.Kanban)
