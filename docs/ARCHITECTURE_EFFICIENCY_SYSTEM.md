# Arquitetura do Sistema de Eficiência Ativa

## Visão Geral

Sistema 100% baseado em **estados pré-calculados** sem modificações dinâmicas de valores.

---

## Princípios Fundamentais

### 1. Nenhum Valor é Recalculado
- Estados criados apenas uma vez no `constructor` de `Role`
- Método `_recalculateEfficiencies()` só é chamado se `talentoNatural` mudar via `fromJSON`
- `getActiveEfficiency()` **APENAS LÊ** estados existentes, nunca modifica

### 2. Nenhum Valor é Acumulado
- Não existem modificadores temporários
- Não existem buffs/debuffs empilháveis
- Cada turno usa apenas a eficiência atual baseada na coluna atual

### 3. Trocar de Coluna Não Duplica Efeito
- `applyCharacterState()` **sobrescreve** atributos `data-*`
- CSS reage aos novos atributos
- Próximo turno usa automaticamente a nova eficiência

### 4. Remover/Reassociar Papel Não Quebra Estado
- `attachRoleToCard()` sempre chama `applyCharacterState()`
- `detachRole()` sempre chama `applyCharacterState()`
- Estado sempre sincronizado com DOM

### 5. Lógica Única em Todos os Modos
- Tutorial: usa `K.runStartTurn()`
- Modo Livre: usa `K.runStartTurn()`
- Capítulos 1-5: usam `K.runStartTurn()`
- Zero duplicação de lógica

---

## Fluxo de Dados

```
1. INICIALIZAÇÃO (uma vez)
   └─> Role.constructor()
       └─> _recalculateEfficiencies()
           └─> Define eficienciaState0, State2, State3, State6

2. ASSOCIAÇÃO A CARD
   └─> attachRoleToCard()
       └─> applyCharacterState()
           └─> Define data-role-type, data-assigned="true", data-column
               └─> CSS mostra estado correspondente

3. EXECUÇÃO DE TURNO (runStartTurn)
   └─> Para cada papel associado:
       ├─> Identifica coluna do card
       ├─> Chama roleModel.getActiveEfficiency(colName)
       │   └─> Retorna eficienciaState correto (leitura pura)
       ├─> Sorteia valor entre 1 e eficiência ativa
       └─> Subtrai do indicador da coluna

4. MUDANÇA DE COLUNA
   └─> Card arrastado para nova coluna
       └─> applyCharacterState() atualiza data-column
           └─> CSS atualiza display automaticamente
               └─> Próximo turno usa nova eficiência

5. DESASSOCIAÇÃO
   └─> detachRole()
       └─> applyCharacterState()
           └─> data-assigned="false", remove data-column
               └─> CSS mostra estado 0 (neutro)
```

---

## Pontos Únicos de Lógica

### 📍 Cálculo de Eficiência
**Arquivo**: `src/roleModel.js`  
**Método**: `getActiveEfficiency(columnName)`  
**Linha**: ~177

### 📍 Progresso de Cards
**Arquivo**: `src/gameLogic.js`  
**Função**: `K.runStartTurn()`  
**Linha**: ~107 (uso de `getActiveEfficiency`)

### 📍 Cálculo de Ajustes
**Arquivo**: `src/adjustmentsRules.js`  
**Função**: `getAssignedRoleInfo()`  
**Linha**: ~17 (uso de `getActiveEfficiency`)

### 📍 Sincronização de Estado
**Arquivo**: `src/roleModel.js`  
**Função**: `K.applyCharacterState()`  
**Linha**: ~52

---

## Estrutura de Estados

### Estados Pré-calculados (Role)
```javascript
// Criados no constructor, imutáveis após criação
this.felicidadeState0 = 0
this.felicidadeState2 = 2
this.felicidadeState3 = 3  // só Programador
this.felicidadeState6 = 6

this.eficienciaState0 = talentoNatural + 0
this.eficienciaState2 = talentoNatural + 2
this.eficienciaState3 = talentoNatural + 3  // só Programador
this.eficienciaState6 = talentoNatural + 6
```

