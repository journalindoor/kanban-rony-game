// roleModel.js — model and renderer for roles
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  /**
   * Determina qual estado de felicidade usar baseado em cargo x coluna
   * Sistema de ESTADOS PRÉ-CALCULADOS (não recalcula, apenas escolhe)
   * 
   * @param {string} characterName - Nome do papel (ex: "Analista 1", "Programador 2")
   * @param {string|null} columnId - Coluna onde está ou null se não associado
   * @returns {number} Estado de felicidade: 0 (sem card), 2 (fora função), 6 (função ideal)
   */
  K.determineHappinessState = function(characterName, columnId) {
    // Sem card → estado 0
    if (!columnId) return 0;
    
    // Extrair tipo de cargo (primeira palavra)
    const roleType = characterName.split(' ')[0];
    
    // Estados específicos por cargo x coluna
    
    // Analista
    if (roleType === 'Analista') {
      if (columnId === 'Refinamento') return 6;
      return 2; // qualquer outra coluna
    }
    
    // Programador
    if (roleType === 'Programador') {
      if (columnId === 'Fazendo') return 6;
      if (columnId === 'Ajustes') return 3; // Estado específico para Ajustes
      return 2; // qualquer outra coluna
    }
    
    // QA
    if (roleType.startsWith('QA')) {
      if (columnId === 'Homologando') return 6;
      return 2; // qualquer outra coluna
    }
    
    // Fallback: qualquer outro papel → estado 2 quando tem card
    return 2;
  };

  /**
   * Função central para aplicar contexto ao personagem
   * NÃO RECALCULA - apenas informa CONTEXTO via atributos data-*
   * CSS decide qual felicidade/eficiência mostrar
   * 
   * @param {string} characterName - Nome do papel
   */
  K.applyCharacterState = function(characterName) {
    if (!characterName) return;
    
    // Encontrar elemento DOM
    const roleEl = document.querySelector(`[data-role="${characterName}"]`);
    if (!roleEl) return;
    
    // Verificar se está associado a card e qual coluna
    const cardEl = roleEl.closest('.card');
    const colEl = cardEl ? cardEl.closest('.column') : null;
    const colName = colEl ? colEl.getAttribute('data-col') : null;
    
    // Extrair tipo de cargo
    let roleType = characterName.split(' ')[0].toLowerCase(); // "analista", "programador", "qa/tester"
    
    // Normalizar "QA/Tester" para "qa"
    if (roleType.startsWith('qa')) {
      roleType = 'qa';
    }
    
    // APENAS INFORMAR CONTEXTO via atributos data-*
    // CSS decide o que mostrar
    roleEl.setAttribute('data-role-type', roleType);
    roleEl.setAttribute('data-assigned', cardEl ? 'true' : 'false');
    
    if (colName) {
      roleEl.setAttribute('data-column', colName.toLowerCase());
    } else {
      roleEl.removeAttribute('data-column');
    }
    
    console.log('[applyCharacterState]', characterName, '→', {
      type: roleType,
      assigned: !!cardEl,
      column: colName || 'none',
      attributes: {
        'data-role-type': roleType,
        'data-assigned': cardEl ? 'true' : 'false',
        'data-column': colName ? colName.toLowerCase() : null
      }
    });
    
    // Re-estabelecer event listeners após render
    if (typeof K.setupRoleSquares === 'function') {
      K.setupRoleSquares();
    }
    
    // Sincronizar office-viewport
    if (typeof K.syncCharacterWithRole === 'function') {
      K.syncCharacterWithRole(characterName, !!cardEl);
    }
    
    // Salvar estado
    if (typeof K.saveState === 'function') {
      K.saveState();
    }
  };

  class Role {
    constructor(name, talentoNatural){
      this.name = name
      this.talentoNatural = Math.max(1, Math.min(3, Math.floor(talentoNatural || 1)))
      
      // ESTADOS FIXOS DE FELICIDADE (pré-calculados, não mudam)
      this.felicidadeState0 = 0  // 😐 Neutro
      this.felicidadeState2 = 2  // 🙂 Contente
      this.felicidadeState6 = 6  // 😊 Feliz
      
      // Detectar se é Programador
      const isProgramador = name.split(' ')[0] === 'Programador'
      
      // Programador tem estado adicional
      if (isProgramador) {
        this.felicidadeState3 = 3  // 😌 Satisfeito (Ajustes)
      }
      
      // Calcular eficiências baseadas no talento
      this._recalculateEfficiencies()
      
      // ESTADO ATIVO (qual estado está em uso agora)
      this.activeState = 0  // Começa em 0 (sem card)
      
      // Valores atuais baseados no estado ativo
      this.felicidade = this.felicidadeState0
      this.maxEficiencia = 6
      
      // DEBUG: Mostrar criação do personagem
      console.log(`[Role Constructor] ${this.name}:`, {
        talento: this.talentoNatural,
        efficiency0: this.eficienciaState0,
        efficiency2: this.eficienciaState2,
        efficiency3: this.eficienciaState3,
        efficiency6: this.eficienciaState6
      })
    }

    // Método auxiliar para recalcular eficiências (SEMPRE baseado no talento atual)
    _recalculateEfficiencies(){
      this.eficienciaState0 = this.talentoNatural + 0  // talento + 0
      this.eficienciaState2 = this.talentoNatural + 2  // talento + 2
      this.eficienciaState6 = this.talentoNatural + 6  // talento + 6
      
      // Programador tem eficiência adicional
      const isProgramador = this.name.split(' ')[0] === 'Programador'
      if (isProgramador) {
        this.eficienciaState3 = this.talentoNatural + 3  // talento + 3
      }
      
      // DEBUG: Confirmar recálculo
      console.log(`[_recalculateEfficiencies] ${this.name}:`, {
        talento: this.talentoNatural,
        'eff0 (talento+0)': this.eficienciaState0,
        'eff2 (talento+2)': this.eficienciaState2,
        'eff3 (talento+3)': this.eficienciaState3,
        'eff6 (talento+6)': this.eficienciaState6
      })
    }

    get eficiencia(){
      const raw = this.talentoNatural + this.felicidade
      return Math.min(this.maxEficiencia, raw)
    }

    // Retorna a eficiência ativa baseada na coluna onde o card está
    getActiveEfficiency(columnName){
      if (!columnName) return this.eficienciaState0

      const col = columnName.toLowerCase()
      const roleType = this.name.split(' ')[0]

      let activeEff = this.eficienciaState0

      // Analista: Refinamento = 6, outros = 2
      if (roleType === 'Analista') {
        if (col === 'refinamento') activeEff = this.eficienciaState6
        else activeEff = this.eficienciaState2
      }

      // Programador: Fazendo = 6, Ajustes = 3, outros = 2
      else if (roleType === 'Programador') {
        if (col === 'fazendo') activeEff = this.eficienciaState6
        else if (col === 'ajustes') activeEff = this.eficienciaState3
        else activeEff = this.eficienciaState2
      }

      // QA/Tester: Homologando = 6, outros = 2
      else if (roleType.startsWith('QA')) {
        if (col === 'homologando') activeEff = this.eficienciaState6
        else activeEff = this.eficienciaState2
      }

      console.log(`[getActiveEfficiency] ${this.name} em ${columnName}:`, {
        roleType,
        coluna: col,
        talento: this.talentoNatural,
        eficienciaAtiva: activeEff
      })

      return activeEff
    }

    aumentarFelicidade(n = 1){
      const maxFel = this.maxEficiencia - this.talentoNatural
      this.felicidade = Math.min(maxFel, this.felicidade + n)
      return this.felicidade
    }

    diminuirFelicidade(n = 1){
      this.felicidade = Math.max(0, this.felicidade - n)
      return this.felicidade
    }

    toJSON(){
      return { name: this.name, talentoNatural: this.talentoNatural, felicidade: this.felicidade }
    }

    fromJSON(o){
      if(!o) return
      
      // Se o talento mudou, recalcular todos os estados de eficiência
      const talentoChanged = ('talentoNatural' in o) && o.talentoNatural !== this.talentoNatural
      
      // DEBUG: Mostrar mudança de talento
      if (talentoChanged) {
        console.log(`[fromJSON] ${this.name} - Talento mudando:`, {
          antes: this.talentoNatural,
          depois: o.talentoNatural
        })
      }
      
      this.talentoNatural = ('talentoNatural' in o) ? o.talentoNatural : this.talentoNatural
      this.felicidade = ('felicidade' in o) ? Math.max(0, Math.min(this.maxEficiencia - this.talentoNatural, o.felicidade)) : this.felicidade
      
      // CRÍTICO: Recalcular eficiências se talento mudou
      if (talentoChanged) {
        this._recalculateEfficiencies()
      }
    }
  }

    function renderRole(role, el){
      if(!el) return
      
      // Salvar atributo draggable antes de limpar
      const wasDraggable = el.getAttribute('draggable');
      
      el.innerHTML = ''
      
      // Restaurar draggable
      if (wasDraggable) {
        el.setAttribute('draggable', 'true');
      }
      
      // Inicializar atributos data-* para controle CSS
      let roleType = role.name.split(' ')[0].toLowerCase();
      
      // Normalizar "QA/Tester" para "qa"
      if (roleType.startsWith('qa')) {
        roleType = 'qa';
      }
      
      el.setAttribute('data-role-type', roleType);
      
      console.log('[renderRole] Configurando atributos:', {
        name: role.name,
        roleType: roleType,
        element: el
      });
      
      // Verificar se está associado a card
      const cardEl = el.closest('.card');
      el.setAttribute('data-assigned', cardEl ? 'true' : 'false');
      
      console.log('[renderRole] Card check:', {
        hasCard: !!cardEl,
        assigned: cardEl ? 'true' : 'false'
      });
      
      // Adicionar coluna se anexado
      if (cardEl) {
        const colEl = cardEl.closest('.column');
        if (colEl) {
          const colName = colEl.getAttribute('data-col');
          if (colName) {
            el.setAttribute('data-column', colName.toLowerCase());
            console.log('[renderRole] Coluna detectada:', colName.toLowerCase());
          }
        }
      } else {
        el.removeAttribute('data-column');
        console.log('[renderRole] Sem coluna, atributo removido');
      }
      
      // Create wrapper for title and remove button
      const titleWrapper = document.createElement('div')
      titleWrapper.className = 'role-title-wrapper'
      
      const title = document.createElement('div')
      title.className = 'role-name'
      title.textContent = role.name
      titleWrapper.appendChild(title)
      
      // Always render remove button (visibility controlled by CSS)
      const removeBtn = document.createElement('button')
      removeBtn.className = 'role-remove-btn'
      removeBtn.innerHTML = '×'
      removeBtn.title = 'Desassociar papel'
      removeBtn.setAttribute('data-role-name', role.name)
      titleWrapper.appendChild(removeBtn)

      // Compact stats container with emojis
      const statsContainer = document.createElement('div')
      statsContainer.className = 'role-stats'
      
      // Linha 1: Talento + Felicidade (status base)
      const baseStatsLine = document.createElement('div')
      baseStatsLine.className = 'base-stats-line'
      
      // Talento Natural (sempre visível)
      const talentoDiv = document.createElement('div')
      talentoDiv.className = 'talent-value'
      talentoDiv.innerHTML = `🎯${role.talentoNatural}`
      talentoDiv.title = `Talento: ${role.talentoNatural}`
      baseStatsLine.appendChild(talentoDiv)
      
      // FELICIDADES - Sempre renderizadas, CSS controla visibilidade
      const happinessContainer = document.createElement('div')
      happinessContainer.className = 'happiness-container'
      
      const happiness0 = document.createElement('div')
      happiness0.className = 'happiness-0'
      happiness0.innerHTML = `😐${role.felicidadeState0}`
      happiness0.title = 'Felicidade 0 (Neutro)'
      happinessContainer.appendChild(happiness0)
      
      const happiness2 = document.createElement('div')
      happiness2.className = 'happiness-2'
      happiness2.innerHTML = `🙂${role.felicidadeState2}`
      happiness2.title = 'Felicidade 2 (Contente)'
      happinessContainer.appendChild(happiness2)
      
      // Programador tem estado 3
      if (role.felicidadeState3 !== undefined) {
        const happiness3 = document.createElement('div')
        happiness3.className = 'happiness-3'
        happiness3.innerHTML = `😌${role.felicidadeState3}`
        happiness3.title = 'Felicidade 3 (Satisfeito)'
        happinessContainer.appendChild(happiness3)
      }
      
      const happiness6 = document.createElement('div')
      happiness6.className = 'happiness-6'
      happiness6.innerHTML = `😊${role.felicidadeState6}`
      happiness6.title = 'Felicidade 6 (Feliz)'
      happinessContainer.appendChild(happiness6)
      
      baseStatsLine.appendChild(happinessContainer)
      statsContainer.appendChild(baseStatsLine)
      
      // Linha 2: Eficiência (resultado)
      const efficiencyLine = document.createElement('div')
      efficiencyLine.className = 'efficiency-line'
      
      // EFICIÊNCIAS - Sempre renderizadas, CSS controla visibilidade
      const efficiencyContainer = document.createElement('div')
      efficiencyContainer.className = 'efficiency-container'
      
      const efficiency0 = document.createElement('div')
      efficiency0.className = 'efficiency-0'
      efficiency0.innerHTML = `⚡${role.eficienciaState0}`
      efficiency0.title = `Eficiência ${role.eficienciaState0}`
      efficiencyContainer.appendChild(efficiency0)
      
      const efficiency2 = document.createElement('div')
      efficiency2.className = 'efficiency-2'
      efficiency2.innerHTML = `⚡${role.eficienciaState2}`
      efficiency2.title = `Eficiência ${role.eficienciaState2}`
      efficiencyContainer.appendChild(efficiency2)
      
      // Programador tem eficiência 3
      if (role.eficienciaState3 !== undefined) {
        const efficiency3 = document.createElement('div')
        efficiency3.className = 'efficiency-3'
        efficiency3.innerHTML = `⚡${role.eficienciaState3}`
        efficiency3.title = `Eficiência ${role.eficienciaState3}`
        efficiencyContainer.appendChild(efficiency3)
      }
      
      const efficiency6 = document.createElement('div')
      efficiency6.className = 'efficiency-6'
      efficiency6.innerHTML = `⚡${role.eficienciaState6}`
      efficiency6.title = `Eficiência ${role.eficienciaState6}`
      efficiencyContainer.appendChild(efficiency6)
      
      efficiencyLine.appendChild(efficiencyContainer)
      statsContainer.appendChild(efficiencyLine)

      // append title and stats
      el.appendChild(titleWrapper)
      el.appendChild(statsContainer)
      
      // Sincronizar stats com o personagem no office-viewport
      if(typeof K.updateCharacterStats === 'function') {
        K.updateCharacterStats(role.name)
      }
      
      // Agendar re-estabelecimento de event listeners após todas as renderizações
      // Usando debounce para evitar múltiplas chamadas
      clearTimeout(K._setupRoleSquaresTimeout);
      K._setupRoleSquaresTimeout = setTimeout(() => {
        if (typeof K.setupRoleSquares === 'function') {
          K.setupRoleSquares();
        }
      }, 10);
    }

  // expose
  K.RoleModel = K.RoleModel || {}
  K.RoleModel.Role = Role
  K.RoleModel.renderRole = renderRole
  // convenience alias used elsewhere
  K.renderRole = K.renderRole || renderRole

  // roleInstances container
  K.roleModels = K.roleModels || {}

  function randTalento(){ return Math.max(1, Math.min(3, Math.floor(Math.random()*3)+1)) }

  // initialize default roles; if force=true, replace existing models
  K.initializeRoles = function(force = false){
    const defaults = [
      ['Analista 1', randTalento()],
      ['Analista 2', randTalento()],
      ['Analista 3', randTalento()],
      ['Programador 1', randTalento()],
      ['Programador 2', randTalento()],
      ['Programador 3', randTalento()],
      ['QA/Tester 1', randTalento()],
      ['QA/Tester 2', randTalento()],
      ['QA/Tester 3', randTalento()]
    ]
    defaults.forEach(([name, talento])=>{
      if(!force && K.roleModels[name]) return
      K.roleModels[name] = new Role(name, talento)
      const el = document.querySelector('[data-role="'+name+'"]')
      if(el) renderRole(K.roleModels[name], el)
    })
  }

  // initialize defaults if not present
  document.addEventListener('DOMContentLoaded', ()=>{
    K.initializeRoles(false)
  })

})(window.Kanban)
