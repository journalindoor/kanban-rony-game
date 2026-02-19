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
- Obstáculos vermelhos aparecem no chão a cada **2 segundos**
- Colidir com qualquer obstáculo resulta em **Game Over**
- O jogo registra a distância percorrida até o momento da colisão

---

## 🕸️ Mecânica da Teia

### Como Funciona
1. Ao pressionar o botão **pela segunda vez no ar**, uma teia é disparada para o teto
2. A teia cria um **ponto fixo de ancoragem** à frente do personagem
3. Enquanto o botão estiver **pressionado**, o personagem permanece pendurado
4. A teia permite atravessar obstáculos com mais controle

### Limite de Teias
- O jogador pode usar **no máximo 2 teias** por salto
- Ao **tocar o chão**, as 2 teias são **recarregadas automaticamente**
- Não é possível disparar mais teias após usar as 2 disponíveis no ar

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

### Spritesheet do Personagem
**Arquivo**: `corre-rony-spritesheet.png`

**Dimensões totais**: 384px × 128px

**Organização em grade**:
- **Tamanho de cada frame**: 64px × 64px
- **Organização**: 2 linhas × 6 colunas

### Mapeamento de Frames

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

### Lógica de Animação

**No chão**:
- Os 6 frames da primeira linha são exibidos em **loop contínuo**
- Troca de frame a cada **100ms** (10 frames por segundo)
- Sequência: Frame 1 → 2 → 3 → 4 → 5 → 6 → volta ao 1

**No ar** (pulando ou balançando):
- Exibe o **frame de pulo** da segunda linha (X=0, Y=64)
- Frame estático (sem animação)

---

## 🛠️ Estrutura de Arquivos

```
/punk/
  ├── punk-game.js           # Lógica completa do runner game
  ├── punk-style.css         # Estilos visuais do jogo
  ├── assets/
  │   └── corre-rony-spritesheet.png  # Spritesheet do personagem
  └── README.md              # Esta documentação

/punk.html                   # Página HTML do mini-game
```

---

## 🎮 Interface de Jogo (HUD)

### Elementos Visuais
- **Distância**: Exibe a distância percorrida em metros (`00000 m`)
- **Recorde**: Exibe a melhor distância alcançada (`00000 m`)
- **Botão "Começar"**: Inicia o jogo (visível apenas antes de começar)
- **Botão "Reiniciar"**: Aparece após Game Over para recomeçar
- **Botão "Pular 🕸️"**: Controle único do jogador (sempre visível)
- **Canvas de Jogo**: Área 800px × 400px onde o jogo é renderizado

### Elementos no Canvas
- **Linha do chão**: Linha cinza marcando o limite inferior
- **Personagem**: Sprite animado (60px × 60px renderizado)
- **Obstáculos**: Quadrados vermelhos (40px × 40px)
- **Teia**: Linha branca conectando o personagem ao ponto de ancoragem
- **Ponto de ancoragem**: Círculo branco no teto quando a teia está ativa

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

O RonyOffice PUNK Runner oferece uma experiência de jogo minimalista com apenas um botão, mas com mecânicas profundas através do sistema de teia. O desafio está em dominar o timing dos pulos e o uso estratégico das teias para atravessar obstáculos cada vez mais difíceis.

---

**Desenvolvido como easter egg do projeto RonyOffice** 🕷️

**Criado por**: Rony  
**Versão**: 1.0.0  
**Data**: 2025

🕷️ **Viva a anarquia digital!** 🕷️