### Mapeamento Cargo → Coluna → Estado

| Cargo       | Coluna Favorita | Estado | Outras Colunas | Estado |
|-------------|-----------------|--------|----------------|--------|
| Analista    | Refinamento     | 6      | Qualquer       | 2      |
| Programador | Fazendo         | 6      | Qualquer       | 2      |
| Programador | Ajustes         | 3      | -              | -      |
| QA/Tester   | Homologando     | 6      | Qualquer       | 2      |

---

## Atributos de Controle (data-*)

### No elemento `.role`
- `data-role`: Nome completo ("Analista 1", "Programador 2", etc.)
- `data-role-type`: Tipo normalizado ("analista", "programador", "qa")
- `data-assigned`: "true" ou "false" (se está associado a card)
- `data-column`: Nome da coluna em lowercase ("refinamento", "fazendo", etc.)

### Responsabilidade
- **JavaScript**: Define APENAS os atributos (contexto)
- **CSS**: Decide o que mostrar baseado nos atributos (apresentação)
- **Separação total** entre lógica e visualização

---

## Métodos Obsoletos

### ❌ NÃO USAR
```javascript
roleModel.aumentarFelicidade()  // Obsoleto
roleModel.diminuirFelicidade()  // Obsoleto
roleModel.eficiencia            // Obsoleto (exceto office panel)
```

### ✅ USAR
```javascript
roleModel.getActiveEfficiency(columnName)  // Método principal
```

---

## Verificações de Integridade

### Checklist de Revisão
- [ ] `getActiveEfficiency()` não modifica valores
- [ ] `runStartTurn()` usa `getActiveEfficiency()`
- [ ] `attachRoleToCard()` chama `applyCharacterState()`
- [ ] `detachRole()` chama `applyCharacterState()`
- [ ] Nenhum código acumula modificadores temporários
- [ ] Nenhum código usa `aumentarFelicidade()` ou `diminuirFelicidade()`
- [ ] `_recalculateEfficiencies()` só é chamado em `constructor` e `fromJSON`
- [ ] CSS `role-states.css` tem regras para todas as combinações

---

## Exemplo de Uso

```javascript
// 1. Criar personagem (uma vez)
const analista = new Role('Analista 1', 2)
// Estados calculados:
// - eficienciaState0 = 2
// - eficienciaState2 = 4
// - eficienciaState6 = 8

// 2. Associar a card em Refinamento
attachRoleToCard(roleEl, cardEl)  // coluna = "Refinamento"
// applyCharacterState() define:
// - data-role-type="analista"
// - data-assigned="true"
// - data-column="refinamento"

// 3. Durante turno
K.runStartTurn()
// gameLogic.js chama:
const eff = roleModel.getActiveEfficiency('Refinamento')
// retorna: 8 (eficienciaState6)
// sorteia entre 1-8
// subtrai do indicador

// 4. Mover card para Fazendo
// applyCharacterState() atualiza:
// - data-column="fazendo"

// 5. Próximo turno
const eff = roleModel.getActiveEfficiency('Fazendo')
// retorna: 4 (eficienciaState2)
// analista não está na coluna favorita
```

---

## Últimas Modificações

**Data**: 2026-01-02  
**Commit**: feat: eficiência ativa baseada na coluna do card  

**Alterações**:
- Criado `getActiveEfficiency()` como ponto único de leitura
- Comentados métodos obsoletos `aumentarFelicidade/diminuirFelicidade`
- Adicionada documentação inline em `gameLogic.js` e `roleModel.js`
- Consolidada arquitetura em documento único

**Garantias Verificadas**:
✅ Nenhum recálculo dinâmico  
✅ Nenhuma acumulação de valores  
✅ Trocar coluna funciona corretamente  
✅ Reassociar papel não quebra estado  
✅ Lógica única em todos os modos  
