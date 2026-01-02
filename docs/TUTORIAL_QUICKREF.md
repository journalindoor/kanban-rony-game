# ⚡ REFERÊNCIA RÁPIDA — TUTORIAL SYSTEM

**1 página | Tudo que você precisa saber**

---

## 🎯 O QUE É

Sistema de tutorial modular para Kanban Rony Game.  
**3 pilares:** Orquestrador + Guia Reativo + Filtro de Ações

---

## 📂 ARQUIVOS

```
src/
  tutorial.state.js     → Estado (Flag tutorialActive)
  tutorial.ui.js        → Interface visual
  tutorial.steps.js     → Array de passos (VAZIO)
  tutorial.controller.js → Orquestrador + Hooks
css/
  tutorial.css          → Estilo (SEM overlay opaco)
tutorial.html           → HTML com tutorial
```

---

## 🔧 COMO FUNCIONA

### Flag Global
```javascript
tutorialActive = true  // Tutorial ativo
```

### Sistema de Filtro
```javascript
allowedActions: {
  startTurn: false,
  resetGame: false,
  toggleArchived: false,
  dragCard: false,
  dragRole: false,
  moveCardButton: false,
  removeRole: false
}
```

### Hooks (7 ações)
```javascript
// Padrão
const original = window.acao;
window.acao = function() {
  if (!isActionAllowed('acao')) return;
  original.call(this);
  executeCallback('acao');
};
```

---

## 📝 ADICIONAR PASSO

Editar `src/tutorial.steps.js`:

```javascript
K.TutorialSteps = [
  {
    title: 'Título',
    message: '<p>HTML</p>',
    highlight: '#seletor',
    allowedActions: ['startTurn'],
    onEnter: null,
    onExit: null,
    waitFor: 'startTurn'  // opcional
  }
];
```

---

## 🎨 INTERFACE

- **Position:** `fixed; top: 20px; right: 20px`
- **Width:** `380px`
- **Z-index:** `9999`
- **Regra:** ❌ SEM overlay opaco ✅ Jogo visível

---

## 🪝 HOOKS INSTALADOS

| Hook | Descrição |
|------|-----------|
| `startTurn` | Botão "Iniciar Turno" |
| `resetGame` | Botão "Reiniciar" |
| `toggleArchived` | Botão "Arquivados" |
| `dragCard` | Drag & Drop de cartas |
| `dragRole` | Drag & Drop de papéis |
| `moveCardButton` | Botões ←→ |
| `removeRole` | Botão × |

---

## 🎯 SELETORES ÚTEIS

```javascript
'#startButton'              // Botão Iniciar Turno
'#kanbanBoard'              // Board completo
'.column[data-col="Backlog"]'  // Coluna Backlog
'#rolesArea'                // Área de papéis
'.kanban-card'              // Carta
```

---

## 🔍 DEBUG

```javascript
// Console
TutorialState.currentStep
TutorialState.allowedActions
Kanban.TutorialController.skip()
```

---

## 📚 DOCUMENTAÇÃO

| Arquivo | Uso |
|---------|-----|
| `TUTORIAL_README.md` | Visão geral ⭐ |
| `TUTORIAL_INFRASTRUCTURE.md` | Técnico 🏗️ |
| `TUTORIAL_VISUAL_SUMMARY.md` | Diagramas 🎨 |
| `TUTORIAL_CONTENT_GUIDE.md` | Conteúdo 📝 |
| `TUTORIAL_CHECKLIST.md` | Validação ✅ |
| `TUTORIAL_INDEX.md` | Índice 📑 |
| `TUTORIAL_QUICKREF.md` | Este arquivo ⚡ |

---

## ✅ STATUS

- [x] Infraestrutura completa
- [x] Hooks funcionais
- [x] UI sem overlay opaco
- [ ] Conteúdo pedagógico (Blocos 1-5)

---

## 🚀 INÍCIO RÁPIDO

1. Abrir `tutorial.html`
2. Editar `src/tutorial.steps.js`
3. Adicionar passos
4. Testar

---

## 📊 ESTATÍSTICAS

- **Arquivos JS:** 4 (~560 linhas)
- **CSS:** 1 (~200 linhas)
- **HTML:** 1 (~305 linhas)
- **Docs:** 7 (~2700 linhas)
- **Hooks:** 7
- **Ações:** 7
- **Erros:** 0

---

**✅ PRONTO PARA USAR**
