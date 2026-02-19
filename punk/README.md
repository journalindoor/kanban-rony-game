# 🕷️ RonyOffice PUNK - Easter Egg

## 📝 Descrição

Este é um **easter egg isolado** do jogo RonyOffice. Trata-se de um mini-game completamente independente, acessível através de uma aranha clicável na homepage.

## 🎯 Características

- **100% Isolado**: Nenhum código compartilhado com o jogo principal
- **Tema Punk**: Visual cyberpunk com cores neon e efeitos glitch
- **Jogabilidade Simples**: Clique nos cards para acumular stats e pontos
- **Sistema de Combos**: Clique em 3 cards do mesmo tipo para ganhar bonus
- **Progressão de Níveis**: Atinja metas para subir de nível

## 🎮 Como Jogar

1. Na homepage do RonyOffice, procure a aranha (🕷️) no canto superior direito
2. Clique na aranha para acessar o mini-game
3. Clique em "INICIAR CAOS" para começar
4. Clique nos cards para ganhar pontos e aumentar seus stats
5. Faça combos clicando em 3 cards do mesmo tipo seguidos
6. Atinja 150 pontos totais em stats OU 300 pontos de score para subir de nível

## 📂 Estrutura de Arquivos

```
/punk/
  ├── punk-game.js      # Lógica do jogo (isolada)
  ├── punk-style.css    # Estilos visuais (isolados)
  └── README.md         # Esta documentação

/punk.html              # Página do mini-game
```

## 🚫 Isolamento

Este easter egg foi projetado para ser **completamente independente**:

- ❌ Não importa módulos do jogo principal
- ❌ Não compartilha estado global
- ❌ Não afeta a gameplay do RonyOffice
- ✅ Pode ser removido sem quebrar o jogo principal
- ✅ Tem seu próprio CSS e JavaScript
- ✅ Roda em página separada

## 🎨 Visual

- **Tema**: Cyberpunk / Neon / Glitch
- **Cores**: Magenta (#ff00ff), Ciano (#00ffff), Verde Neon (#00ff00)
- **Efeitos**: Scanlines, glitch, neon glow, animações pulsantes
- **Fonte**: Courier New (monospace)

## 🔥 Stats do Jogo

- **Anarquia**: Aumenta com cards de raio e guitarra
- **Caos**: Aumenta com cards de fogo e alien
- **Rebeldia**: Aumenta com cards de caveira e morcego
- **Score**: Pontuação geral do jogador

## 🏆 Sistema de Combos

Clique em 3 cards do mesmo tipo seguidos para ganhar **+50 pontos bonus**!

## 🌟 Cards Disponíveis

- 🔥 Fogo (Caos)
- ⚡ Raio (Anarquia)
- 💀 Caveira (Rebeldia)
- 🎸 Guitarra (Anarquia)
- 🎮 Game (Caos)
- 🦇 Morcego (Rebeldia)
- 👾 Alien (Caos)
- 🌟 Estrela (Score)
- 💣 Bomba (Tudo)
- E mais...

## 🛠️ Tecnologias

- HTML5
- CSS3 (com animações e gradientes)
- JavaScript Vanilla (ES6+)
- Sem dependências externas

## 📝 Notas de Desenvolvimento

- Código modular usando objeto PunkGame
- Event listeners isolados
- Sistema de mensagens dinâmicas
- Animações CSS performáticas
- Responsivo para mobile

## 🎉 Filosofia

> "No Rules, Just Chaos"
> 
> Este easter egg celebra a rebeldia e o caos de forma divertida,
> oferecendo uma experiência alternativa ao gameplay estruturado
> do RonyOffice principal.

---

**Criado por**: Rony  
**Versão**: 1.0.0  
**Data**: 2025

🕷️ **Viva a anarquia digital!** 🕷️
