# RESUMO VISUAL — INFRAESTRUTURA DO TUTORIAL

```
┌─────────────────────────────────────────────────────────────┐
│                     KANBAN RONY GAME                        │
│                    SISTEMA DE TUTORIAL                      │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════
 MODELO CONCEITUAL: 3 PILARES
═══════════════════════════════════════════════════════════════

┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  ORQUESTRADOR   │   │  GUIA REATIVO   │   │ FILTRO DE AÇÕES │
│   DE ESTADOS    │   │                 │   │                 │
│                 │   │  Observa eventos│   │  Bloqueia/      │
│  Controla qual  │   │  REAIS do jogo  │   │  Permite ações  │
│  passo está     │   │  (não simula)   │   │  específicas    │
│  ativo          │   │                 │   │                 │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                     │
         └──────────────┬──────┴──────┬──────────────┘
                        ▼             ▼
              ┌──────────────────────────────┐
              │   TUTORIAL CONTROLLER        │
              │   (Orquestrador Central)     │
              └──────────────────────────────┘


═══════════════════════════════════════════════════════════════
 ARQUITETURA DE 4 MÓDULOS
═══════════════════════════════════════════════════════════════

┌────────────────────────────────────────────────────────────┐
│                    tutorial.state.js                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  tutorialActive = true (FLAG GLOBAL)                 │ │
│  │  currentStep = 0                                     │ │
│  │  allowedActions = { startTurn: false, ... }          │ │
│  │  pendingCallbacks = {}                               │ │
│  └──────────────────────────────────────────────────────┘ │
│  Funções:                                                  │
│  • isActionAllowed(action)                                 │
│  • allowAction() / blockAction()                           │
│  • registerCallback() / executeCallback()                  │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                     tutorial.ui.js                         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  elements = { messageBox, title, text, buttons }     │ │
│  └──────────────────────────────────────────────────────┘ │
│  Funções:                                                  │
│  • show() / hide()                                         │
│  • setMessage(title, text)                                 │
│  • highlightElement(selector)                              │
│  • updateStepCounter()                                     │
│                                                            │
│  REGRA: ❌ SEM overlay opaco, ✅ jogo sempre visível      │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                    tutorial.steps.js                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  TutorialSteps = [                                   │ │
│  │    {                                                 │ │
│  │      title: 'Bem-vindo',                             │ │
│  │      message: '<p>HTML</p>',                         │ │
│  │      highlight: '#elemento',                         │ │
│  │      allowedActions: ['startTurn'],                  │ │
│  │      onEnter: fn,                                    │ │
│  │      onExit: fn,                                     │ │
│  │      waitFor: 'evento'                               │ │
│  │    }                                                 │ │
│  │  ]                                                   │ │
│  └──────────────────────────────────────────────────────┘ │
│  Estado: [] (vazio por enquanto)                           │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                  tutorial.controller.js                    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  HOOKS NÃO-INVASIVOS:                                │ │
│  │  1. Preserva função original                         │ │
│  │  2. Verifica isActionAllowed()                       │ │
│  │  3. Executa original se permitido                    │ │
│  │  4. Notifica executeCallback()                       │ │
│  └──────────────────────────────────────────────────────┘ │
│  Funções:                                                  │
│  • init()                                                  │
│  • hookGameActions() → instala 7 hooks                    │
│  • showCurrentStep()                                       │
│  • nextStep() / previousStep()                             │
│  • skip() / finish()                                       │
└────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════
 FLUXO DE EXECUÇÃO
═══════════════════════════════════════════════════════════════

[1] INICIALIZAÇÃO
    │
    ├─► DOMContentLoaded
    ├─► if tutorialActive === true
    ├─► TutorialController.init()
    │   ├─► TutorialState.reset()
    │   ├─► TutorialUI.init()
    │   ├─► hookGameActions()
    │   └─► showCurrentStep()
    │
    └─► Tutorial ativo!


[2] JOGADOR TENTA AÇÃO (ex: clicar "Iniciar Turno")
    │
    ├─► Hook intercepta: window.startTurn()
    │
    ├─► Verifica: isActionAllowed('startTurn')
    │   │
    │   ├─► false → BLOQUEIA (return)
    │   │
    │   └─► true  → Executa original.call(this)
    │               │
    │               └─► executeCallback('startTurn')
    │                   │
    │                   └─► Tutorial reage (nextStep, etc)


[3] NAVEGAÇÃO MANUAL
    │
    ├─► Jogador clica "Próximo"
    │
    ├─► TutorialController.nextStep()
    │   │
    │   ├─► currentStep.onExit()
    │   ├─► currentStep++
    │   └─► showCurrentStep()
    │       │
    │       ├─► blockAllActions()
    │       ├─► allowActions(step.allowedActions)
    │       ├─► UI.setMessage(title, message)
    │       ├─► UI.highlightElement(selector)
    │       ├─► step.onEnter()
    │       ├─► UI.show()
    │       └─► if waitFor: registerCallback()


═══════════════════════════════════════════════════════════════
 ESTRUTURA VISUAL DA UI
═══════════════════════════════════════════════════════════════

                    JOGO (sempre visível)
   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │  ┌────────────┐  ┌────────────┐  ┌────────────┐│
   │  │  Backlog   │  │   Doing    │  │    Done    ││
   │  └────────────┘  └────────────┘  └────────────┘│
   │                                      ┌──────────┤
   │                                      │ Tutorial │
   │                                      │┌────────┐│
   │                                      ││ 1 / 6  ││
   │                                      │├────────┤│
   │                                      ││Título  ││
   │                                      ││Mensagem││
   │                                      │├────────┤│
   │                                      ││< Pular>││
   │                                      │└────────┘│
   └──────────────────────────────────────┴──────────┘
                                           ▲
                                           │
                                    Floating Box
                                    (top: 20px, right: 20px)
                                    SEM backdrop opaco


═══════════════════════════════════════════════════════════════
 SISTEMA DE HOOKS
═══════════════════════════════════════════════════════════════

FUNÇÕES HOOKADAS (7):
┌───────────────────┬─────────────────────────────────────────┐
│ Ação              │ Descrição                               │
├───────────────────┼─────────────────────────────────────────┤
│ startTurn         │ Botão "Iniciar Turno"                   │
│ resetGame         │ Botão "Reiniciar"                       │
│ toggleArchived    │ Botão "Arquivados"                      │
│ dragCard          │ Drag & Drop de cartas                   │
│ dragRole          │ Drag & Drop de papéis                   │
│ moveCardButton    │ Botões de mover carta (←→)             │
│ removeRole        │ Botão × para remover papel              │
└───────────────────┴─────────────────────────────────────────┘


PADRÃO DE HOOK:
┌────────────────────────────────────────────────────────────┐
│  const original = window.nomeAcao;                         │
│  window.nomeAcao = function() {                            │
│    if (!TutorialState.isActionAllowed('nomeAcao')) {       │
│      return; // BLOQUEIA                                   │
│    }                                                       │
│    original.call(this); // EXECUTA ORIGINAL               │
│    TutorialState.executeCallback('nomeAcao'); // NOTIFICA │
│  };                                                        │
└────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════
 GARANTIAS TÉCNICAS
═══════════════════════════════════════════════════════════════

✅ Funções originais 100% preservadas
✅ Zero lógica fake / simulação
✅ Estado do jogo isolado
✅ Interface não-bloqueante (sem overlay opaco)
✅ Sistema de callbacks robusto
✅ Navegação bidirecional
✅ Auto-start via DOMContentLoaded


═══════════════════════════════════════════════════════════════
 CHECKLIST DE VALIDAÇÃO
═══════════════════════════════════════════════════════════════

[✓] tutorial.state.js criado
[✓] tutorial.ui.js criado
[✓] tutorial.steps.js criado (vazio por enquanto)
[✓] tutorial.controller.js criado
[✓] tutorial.css criado (sem overlay opaco)
[✓] tutorial.html com IDs corretos
[✓] Hooks preservam funções originais
[✓] Flag tutorialActive = true
[✓] Sistema de allowedActions funcional
[✓] Sistema de callbacks funcional
[✓] UI não escurece tela
[✓] Message box flutuante (top-right)
[✓] Highlights sem bloquear jogo
[✓] Navegação entre passos
[✓] Zero erros de sintaxe


═══════════════════════════════════════════════════════════════
 PRÓXIMO: CONTEÚDO PEDAGÓGICO
═══════════════════════════════════════════════════════════════

BLOCO 1: Boas-vindas e contexto (6 passos)
BLOCO 2: Primeiro turno
BLOCO 3: Movendo cartas
BLOCO 4: Alocando papéis
BLOCO 5: Estratégia e finalização


═══════════════════════════════════════════════════════════════
STATUS: ✅ INFRAESTRUTURA TÉCNICA COMPLETA
═══════════════════════════════════════════════════════════════
```
