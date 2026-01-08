# 🧪 Checklist de Testes - Sistema de Balões de Emoção

## ✅ Testes Básicos

### 1. Demonstração Isolada
- [ ] Abrir `demo-emotion-bubbles.html` no navegador
- [ ] Clicar em cada botão de emoção
- [ ] Verificar que balão aparece sobre personagem aleatório
- [ ] Confirmar visual do balão (fundo branco, borda cinza, ponta triangular)
- [ ] Verificar animação de entrada (pop suave)
- [ ] Verificar animação de saída (fade-out após 2s)
- [ ] Testar cliques rápidos (não deve empilhar balões)

### 2. Integração com Capítulo 1
- [ ] Abrir `chapter1.html`
- [ ] Jogar até desbloquear segundo personagem
- [ ] Atribuir tarefa a um personagem (drag & drop)
- [ ] Verificar que balão 🤘🏽 aparece no canto superior direito
- [ ] Confirmar que visual é o novo (balão branco, não emoji solto)
- [ ] Duração: balão desaparece após ~1.8s

### 3. Modo Livre
- [ ] Abrir `modo-livre.html`
- [ ] Atribuir múltiplas tarefas rapidamente
- [ ] Verificar que cada atribuição mostra o balão
- [ ] Confirmar que não há bugs visuais

### 4. Tutorial
- [ ] Abrir `tutorial.html`
- [ ] Seguir instruções até atribuir primeiro papel
- [ ] Verificar aparição do balão 🤘🏽
- [ ] Confirmar que não interfere com modais do tutorial

## ✅ Testes de Compatibilidade

### 5. Navegadores
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (se disponível)
- [ ] Testar em modo mobile (responsive)

### 6. Performance
- [ ] Atribuir 10 tarefas rapidamente
- [ ] Verificar que não há lag ou travamentos
- [ ] Confirmar que balões antigos são removidos do DOM

## ✅ Testes Visuais

### 7. Posicionamento
- [ ] Balão está no canto superior direito do tile
- [ ] Não sobrepõe nome/cargo do personagem
- [ ] Ponta triangular aponta para baixo/direita
- [ ] Distância adequada das bordas (8px)

### 8. Animações
- [ ] **Entrada:** Aparece de baixo para cima com scale
- [ ] **Permanência:** Estável por 1.8s
- [ ] **Saída:** Diminui e desaparece suavemente (0.3s)
- [ ] Não há "pulos" ou mudanças bruscas

### 9. Estilos
- [ ] Fundo: branco (#ffffff)
- [ ] Borda: 2px cinza claro (#d0d0d0)
- [ ] Cantos: arredondados (12px)
- [ ] Sombra: visível mas sutil
- [ ] Emoji: 24px, centralizado, legível

## ✅ Testes de Acessibilidade

### 10. ARIA
- [ ] Elemento tem `aria-hidden="true"`
- [ ] Elemento tem `role="presentation"`
- [ ] Não atrapalha navegação por teclado
- [ ] Screen reader ignora elemento (decorativo)

### 11. Interação
- [ ] `pointer-events: none` - clique passa através do balão
- [ ] Possível clicar no personagem mesmo com balão ativo
- [ ] Não bloqueia funcionalidades do tile

## ✅ Testes de Código

### 12. Console
- [ ] Abrir DevTools → Console
- [ ] Não há erros JavaScript
- [ ] Não há warnings de console
- [ ] Executar: `Kanban.showEmotionBubble('analista-1', '😷', 2000)`
- [ ] Verificar que comando funciona manualmente

### 13. API
```javascript
// Testar no console do navegador:

// Teste 1: Função existe
typeof Kanban.showEmotionBubble === 'function'
// Esperado: true

// Teste 2: Alias existe
typeof Kanban.showAssignmentCelebration === 'function'
// Esperado: true

// Teste 3: Exibir emoji personalizado
Kanban.showEmotionBubble('analista-1', '😷', 2000)
// Esperado: Balão aparece com emoji de máscara

// Teste 4: Teste com emoji não comum
Kanban.showEmotionBubble('programador-2', '🚀', 1500)
// Esperado: Balão aparece com foguete

// Teste 5: Alias funciona
Kanban.showAssignmentCelebration('qa-1')
// Esperado: Balão aparece com 🤘🏽 (padrão)
```

## ✅ Testes de Edge Cases

### 14. Casos Extremos
- [ ] Chamar função com characterId inválido → Console warning, sem crash
- [ ] Chamar função sem emoji → Deve usar padrão ou dar erro claro
- [ ] Chamar função com duration = 0 → Balão aparece e some imediatamente
- [ ] Chamar função com duration muito longo (10000ms) → Funciona normalmente
- [ ] Tentar empilhar balões (múltiplas chamadas rápidas) → Apenas um visível por vez

### 15. Responsividade
- [ ] Testar em tela pequena (mobile 375px)
- [ ] Testar em tela média (tablet 768px)
- [ ] Testar em tela grande (desktop 1920px)
- [ ] Balão sempre visível dentro do tile
- [ ] Ponta do balão não fica cortada

## ✅ Testes de Regressão

### 16. Funcionalidades Existentes
- [ ] Drag & drop de papéis continua funcionando
- [ ] Sistema de desbloquear personagens funciona
- [ ] Modais de narrativa não são afetados
- [ ] Status bar atualiza corretamente
- [ ] Sistema de save/load não quebrou
- [ ] Animações de dinheiro funcionam
- [ ] Celebração de meta funciona

### 17. CSS Não Vaza
- [ ] Estilos do balão não afetam outros elementos
- [ ] `.video-tile` ainda funciona normalmente
- [ ] Outros modais não são afetados
- [ ] Layout geral permanece intacto

## 🐛 Bugs Conhecidos/Possíveis

Documentar aqui se encontrar algum problema:

```
[ ] Bug 1: _______________________________________________
    Descrição: 
    Reprodução: 
    Severidade: [CRÍTICO/ALTO/MÉDIO/BAIXO]

[ ] Bug 2: _______________________________________________
    Descrição: 
    Reprodução: 
    Severidade: [CRÍTICO/ALTO/MÉDIO/BAIXO]
```

## 📊 Resultado Final

- **Total de testes:** 60+
- **Testes passados:** _____ / _____
- **Testes falhos:** _____ / _____
- **Bugs encontrados:** _____
- **Status geral:** [ ] APROVADO / [ ] REPROVADO / [ ] NECESSITA AJUSTES

## 🎯 Próximas Ações

Após aprovação dos testes:
- [ ] Commit das mudanças
- [ ] Atualizar README se necessário
- [ ] Criar issue para sistema de eventos futuros
- [ ] Planejar implementação de estados adicionais (capítulo 2+)

---

**Testado por:** _______________  
**Data:** _______________  
**Navegador:** _______________  
**Observações:** _______________
