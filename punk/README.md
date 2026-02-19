# 🏃 RonyOffice PUNK - Runner Game

## 📝 Descrição Geral

**RonyOffice PUNK Runner** é um mini-game estilo endless runner inspirado no jogo do dinossauro do Chrome. O jogador controla um personagem que corre automaticamente para a direita, desviando de obstáculos através de pulos e um sistema único de teia inspirado em jogos de teia de aranha.

Este é um easter egg isolado do jogo RonyOffice, acessível através de uma aranha clicável (🕷️) na homepage.

---

## 🎯 Objetivo do Jogador

**Percorrer a maior distância possível sem colidir com obstáculos.**

- **Meta de vitória**: Alcançar **99.999 metros**
- **Sistema de recorde**: O jogo armazena automaticamente a melhor distância alcançada

---

## 🎮 Como Jogar

### Início do Jogo
1. Clique no botão **"Começar"** na tela inicial
2. O personagem começa a correr automaticamente para a direita
3. O jogo roda até ocorrer uma colisão ou você vencer

### Controle
O jogo possui **apenas um botão de controle**: **"Pular 🕸️"**

- **Primeiro toque** (quando no chão): Executa um **pulo vertical normal**
- **Segundo toque** (quando no ar): Dispara uma **teia para o teto**
- **Segurar o botão** (durante a teia): Mantém o personagem **pendurado**
- **Soltar o botão** (durante a teia): Libera o personagem em **queda livre**

---

## 📋 Regras do Jogo

### Estados do Personagem
O personagem possui 3 estados principais:

1. **No Chão**: Correndo normalmente
2. **Pulando**: Após pressionar o botão pela primeira vez
3. **Balançando**: Após pressionar o botão pela segunda vez no ar (usando teia)

### Mecânica de Pulo
- O personagem sobe verticalmente ao pular
- A gravidade aplica-se automaticamente durante o pulo
- Ao tocar o chão, o personagem retorna ao estado de corrida

### Obstáculos
O jogo possui **3 categorias de obstáculos** representados por **emojis de carros**:

#### Carros Pequenos 🚗🚕🚙🚓
- **Dimensões**: 100px × 100px (escalável com o canvas)
- **Variação aleatória**: 
  - 🚗 Carro vermelho
  - 🚕 Táxi
  - 🚙 Jipe/SUV azul
  - 🚓 Carro de polícia
- **Hitbox ajustado**: 80px × 70px (borda verde no debug)
  - Topo: -25%, Base: -5%, Laterais: -10%

#### Carros Médios 🚐🚎
- **Dimensões**: 115px × 115px (15% maior que pequenos)
- **Variação aleatória**: 
  - 🚐 Minibus
  - 🚎 Trólebus
- **Hitbox ajustado**: 92px × 80.5px (borda verde no debug)
  - Topo: -25%, Base: -5%, Laterais: -10%

#### Carros Grandes 🚌🚚🚛
- **Dimensões**: 110px × 110px (10% maior que pequenos)
- **Variação aleatória**: 
  - 🚌 Ônibus
  - 🚚 Caminhão de entrega
  - 🚛 Caminhão articulado
- **Hitbox ajustado**: 104px × 91px (borda verde no debug)
  - Reduções ajustadas para manter hitbox consistente
  - Topo: -12.73%, Base: -4.55%, Laterais: -2.73%

#### Características Comuns
- **Posição**: Alinhados ao asfalto
- **Spawn**: A cada **2 segundos**, um carro aleatório aparece (qualquer categoria)
- **Colisão**: Colidir com qualquer carro causa **colisão** (pode ser game over ou perder guitarra)
- **Hitbox**: Todas as categorias usam hitbox verde com mesmas proporções de redução

---

## 🎸 Sistema de Guitarra (Vida Extra)

### Item Coletável: Guitarra 🎸
A guitarra funciona como uma **vida extra** e modifica drasticamente o gameplay.

