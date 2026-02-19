/* ============================================
   Configurações e Constantes do Jogo
   ============================================ */

const Config = {
	canvas: null,
	ctx: null,
	width: 800,
	height: 400,
	
	// Personagem
	playerSize: 60,
	playerColor: '#0088ff',
	playerX: 150, // posição fixa na tela (meio-esquerda)
	groundY: 280, // altura do chão (ajustado para personagem maior)
	playerImage: null, // spritesheet do personagem
	playerImageNormal: null, // referência ao sprite normal
	playerImagePunk: null, // spritesheet punk alternativo
	
	// Hitbox real do personagem por estado (área útil do sprite)
	hitboxes: {
		correndo: {
			offsetX: 19, // 14 + 5px
			offsetY: 5,  // 0 + 5px
			width: 34,   // 44 - 10px (5px de cada lado)
			height: 54   // 64 - 10px (5px de cada lado)
		},
		pulando: {
			offsetX: 20, // 15 + 5px
			offsetY: 5,  // 0 + 5px
			width: 38,   // 48 - 10px (5px de cada lado)
			height: 45   // 55 - 10px (5px de cada lado)
		},
		pendurado: {
			offsetX: 8,  // 3 + 5px
			offsetY: 11, // 6 + 5px
			width: 34,   // 44 - 10px (5px de cada lado)
			height: 42   // 52 - 10px (5px de cada lado)
		}
	},
	
	// Debug
	debugHitbox: true, // visualizar hitbox para depuração
	
	// Animação do spritesheet
	spriteFrameWidth: 64,
	spriteFrameHeight: 64,
	spriteTotalFrames: 6, // 384px / 64px = 6 frames
	spriteFrameInterval: 100, // ms entre frames
	
	// Física
	gravity: 0.6,
	jumpForceNormal: 10.5,  // Pulo do Rony normal (mais baixo)
	jumpForcePunk: 11.5,     // Pulo do Rony Punk (só um pouco mais alto)
	
	// Teia
	ceilingY: 50, // topo da arena
	
	// Velocidade do mundo
	worldSpeedNormal: 5,     // Velocidade base (Rony normal)
	worldSpeedPunk: 8.5,     // Velocidade aumentada (Rony Punk - 70% mais rápido)
	
	// Objetos
	objectSize: 40,
	objectColor: '#ff0000',
	objectSpawnInterval: 2000, // a cada 2 segundos
	
	// Cenário
	asphaltY: 280, // início do asfalto (alinhado com groundY)
	asphaltHeight: 120, // altura do asfalto
	laneOffset: 0, // offset da faixa tracejada
	laneSpeedBase: 3, // velocidade base da faixa (será multiplicada pelo modo)
	laneDashWidth: 40, // largura dos traços
	laneDashGap: 30, // espaço entre traços
	buildingSpeedBase: 2, // velocidade base dos prédios (será multiplicada pelo modo)
};
