# 🌍 Sistema de Fases - Documentação

## 📋 Visão Geral

O jogo agora possui um **sistema modular de fases** que permite criar infinitos biomas/mapas sem reescrever a lógica do jogo. Todas as configurações visuais e de gameplay são centralizadas na estrutura `Phases`.

## 🏗️ Estrutura de uma Fase

Cada fase contém 4 categorias principais:

```javascript
{
    name: 'Nome da Fase',
    
    // 1. CÉU E FUNDO
    sky: {
        color: '#5DADE2',      // Cor sólida do céu
        gradient: null         // null = cor sólida, ou objeto para gradiente (futuro)
    },
    
    // 2. AMBIENTE (Parallax/Cenário)
    environment: {
        type: 'buildings',              // Tipo de ambiente ('buildings', 'mountains', etc)
        colors: ['#6B7280', '#4B5563'], // Cores dos elementos (prédios, árvores, etc)
        asphaltColor: '#374151',        // Cor do chão/asfalto
        laneColor: '#FFFFFF',           // Cor da faixa tracejada
        windowLightColor: '#FCD34D',    // Janelas acesas
        windowOffColor: '#4B5563'       // Janelas apagadas
    },
    
    // 3. OBSTÁCULOS
    obstacles: {
        types: ['small', 'medium', 'large'], // Tamanhos permitidos
        small: {
            emojis: ['🚗', '🚕'],
            width: 100,
            height: 100
        },
        medium: {
            emojis: ['🚐', '🚎'],
            width: 115,
            height: 115
        },
        large: {
            emojis: ['🚌', '🚚'],
            width: 110,
            height: 110
        }
    },
    
    // 4. ITENS
    items: {
        guitar: {
            enabled: true,              // Habilitar/desabilitar guitarra
            emoji: '🎸',                // Emoji do item
            firstSpawnMin: 100,         // Primeiro spawn: distância mínima
            firstSpawnMax: 150,         // Primeiro spawn: distância máxima
            spawnIntervalMin: 150,      // Spawn normal: intervalo mínimo
            spawnIntervalMax: 200,      // Spawn normal: intervalo máximo
            respawnAfterLoss: 300       // Distância após perder a guitarra
        }
    }
}
```

## 🎮 Como o Sistema Funciona

### Fase Atual
- Variável global: `currentPhaseIndex` (padrão: 0)
- Função para obter: `getCurrentPhase()`
- Todos os sistemas do jogo consultam esta função

### Arquivos Modificados

**config.js**
- Define a estrutura `Phases[]`
- Implementa `getCurrentPhase()` e `setPhase()`

**obstacles.js**
- Usa `getCurrentPhase().obstacles` para spawnar obstáculos
- Respeita os tipos permitidos na fase

**items.js**
- Usa `getCurrentPhase().items.guitar` para configurar spawns
- Verifica se o item está habilitado na fase

**buildings.js**
- Usa `getCurrentPhase().environment.colors` para criar prédios

**renderer.js**
- Usa `getCurrentPhase().sky.color` para o fundo
- Usa `getCurrentPhase().environment` para cores de asfalto, faixas e janelas
- Usa `getCurrentPhase().items.guitar.emoji` para desenhar itens

**game.js**
- Log da fase atual ao iniciar o jogo

## 🚀 Como Criar Novas Fases

### Opção 1: Clonar Fase Existente
```javascript
// Criar Fase 2 como cópia da Fase 0
Phases[2] = JSON.parse(JSON.stringify(Phases[0]));
Phases[2].name = 'Deserto';

// Modificar apenas o que quiser
Phases[2].sky.color = '#FFE4B5'; // Céu alaranjado
Phases[2].environment.colors = ['#D2691E', '#CD853F']; // Tons de areia
Phases[2].obstacles.small.emojis = ['🦂', '🌵']; // Escorpiões e cactos
```

### Opção 2: Criar do Zero
```javascript
Phases[3] = {
    name: 'Floresta',
    sky: { color: '#87CEEB', gradient: null },
    environment: {
        type: 'trees',
        colors: ['#228B22', '#006400', '#32CD32'],
        asphaltColor: '#8B4513',
        laneColor: '#F5DEB3',
        windowLightColor: '#FFD700',
        windowOffColor: '#654321'
    },
    obstacles: {
        types: ['small', 'medium'],
        small: { emojis: ['🐻', '🦌'], width: 80, height: 80 },
        medium: { emojis: ['🌲', '🪵'], width: 100, height: 100 },
        large: { emojis: [], width: 0, height: 0 } // Não usado
    },
    items: {
        guitar: {
            enabled: false, // Sem guitarra na floresta
            emoji: '🎸',
            firstSpawnMin: 0, firstSpawnMax: 0,
            spawnIntervalMin: 0, spawnIntervalMax: 0,
            respawnAfterLoss: 0
        }
    }
};
```

## 🎯 Como Mudar de Fase

### Durante o Jogo (Futuro)
```javascript
// Mudar para fase 2 aos 500 metros
if (State.distance >= 500 && currentPhaseIndex === 0) {
    setPhase(1);
}
```

### No Início do Jogo
```javascript
// No arquivo game.js, antes de startGame()
setPhase(2); // Começar direto na fase 2
```

### Console do Navegador
```javascript
// Abra F12 e digite:
setPhase(1); // Mudar para fase 1
```

## 📊 Fases Atuais

### Fase 0: Cidade (Base)
- ✅ Céu azul
- ✅ Prédios cinzas com janelas
- ✅ Carros pequenos, médios e grandes
- ✅ Guitarra habilitada

### Fase 1: Cidade (Fase 2)
- ✅ Cópia exata da Fase 0
- 🔧 Pronta para ser modificada

## 🎨 Exemplos de Uso

### Desabilitar Guitarra em uma Fase
```javascript
Phases[2].items.guitar.enabled = false;
```

### Apenas Obstáculos Pequenos
```javascript
Phases[2].obstacles.types = ['small'];
```

### Mudar Cores do Céu e Asfalto
```javascript
Phases[2].sky.color = '#FF6347'; // Vermelho
Phases[2].environment.asphaltColor = '#000000'; // Preto
```

### Usar Emojis Diferentes
```javascript
Phases[2].obstacles.small.emojis = ['👽', '🛸', '🚀'];
Phases[2].items.guitar.emoji = '🎺'; // Trompete ao invés de guitarra
```

## ✅ Vantagens do Sistema

1. **Modular**: Cada fase é independente
2. **Escalável**: Adicione infinitas fases sem reescrever código
3. **Flexível**: Modifique apenas o que quiser
4. **Centralizado**: Todas as configs em um só lugar
5. **Fácil de testar**: Mude de fase com uma linha de código

## 🔮 Próximos Passos

- [ ] Implementar transição automática de fases baseada na distância
- [ ] Adicionar gradientes no céu (nascer/pôr do sol)
- [ ] Criar sistema de tipos de ambiente (montanhas, árvores, etc)
- [ ] Adicionar mais tipos de itens coletáveis
- [ ] Sistema de progresso visual na transição entre fases

---

**Sistema implementado e pronto para expansão!** 🌍
