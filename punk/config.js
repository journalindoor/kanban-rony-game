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
	playerX: 150,
	groundY: 280,
	playerImage: null,
	playerImageNormal: null,
	playerImagePunk: null,
	
	// Hitbox por estado
	hitboxes: {
		correndo: { offsetX: 19, offsetY: 5, width: 34, height: 54 },
		pulando: { offsetX: 20, offsetY: 5, width: 38, height: 45 },
		pendurado: { offsetX: 8, offsetY: 11, width: 34, height: 42 }
	},
	
	// Debug
	debugHitbox: true,
	
	// Animação spritesheet
	spriteFrameWidth: 64,
	spriteFrameHeight: 64,
	spriteTotalFrames: 6,
	spriteFrameIntervalNormal: 100,
	spriteFrameIntervalPunk: 65,
	
	// Física
	gravity: 0.6,
	jumpForceNormal: 10.5,
	jumpForcePunk: 11.5,
	ceilingY: 50,
	
	// Velocidade
	worldSpeedNormal: 6,
	worldSpeedPunk: 10,
	
	// Objetos
	objectSize: 40,
	objectColor: '#ff0000',
	objectSpawnInterval: 2000,
	
	// Cenário
	asphaltY: 280,
	asphaltHeight: 120,
	laneOffset: 0,
	laneSpeedBase: 3,
	laneDashWidth: 40,
	laneDashGap: 30,
	buildingSpeedBase: 2
};
