# 🔧 Área de DEBUG - Guia de Uso

## 📋 Visão Geral

A área de DEBUG é um painel de controle visual localizado no canto superior direito da tela que permite:
- **Trocar de fases** manualmente durante o jogo
- **Visualizar hitboxes** de todos os elementos

## 🎮 Funcionalidades

### 1. Botões de Fase

**Fase 0** / **Fase 1**
- Clique para mudar imediatamente para a fase desejada
- O botão da fase atual fica destacado (verde brilhante)
- A mudança ocorre instantaneamente, sem reiniciar o jogo
- O ambiente (prédios) é atualizado automaticamente

**Como funciona:**
```javascript
// Ao clicar em "Fase 1":
- currentPhaseIndex = 1
- initBuildings(Config) // Regenera prédios com cores da nova fase
- Próximos obstáculos usam configurações da Fase 1
- Céu, asfalto e cores mudam instantaneamente
```

### 2. Botão HITBOX

**OFF** / **ON**
- Clique para alternar visualização de hitboxes
- **OFF** (vermelho): Hitboxes invisíveis (modo normal)
- **ON** (verde): Todas as hitboxes visíveis

**O que é mostrado quando ON:**
- ✅ Hitbox do **PLAYER** (verde) com label
- ✅ Hitbox de **OBSTÁCULOS** (verde) com tamanho (SMALL/MEDIUM/LARGE)
- ✅ Hitbox do **ITEM GUITARRA** (verde) com label
- ✅ Todas com borda verde de 1px

## 🎨 Aparência

### Visual do Painel
- Fundo preto translúcido
- Borda verde neon
- Título: "🔧 DEBUG"
- Fonte: Courier New (monospace)
- Posição: Canto superior direito
- Z-index: 9998 (fica acima do jogo, mas abaixo de modais)

### Estados dos Botões

**Fase (inativo):**
- Fundo: Verde transparente (10%)
- Borda: Verde
- Texto: Verde

**Fase (ativo):**
- Fundo: Verde sólido
- Borda: Verde
- Texto: Preto
- Brilho: Verde intenso

**Hitbox OFF:**
- Fundo: Vermelho transparente (10%)
- Borda: Vermelha
- Texto: Vermelho

**Hitbox ON:**
- Fundo: Verde sólido
- Borda: Verde
- Texto: Preto
- Brilho: Verde intenso

## 🔧 Uso Durante Testes

### Testar Mudança de Fases
1. Inicie o jogo
2. Clique em "Fase 1" no painel DEBUG
3. Observe:
   - Cores do céu mudam
   - Prédios mudam de cor
   - Novos obstáculos seguem config da Fase 1

### Testar Hitboxes
1. Clique em "HITBOX" para ligar (ON)
2. Observe as caixas verdes ao redor de:
   - Personagem (muda conforme estado: correndo/pulando/pendurado)
   - Carros (diferentes tamanhos: small/medium/large)
   - Guitarra (quando aparecer)
3. Clique novamente para desligar (OFF)

### Ajustar Hitboxes
1. Ligue visualização (HITBOX: ON)
2. Jogue normalmente
3. Observe colisões
4. Se necessário, ajuste valores em `config.js` (hitboxes.*)
5. Recarregue página e teste novamente

## 📱 Responsividade

- **Desktop**: Painel completo no canto superior direito
- **Tablet**: Painel reduzido mas funcional
- **Mobile**: Painel menor com fontes ajustadas

## 🚀 Como Esconder/Remover

### Esconder Temporariamente (CSS)
```css
.debug-panel {
    display: none !important;
}
```

### Remover Permanentemente
1. Deletar elemento HTML: `<div id="debugPanel">` em `punk.html`
2. Remover script: `<script src="punk/debug.js"></script>`
3. Deletar arquivo: `punk/debug.js`
4. Remover CSS: Seção "Área de DEBUG" em `punk-style.css`

### Esconder por JavaScript
```javascript
document.getElementById('debugPanel').style.display = 'none';
```

## 🎯 Atalhos de Teclado (Futuro)

Ideias para implementar:
- **F1**: Toggle painel DEBUG
- **F2**: Toggle hitboxes
- **1/2**: Mudar para Fase 0/1
- **H**: Toggle hitboxes

## 📊 Logs no Console

O sistema de DEBUG exibe logs úteis:

```javascript
🔧 Sistema de DEBUG inicializado
🌍 Mudança de fase: Cidade → Cidade (Fase 2)
🏗️ Ambiente atualizado para nova fase
🔧 Debug Hitbox: ON
🔧 Debug Hitbox: OFF
```

## ⚙️ Arquitetura Técnica

### Variáveis Globais
```javascript
debugHitbox = false; // Controle de visualização
```

### Funções Principais
```javascript
initDebugControls()      // Inicializa listeners
switchPhase(phaseIndex)  // Muda fase e atualiza ambiente
updatePhaseButtons()     // Atualiza visual dos botões
updateHitboxButton()     // Atualiza visual do toggle
drawDebugHitbox()        // Desenha hitbox genérica (não usado atualmente)
```

### Integração com Renderer
```javascript
// Em renderer.js, após desenhar cada elemento:
if (debugHitbox) {
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
}
```

## ✅ Vantagens

1. **Não invasivo**: Não interfere na lógica do jogo
2. **Modular**: Fácil de remover (um arquivo + seção HTML/CSS)
3. **Visual**: Feedback imediato das mudanças
4. **Flexível**: Fácil adicionar novos controles
5. **Útil**: Essencial para balanceamento e testes

---

**Sistema de DEBUG pronto para uso!** 🔧