**Aparência visual:**
- Círculo roxo escuro (#4A0E4E)
- Borda dourada (#FFD700)
- Emoji 🎸 no centro
- Tamanho: 30px de diâmetro

### Spawn da Guitarra

#### 1. Primeiro Spawn (100-150m)
- Aparece **aleatoriamente** entre **100m e 150m**
- Posicionada em altura alcançável apenas com pulo
- Exemplo: pode aparecer aos 127m, 135m, 142m, etc.

#### 2. Spawn Após Perder Guitarra (X + 300m)
- Se você **bater em um obstáculo** tendo a guitarra (aos X metros)
- A próxima guitarra aparecerá em **X + 300 metros**
- Exemplo: Bateu aos 250m → próxima guitarra aos 550m

#### 3. Spawn Normal (150-200m)
- Se você **não tem guitarra**, ela aparece a cada **150-200m** (aleatório)
- Intervalo varia para tornar o jogo menos previsível

**Importante:** Enquanto você **tiver a guitarra**, nenhuma outra guitarra spawna!

### Efeitos ao Coletar a Guitarra

Ao pegar a guitarra 🎸:

1. ✅ **Sprites mudam** de `corre-rony-spritesheet.png` para `corre-punk-spritesheet.png`
2. ✅ **5 teias disponíveis** ao tocar o chão (vs. 1 teia normal)
3. ✅ **Proteção contra 1 colisão** (vida extra ativa)
4. ✅ **HUD exibe "🕷️ Teias: X"** em dourado
5. ✅ **Modo PUNK ativado** visualmente

### Sistema de Vida Extra

**Comportamento em colisões:**

#### COM GUITARRA (Proteção Ativa)
- **Primeira colisão**: Perde a guitarra mas continua jogando
- Volta para sprite normal (`corre-rony-spritesheet.png`)
- Volta para **1 teia** por salto
- Salva a distância da colisão para próximo spawn (+300m)
- **Jogo continua normalmente**

#### SEM GUITARRA
- **Qualquer colisão**: Game Over imediato
- Funciona como o jogo tradicional

**Exemplo de gameplay:**
```
0m    → Começa sem guitarra (1 teia)
127m  → Pega guitarra (5 teias, sprite punk)
250m  → Bate em obstáculo → PERDE GUITARRA (volta 1 teia, sprite normal)
550m  → Guitarra spawna novamente (250m + 300m)
550m  → Pega guitarra novamente (5 teias, sprite punk)
700m  → Bate em obstáculo → GAME OVER (não tinha guitarra)
```

---

## 🕸️ Mecânica da Teia

### Como Funciona
1. Ao pressionar o botão **pela segunda vez no ar**, uma teia é disparada para o teto
2. A teia cria um **ponto fixo de ancoragem** à frente do personagem
3. Enquanto o botão estiver **pressionado**, o personagem permanece pendurado
4. A teia permite atravessar obstáculos com mais controle

### Limite de Teias

#### Modo Normal (Sem Guitarra)
- O jogador pode usar **1 teia** por salto
- Ao **tocar o chão**, a teia é **recarregada automaticamente**

#### Modo PUNK (Com Guitarra)
- O jogador pode usar **5 teias** por salto
- Ao **tocar o chão**, as **5 teias** são **recarregadas automaticamente**
- Permite travessias muito mais longas e estratégicas

### Condições de Liberação
A teia se desfaz automaticamente quando:

1. O **botão é solto** pelo jogador
2. O **ponto de ancoragem passa para trás** do personagem (limite de alcance)

Após soltar a teia, o personagem entra em queda livre até tocar o chão.

---

## 📏 Sistema de Distância e Vitória

### Contagem de Distância
- A distância é medida em **metros**
- A cada **1 segundo de jogo**, o personagem percorre **10 metros**
- A distância aumenta de **1 em 1 metro** continuamente
- O contador exibe a distância no formato `00000` (5 dígitos)

### Vitória
- Ao atingir **99.999 metros**, o jogador **vence o jogo**
- Uma tela de vitória é exibida com a mensagem: **"Você venceu!"**
- A distância de vitória é registrada como recorde

### Recorde
- O jogo armazena o **melhor desempenho** (maior distância alcançada)
- O recorde é exibido permanentemente no HUD durante a partida
- Aparece no formato `Recorde: 00000 m`

---

## 🎨 Sprites e Animações

### Spritesheet do Personagem Normal
**Arquivo**: `corre-rony-spritesheet.png`

**Dimensões totais**: 384px × 128px

**Organização em grade**:
- **Tamanho de cada frame**: 64px × 64px
- **Organização**: 2 linhas × 6 colunas

**Uso:** Sprite padrão usado quando o jogador **não tem guitarra**

### Spritesheet do Personagem PUNK
**Arquivo**: `corre-punk-spritesheet.png`

**Dimensões totais**: 384px × 128px

**Organização em grade**: Idêntica ao sprite normal
- **Tamanho de cada frame**: 64px × 64px
- **Organização**: 2 linhas × 6 colunas

**Uso:** Sprite alternativo usado quando o jogador **tem guitarra** 🎸

### Mapeamento de Frames (Ambos Sprites)

#### Primeira Linha (Y = 0)
Frames **1 a 6**: Animação de corrida
- Frame 1: Pose inicial da corrida
- Frame 2: Segundo passo
- Frame 3: Terceiro passo
- Frame 4: Quarto passo
- Frame 5: Quinto passo
- Frame 6: Sexto passo

#### Segunda Linha (Y = 64)
- **Frame 1** (X = 0): Sprite de **pulo/voo** (usado quando o personagem está no ar)
- **Frame 2** (X = 64): Sprite **pendurado na teia**

### Lógica de Animação

**No chão**:
- Os 6 frames da primeira linha são exibidos em **loop contínuo**
- Troca de frame a cada **100ms** (10 frames por segundo)
- Sequência: Frame 1 → 2 → 3 → 4 → 5 → 6 → volta ao 1

**No ar (pulando)**:
- Exibe o **frame de pulo** da segunda linha (X=0, Y=64)
- Frame estático (sem animação)

**Balançando (teia ativa)**:
- Exibe o **frame pendurado** da segunda linha (X=64, Y=64)
- Frame estático (sem animação)

**Troca de sprite:**
- Ao **coletar guitarra**: Muda de `corre-rony-spritesheet.png` → `corre-punk-spritesheet.png`
- Ao **perder guitarra**: Muda de `corre-punk-spritesheet.png` → `corre-rony-spritesheet.png`

---

## 🛠️ Estrutura de Arquivos

```
/punk/
  ├── config.js                      # Configurações e constantes do jogo
  ├── state.js                       # Estado global do jogo
  ├── physics.js                     # Física do personagem e pêndulo
  ├── input.js                       # Controles e detecção de input
  ├── obstacles.js                   # Sistema de obstáculos
  ├── buildings.js                   # Cenário de prédios
  ├── items.js                       # Sistema de itens coletáveis (guitarra)
  ├── collisions.js                  # Detecção de colisões
  ├── renderer.js                    # Renderização e desenho
  ├── game.js                        # Loop principal do jogo
  ├── punk-style.css                 # Estilos visuais
  ├── assets/
  │   ├── corre-rony-spritesheet.png      # Sprite normal
  │   └── corre-punk-spritesheet.png      # Sprite punk (com guitarra)
  └── README.md                      # Esta documentação

/punk.html                           # Página HTML do mini-game
```

**Arquitetura modular:** O jogo foi dividido em 9 módulos JavaScript para facilitar manutenção e debug.

---

## 🎮 Interface de Jogo (HUD)

### Elementos Visuais
- **Distância**: Exibe a distância percorrida em metros (`00000 m`)
- **Recorde**: Exibe a melhor distância alcançada (`00000 m`)
- **Teias** (quando tem guitarra): Exibe `🕷️ Teias: X` em dourado
- **Botão "Começar"**: Inicia o jogo (visível apenas antes de começar)
- **Botão "Reiniciar"**: Aparece após Game Over para recomeçar
- **Botão "Voltar"**: Retorna ao menu principal
- **Botão "Pular 🕸️"**: Controle único do jogador (sempre visível)
- **Canvas de Jogo**: Área 800px × 400px onde o jogo é renderizado

### Elementos no Canvas
- **Céu azul**: Fundo com cor #5DADE2
- **Prédios**: Cenário de fundo com janelas acesas/apagadas
- **Asfalto**: Chão cinza escuro (#2C2C2C) com 120px de altura
- **Faixa tracejada**: Linha branca no meio da pista (animada)
- **Personagem**: Sprite animado (60px × 60px renderizado)
- **Obstáculos**: 5 tipos variados (quadrados vermelhos, buracos)
- **Item Guitarra**: Círculo roxo com borda dourada e emoji 🎸
- **Teia**: Linha branca conectando o personagem ao ponto de ancoragem
- **Ponto de ancoragem**: Círculo branco no teto quando a teia está ativa

### HUD Informativo

**Caixa de HUD (canto superior esquerdo):**
- Fundo: `rgba(0, 0, 0, 0.4)` translúcido
- Borda: Ciano (#22D3EE)
- Fonte: Courier New (estilo futurista)

**Conteúdo:**
```
Distância: 00250 m
Recorde: 00475 m
🕷️ Teias: 5        (apenas se tiver guitarra)
```

---

## 🚫 Isolamento Técnico

Este easter egg foi projetado para ser **completamente independente**:

- ❌ Não importa módulos do jogo principal RonyOffice
- ❌ Não compartilha estado global com o jogo principal
- ❌ Não afeta a gameplay do RonyOffice
- ✅ Pode ser removido sem quebrar o jogo principal
- ✅ Tem seu próprio CSS, JavaScript e assets isolados
- ✅ Roda em página HTML separada (`punk.html`)

---

## 🏗️ Tecnologias

- **HTML5 Canvas**: Renderização de gráficos 2D
- **JavaScript Vanilla** (ES6+): Lógica do jogo
- **CSS3**: Estilização da interface
- **Spritesheet Animation**: Sistema de animação baseado em recortes
- **RequestAnimationFrame**: Loop de jogo otimizado

---

## 🎉 Filosofia do Jogo

> "Simples de aprender, difícil de dominar."

O RonyOffice PUNK Runner oferece uma experiência de jogo minimalista com apenas um botão, mas com mecânicas profundas através do sistema de teia e do item guitarra. O desafio está em:

- Dominar o **timing dos pulos** para desviar de obstáculos variados
- Usar **estrategicamente as teias** (1 ou 5) para atravessar seções difíceis
- **Coletar guitarras** nos momentos certos para ganhar vida extra
- Aproveitar as **5 teias** do modo PUNK para travessias mais ousadas
- Gerenciar o **risco vs recompensa** de pegar ou ignorar guitarras

**Modos de gameplay:**
- **Modo Sobrevivência** (sem guitarra): 1 teia, jogo tradicional, alta tensão
- **Modo PUNK** (com guitarra): 5 teias, vida extra, gameplay mais agressivo

---

## 🐛 Logs de Debug

O jogo inclui logs no console do navegador (F12) para facilitar debug:

**Sistema de Itens:**
- `🎸 Primeira guitarra spawnou aos Xm (alvo: Ym)`
- `🎸 Guitarra spawnou Xm após perder a anterior`
- `🎸 Guitarra spawnou normalmente aos Xm (Ym desde última)`
- `🎸 Guitarra coletada! Modo PUNK ativado! 5 teias disponíveis ao tocar o chão.`
- `🎸 Guitarra saiu da tela sem ser coletada`

**Sistema de Colisão:**
- `💥 Bateu! Perdeu a guitarra (vida extra usada)`
- `💥 Game Over! (sem proteção da guitarra)`

**Sistema de Sprites:**
- `✅ Spritesheet normal do personagem carregado com sucesso!`
- `✅ Spritesheet PUNK do personagem carregado com sucesso!`

---

**Desenvolvido como easter egg do projeto RonyOffice** 🕷️

**Criado por**: Rony  
**Versão**: 2.0.0 (Sistema de Guitarra + Vida Extra)  
**Data**: 2026

🕷️ **Viva a anarquia digital!** 🎸
