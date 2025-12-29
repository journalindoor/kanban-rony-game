// roleModel.js — model and renderer for roles
(function(K){
  K = K || (window.Kanban = window.Kanban || {})

  class Role {
    constructor(name, talentoNatural){
      this.name = name
      this.talentoNatural = Math.max(1, Math.min(3, Math.floor(talentoNatural || 1)))
      this.felicidade = 0
      this.maxEficiencia = 6
    }

    get eficiencia(){
      const raw = this.talentoNatural + this.felicidade
      return Math.min(this.maxEficiencia, raw)
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
      this.talentoNatural = ('talentoNatural' in o) ? o.talentoNatural : this.talentoNatural
      this.felicidade = ('felicidade' in o) ? Math.max(0, Math.min(this.maxEficiencia - this.talentoNatural, o.felicidade)) : this.felicidade
    }
  }

    function renderRole(role, el){
      if(!el) return
      el.innerHTML = ''
      
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
      
      // Eficiência (destaque principal)
      const eficienciaDiv = document.createElement('div')
      eficienciaDiv.className = 'role-stat-main'
      eficienciaDiv.innerHTML = `⚡ ${role.eficiencia}`
      eficienciaDiv.title = 'Eficiência'
      statsContainer.appendChild(eficienciaDiv)
      
      // Felicidade e Talento (linha secundária)
      const secondaryDiv = document.createElement('div')
      secondaryDiv.className = 'role-stat-secondary'
      
      const felicidadeSpan = document.createElement('span')
      felicidadeSpan.className = 'role-stat-item'
      felicidadeSpan.innerHTML = `😊 ${role.felicidade}`
      felicidadeSpan.title = 'Felicidade'
      
      const talentoSpan = document.createElement('span')
      talentoSpan.className = 'role-stat-item'
      talentoSpan.innerHTML = `🎯 ${role.talentoNatural}`
      talentoSpan.title = 'Talento Natural'
      
      secondaryDiv.appendChild(felicidadeSpan)
      secondaryDiv.appendChild(talentoSpan)
      statsContainer.appendChild(secondaryDiv)

      // append title and stats
      el.appendChild(titleWrapper)
      el.appendChild(statsContainer)
      
      // Sincronizar stats com o personagem no office-viewport
      if(typeof K.updateCharacterStats === 'function') {
        K.updateCharacterStats(role.name)
      }
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
    const defaults = [ ['Analista', randTalento()], ['Programador', randTalento()], ['QA/Tester', randTalento()] ]
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
