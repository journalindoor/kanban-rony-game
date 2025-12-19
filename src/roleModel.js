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
      const title = document.createElement('div')
      title.className = 'role-name'
      title.textContent = role.name

      // build a 2-row table: header "Tal + Fel = Efi" and values row
      const table = document.createElement('table')
      table.className = 'role-table'
      const headerRow = document.createElement('tr')
      const headers = ['Tal','+','Fel','=','Efi']
      if(!Array.isArray(headers)){
        console.warn('role headers not an array', headers)
      } else {
        for(let i=0;i<headers.length;i++){
          const th = document.createElement('th')
          th.textContent = headers[i]
          headerRow.appendChild(th)
        }
      }
      const valuesRow = document.createElement('tr')
      // Tal
      const tdTal = document.createElement('td')
      tdTal.textContent = role.talentoNatural
      valuesRow.appendChild(tdTal)
      // +
      const tdPlus = document.createElement('td')
      tdPlus.textContent = '+'
      valuesRow.appendChild(tdPlus)
      // Fel (with controls)
      const tdFel = document.createElement('td')
      tdFel.textContent = role.felicidade
      valuesRow.appendChild(tdFel)
      // =
      const tdEq = document.createElement('td')
      tdEq.textContent = '='
      valuesRow.appendChild(tdEq)
      // Efi
      const tdEfi = document.createElement('td')
      tdEfi.textContent = role.eficiencia
      valuesRow.appendChild(tdEfi)

      table.appendChild(headerRow)
      table.appendChild(valuesRow)

      // append title and values table (felicidade is read-only via UI)
      el.appendChild(title)
      el.appendChild(table)
    }

  // expose
  K.RoleModel = K.RoleModel || {}
  K.RoleModel.Role = Role
  K.RoleModel.renderRole = renderRole
  // convenience alias used elsewhere
  K.renderRole = K.renderRole || renderRole

  // roleInstances container
  K.roleModels = K.roleModels || {}

  // initialize defaults if not present
  document.addEventListener('DOMContentLoaded', ()=>{
    const defaults = [ ['Analista',2], ['Programador',3], ['QA/Tester',1] ]
    defaults.forEach(([name, talento])=>{
      if(!K.roleModels[name]) K.roleModels[name] = new Role(name, talento)
      const el = document.querySelector('[data-role="'+name+'"]')
      if(el) renderRole(K.roleModels[name], el)
    })
  })

})(window.Kanban)
