// officeStatusMessages.js — Frases dinâmicas para o RonyOffice
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  // Array de frases para rotação no footer do RonyOffice
  K.officeStatusMessages = [
    '🏠 Homeoffice ativado. Pants optional.',
    '☕ Time online, café obrigatório.',
    '🧩 Backlog carregado. Boa sorte.',
    '🧠 Cérebros ligados. Código não.',
    '🧑‍💻 Trabalhando… mais ou menos.',
    '🔄 Status: depende do card.',
    '🐱 Reunião em andamento (possível gato no teclado).',
    '💻 Deploy é sexta. Reza forte.',
    '🎮 Dev mode: ON. Social life: OFF.',
    '🍕 Pizza no sprint. Problema resolvido.',
    '⚡ Energia: cafeinada. Bugs: iminentes.',
    '🎯 Foco total. Notificações: silenciadas.',
    '🔥 Produtividade máxima. Spotify no talo.',
    '🌙 Horário nobre do dev: 23h às 4h.',
    '🤖 Automação em progresso. Preguiça também.',
    '📊 Métricas subindo. Ansiedade também.',
    '🚀 Sprint rodando. Sanidade caindo.',
    '🎧 Noise cancelling ON. Mundo OFF.',
    '🧘 Zen mode: respirar entre bugs.',
    '💡 Ideias brilhantes. Implementação duvidosa.'
  ]

  // Função para obter a mensagem baseada no contador de dias do jogo
  K.getOfficeStatusMessage = function(){
    // Usar o contador de dias do jogo (muda a cada turno)
    const dayCount = K.dayCount || 0
    
    // Determinar qual frase mostrar baseado no dia
    const messageIndex = dayCount % K.officeStatusMessages.length
    
    return K.officeStatusMessages[messageIndex]
  }

  // Atualizar o texto do footer
  K.updateOfficeStatus = function(){
    const statusText = document.querySelector('.office-footer .status-text')
    if(statusText){
      statusText.textContent = K.getOfficeStatusMessage()
    }
  }

  // Inicializar quando o DOM estiver pronto
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', K.updateOfficeStatus)
  } else {
    K.updateOfficeStatus()
  }

})(window.Kanban)
