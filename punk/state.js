/* ============================================
   Estado do Jogo
   ============================================ */

const State = {
	isRunning: false,
	isPaused: false, // true quando jogo está pausado (aba inativa)
	worldOffset: 0, // quanto o mundo já se moveu
	objects: [], // obstáculos/objetos na tela
	lastObjectSpawn: 0,
	
	// Estado do personagem
	playerState: 'noChao', // noChao, pulando, balancando
	playerY: 280,
	velocityY: 0,
	gameOver: false,
	buttonPressed: false, // rastreia se botão está pressionado
	
	// Teia/Pêndulo
	webbedToPoint: null, // {x, y} ponto fixo no teto onde a teia está presa
	webStartX: 0, // posição X inicial do ponto da teia
	fixedPlayerY: 0, // Y congelado do personagem durante teia
	webUsesRemaining: 1, // número de teias disponíveis no ar
	
	// Animação de peso corporal
	webOffsetY: 0, // deslocamento visual durante teia
	webOffsetDirection: 'down', // direção do movimento
	
	// Sistema de distância
	distance: 0, // em metros
	bestDistance: 0, // recorde
	lastTime: 0, // timestamp do último frame
	timeAccumulator: 0, // acumulador para incrementar distância
	victory: false, // vitória aos 99999m
	
	// Cenário
	buildings: [], // array de prédios
	
	// Animação de spritesheet
	currentFrame: 0, // frame atual (0-3)
	lastFrameTime: 0, // timestamp da última troca de frame
	
	// Sistema de itens - Guitarra
	guitarItem: {
		active: false,
		x: 0,
		y: 0,
		width: 30,
		height: 30,
		lastSpawnDistance: 0,
		firstSpawnDone: false // controla se já fez o spawn inicial aleatório
	},
	isPunkMode: false, // se pegou a guitarra (vida extra ativa)
	guitarCollisionDistance: 0, // distância onde perdeu a guitarra
	hasGuitarProtection: false, // flag se está protegido pela guitarra
	
	// Sistema de invencibilidade temporária (após perder guitarra)
	isInvincible: false, // true durante invencibilidade pós-guitarra
	invincibilityTimer: 0, // tempo restante de invencibilidade (em frames)
	
	// Sistema de transformação em Punk
	isTransforming: false, // true durante animação de transformação
	transformTimer: 0, // contador de frames para efeitos (30-60 frames = 0.5-1s)
	transformParticles: [], // array de partículas {emoji, x, y, vx, vy, life}
};

// Resetar estado do jogo
function resetState(config) {
	State.isRunning = true;
	State.worldOffset = 0;
	State.objects = [];
	State.lastObjectSpawn = Date.now();
	State.playerY = config.groundY;
	State.velocityY = 0;
	State.playerState = 'noChao';
	State.gameOver = false;
	State.buttonPressed = false;
	State.distance = 0;
	State.webbedToPoint = null;
	State.webStartX = 0;
	State.fixedPlayerY = 0;
	State.webUsesRemaining = 1;
	State.webOffsetY = 0;
	State.webOffsetDirection = 'down';
	State.lastTime = performance.now();
	State.timeAccumulator = 0;
	State.victory = false;
	State.currentFrame = 0;
	State.lastFrameTime = performance.now();
	State.guitarItem = {
		active: false,
		x: 0,
		y: 0,
		width: 30,
		height: 30,
		lastSpawnDistance: 0,
		firstSpawnDone: false
	};
	State.isPunkMode = false;
	State.guitarCollisionDistance = 0;
	State.hasGuitarProtection = false;
	State.isInvincible = false;
	State.invincibilityTimer = 0;
	State.isTransforming = false;
	State.transformTimer = 0;
	State.transformParticles = [];
	config.playerImage = config.playerImageNormal; // resetar para sprite normal
}

// Atualizar distância (10 metros por segundo)
function updateDistance() {
	const currentTime = performance.now();
	const deltaTime = (currentTime - State.lastTime) / 1000; // em segundos
	State.lastTime = currentTime;
	
	// Acumular tempo (0.1s = 1 metro, logo 10 metros/segundo)
	State.timeAccumulator += deltaTime;
	
	// Incrementar distância de 1 em 1 metro
	while (State.timeAccumulator >= 0.1) {
		State.distance += 1;
		State.timeAccumulator -= 0.1;
		
		// Verificar vitória
		if (State.distance >= 99999) {
			State.victory = true;
			State.isRunning = false;
			updateBestDistance();
			break;
		}
	}
}

// Atualizar melhor distância
function updateBestDistance() {
	if (State.distance > State.bestDistance) {
		State.bestDistance = State.distance;
	}
}

// Atualizar animação do spritesheet
function updateSpriteAnimation(config) {
	const currentTime = performance.now();
	const elapsed = currentTime - State.lastFrameTime;
	
	// Trocar de frame se passou o intervalo
	if (elapsed >= config.spriteFrameInterval) {
		State.currentFrame = (State.currentFrame + 1) % config.spriteTotalFrames;
		State.lastFrameTime = currentTime;
	}
}
