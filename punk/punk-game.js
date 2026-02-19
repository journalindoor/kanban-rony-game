/* ============================================
   🏃 RonyOffice PUNK - Runner Game
   Estilo Dino do Chrome
   ============================================ */

// Configuração do jogo
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
	
	// Hitbox real do personagem por estado (área útil do sprite)
	hitboxes: {
		correndo: {
			offsetX: 14, // 14px vazios à esquerda
			offsetY: 0,
			width: 44,   // de X=14 até X=57
			height: 64   // de Y=0 até Y=63
		},
		pulando: {
			offsetX: 15, // 15px vazios à esquerda
			offsetY: 0,
			width: 48,   // de X=15 até X=62
			height: 55   // de Y=0 até Y=54
		},
		pendurado: {
			offsetX: 3,  // 3px vazios à esquerda
			offsetY: 6,  // 6px vazios no topo
			width: 44,   // de X=3 até X=46
			height: 52   // de Y=6 até Y=57
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
	jumpForce: 12,
	
	// Teia
	ceilingY: 50, // topo da arena
	
	// Velocidade do mundo
	worldSpeed: 5,
	
	// Objetos
	objectSize: 40,
	objectColor: '#ff0000',
	objectSpawnInterval: 2000, // a cada 2 segundos
	
	// Cenário
	asphaltY: 280, // início do asfalto (alinhado com groundY)
	asphaltHeight: 120, // altura do asfalto
	laneOffset: 0, // offset da faixa tracejada
	laneSpeed: 3, // velocidade da faixa
	laneDashWidth: 40, // largura dos traços
	laneDashGap: 30, // espaço entre traços
};

// Estado do jogo
const State = {
	isRunning: false,
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
	webUsesRemaining: 2, // número de teias disponíveis no ar
	
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
};

// Detectar se é dispositivo móvel
function isMobileDevice() {
	return window.innerWidth <= 768 && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Solicitar fullscreen
function requestFullscreen() {
	const elem = document.documentElement;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) {
		elem.webkitRequestFullscreen();
	} else if (elem.mozRequestFullScreen) {
		elem.mozRequestFullScreen();
	} else if (elem.msRequestFullscreen) {
		elem.msRequestFullscreen();
	}
}

// Inicializar
function init() {
	Config.canvas = document.getElementById('gameCanvas');
	Config.ctx = Config.canvas.getContext('2d');
	
	// Verificar se é mobile e mostrar modal de rotação
	if (isMobileDevice()) {
		document.getElementById('rotateModal').style.display = 'flex';
		document.getElementById('startButton').style.display = 'none';
		document.getElementById('gameTitle').style.display = 'none';
		
		// Configurar botão de confirmação de rotação
		document.getElementById('confirmRotateButton').addEventListener('click', () => {
			document.getElementById('rotateModal').style.display = 'none';
			document.getElementById('startButton').style.display = 'block';
			document.getElementById('gameTitle').style.display = 'block';
			
			// Solicitar fullscreen
			requestFullscreen();
		});
	}
	
	// Carregar imagem do personagem
	Config.playerImage = new Image();
	
	// Event listener para quando a imagem carregar com sucesso
	Config.playerImage.onload = function() {
		console.log('✅ Spritesheet do personagem carregado com sucesso!');
	};
	
	// Event listener para caso a imagem falhe ao carregar
	Config.playerImage.onerror = function() {
		console.error('❌ Erro ao carregar spritesheet do personagem. Usando fallback.');
		Config.playerImage = null; // Forçar uso do fallback
	};
	
	Config.playerImage.src = 'punk/assets/corre-rony-spritesheet.png';
	
	// Botão começar
	const startButton = document.getElementById('startButton');
	startButton.addEventListener('click', startGame);
	
	// Botão reiniciar
	const restartButton = document.getElementById('restartButton');
	restartButton.addEventListener('click', restartGame);
	
	// Botão voltar
	const backButton = document.getElementById('backButton');
	backButton.addEventListener('click', () => {
		window.location.href = 'index.html';
	});
	
	// Botão de pulo (Único controle)
	const jumpButton = document.getElementById('jumpButton');
	
	// Eventos de pressão (iniciar ação)
	jumpButton.addEventListener('mousedown', handleButtonPress);
	jumpButton.addEventListener('touchstart', handleButtonPress);
	
	// Eventos de soltar (encerrar ação)
	jumpButton.addEventListener('mouseup', handleButtonRelease);
	jumpButton.addEventListener('touchend', handleButtonRelease);
	
	// Soltar botão se mouse sair do botão
	jumpButton.addEventListener('mouseleave', handleButtonRelease);
	
	console.log('🏃 Runner inicializado');
}

// Botão pressionado
function handleButtonPress(e) {
	e.preventDefault();
	State.buttonPressed = true;
	jump();
}

// Botão solto
function handleButtonRelease(e) {
	e.preventDefault();
	State.buttonPressed = false;
	
	// Se estiver balançando e soltar o botão, soltar a teia
	if (State.playerState === 'balancando') {
		soltarTeia();
	}
}

// Função de pulo (controle principal)
function jump() {
	if (!State.isRunning || State.gameOver) return;
	
	// ESTADO: noChao → pulo vertical normal
	if (State.playerState === 'noChao') {
		State.velocityY = -Config.jumpForce;
		State.playerState = 'pulando';
	}
	// ESTADO: pulando → ativar teia (se tiver teias disponíveis)
	else if (State.playerState === 'pulando') {
		if (State.webUsesRemaining > 0) {
			ativarTeia();
		}
	}
	// ESTADO: balancando → ignorar input
	else if (State.playerState === 'balancando') {
		// NÃO fazer nada
		return;
	}
}

// Ativar modo teia (somente quando está no ar)
function ativarTeia() {
	// Criar ponto de ancoragem fora da área visível, acima do topo
	const webX = Config.playerX + 200; // mais à frente para diágonal
	const webY = -50; // acima do topo da tela (fora da área visível)
	
	State.webbedToPoint = { x: webX, y: webY };
	State.webStartX = webX; // salvar posição inicial
	State.fixedPlayerY = State.playerY; // congelar Y atual
	
	// Decrementar usos disponíveis
	State.webUsesRemaining--;
	
	// Resetar animação
	State.webOffsetY = 0;
	State.webOffsetDirection = 'down';
	
	// Mudar estado para balançando
	State.playerState = 'balancando';
}

// Reiniciar jogo
function restartGame() {
	// Esconder botões de game over
	document.getElementById('gameOverButtons').style.display = 'none';
	
	// Resetar e iniciar
	startGame();
}

// Começar jogo
function startGame() {
	if (State.isRunning) return;
	
	// Esconder botão e título
	document.getElementById('startButton').style.display = 'none';
	document.getElementById('gameTitle').style.display = 'none';
	
	// Inicializar prédios
	initBuildings();
	
	// Resetar estado
	State.isRunning = true;
	State.worldOffset = 0;
	State.objects = [];
	State.lastObjectSpawn = Date.now();
	State.playerY = Config.groundY;
	State.velocityY = 0;
	State.playerState = 'noChao';
	State.gameOver = false;
	State.buttonPressed = false;
	State.distance = 0;
	State.webbedToPoint = null;
	State.webStartX = 0;
	State.fixedPlayerY = 0;
	State.webUsesRemaining = 2;
	State.webOffsetY = 0;
	State.webOffsetDirection = 'down';
	State.lastTime = performance.now();
	State.timeAccumulator = 0;
	State.victory = false;
	State.currentFrame = 0;
	State.lastFrameTime = performance.now();
	
	// Iniciar loop
	gameLoop();
	
	console.log('🏃 Jogo iniciado!');
}

// Loop principal
function gameLoop() {
	if (!State.isRunning) return;
	
	update();
	render();
	
	requestAnimationFrame(gameLoop);
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

// Atualizar animação do spritesheet
function updateSpriteAnimation() {
	const currentTime = performance.now();
	const elapsed = currentTime - State.lastFrameTime;
	
	// Trocar de frame se passou o intervalo
	if (elapsed >= Config.spriteFrameInterval) {
		State.currentFrame = (State.currentFrame + 1) % Config.spriteTotalFrames;
		State.lastFrameTime = currentTime;
	}
}

// Atualizar lógica
function update() {
	if (State.gameOver || State.victory) return;
	
	// Calcular deltaTime e atualizar distância
	updateDistance();
	
	// Atualizar animação do spritesheet
	updateSpriteAnimation();
	
	// Atualizar prédios
	updateBuildings();
	
	// Física do personagem
	updatePlayerPhysics();
	
	// Mover o mundo
	State.worldOffset += Config.worldSpeed;
	
	// Spawnar objetos
	const now = Date.now();
	if (now - State.lastObjectSpawn > Config.objectSpawnInterval) {
		spawnObject();
		State.lastObjectSpawn = now;
	}
	
	// Mover objetos
	for (let obj of State.objects) {
		obj.x -= Config.worldSpeed;
	}
	
	// Remover objetos fora da tela
	State.objects = State.objects.filter(obj => obj.x + Config.objectSize > 0);
	
	// Verificar colisões
	checkCollisions();
}

// Física do personagem (baseada em estados)
function updatePlayerPhysics() {
	if (State.playerState === 'balancando') {
		// MODO PÊNDULO
		updatePendulum();
	} else {
		// MODO NORMAL (noChao ou pulando)
		
		// Aplicar gravidade
		State.velocityY += Config.gravity;
		
		// Atualizar posição Y
		State.playerY += State.velocityY;
		
		// Limitar personagem dentro da tela
		if (State.playerY < Config.ceilingY) {
			State.playerY = Config.ceilingY;
			State.velocityY = 0;
		}
		
		// Verificar se tocou o chão
		if (State.playerY >= Config.groundY) {
			State.playerY = Config.groundY;
			State.velocityY = 0;
			State.playerState = 'noChao';
			// Recarregar teias ao tocar o chão
			State.webUsesRemaining = 2;
		}
	}
}

// Atualizar física do pêndulo
function updatePendulum() {
	if (!State.webbedToPoint) {
		// Segurança: se não tem ponto de teia, voltar para queda
		State.playerState = 'pulando';
		return;
	}
	
	// CONDIÇÃO 1: Botão solto
	if (!State.buttonPressed) {
		soltarTeia();
		return;
	}
	
	// CONGELAR PERSONAGEM NO Y (com deslocamento visual)
	State.playerY = State.fixedPlayerY + State.webOffsetY;
	
	// Animação de peso corporal
	if (State.webbedToPoint.x >= Config.playerX) {
		// FASE 1: Teia vindo - descer levemente (efeito peso)
		if (State.webOffsetY < 6) {
			State.webOffsetY += 0.2;
		}
	} else {
		// FASE 2: Teia passou - subir levemente (efeito impulso)
		if (State.webOffsetY > 0) {
			State.webOffsetY -= 0.2;
		} else {
			State.webOffsetY = 0; // garantir que não fique negativo
		}
	}
	
	// Mover ponto da teia para a esquerda (simulando que o personagem avança)
	State.webbedToPoint.x -= Config.worldSpeed;
	
	// Calcular distância percorrida pela teia
	const distanciaPercorrida = State.webStartX - State.webbedToPoint.x;
	const distanciaInicial = State.webStartX - Config.playerX;
	
	// CONDIÇÃO 2: Limite traseiro (50% mais tempo)
	// Quando a teia percorreu 1.5x a distância que foi criada à frente
	if (distanciaPercorrida >= distanciaInicial * 1.5) {
		soltarTeia();
	}
}

// Soltar teia e voltar para queda livre
function soltarTeia() {
	State.webbedToPoint = null;
	State.playerState = 'pulando';
	
	// Resetar animação
	State.webOffsetY = 0;
	State.webOffsetDirection = 'down';
	
	// Velocidade Y começa em 0 (cai reto)
	State.velocityY = 0;
}

// Verificar colisões AABB
function checkCollisions() {
	// Determinar qual hitbox usar baseado no estado
	let hitbox;
	if (State.playerState === 'noChao') {
		hitbox = Config.hitboxes.correndo;
	} else if (State.playerState === 'pulando') {
		hitbox = Config.hitboxes.pulando;
	} else if (State.playerState === 'balancando') {
		hitbox = Config.hitboxes.pendurado;
	}
	
	// Usar hitbox real ao invés do tamanho do sprite
	const playerLeft = Config.playerX + hitbox.offsetX;
	const playerRight = Config.playerX + hitbox.offsetX + hitbox.width;
	const playerTop = State.playerY + hitbox.offsetY;
	const playerBottom = State.playerY + hitbox.offsetY + hitbox.height;
	
	for (let obj of State.objects) {
		const objLeft = obj.x;
		const objRight = obj.x + obj.size;
		const objTop = obj.y;
		const objBottom = obj.y + obj.size;
		
		// Detecção AABB
		if (
			playerRight > objLeft &&
			playerLeft < objRight &&
			playerBottom > objTop &&
			playerTop < objBottom
		) {
			// Colisão detectada
			gameOver();
			return;
		}
	}
}

// Game Over
function gameOver() {
	State.gameOver = true;
	State.isRunning = false;
	State.webbedToPoint = null; // remover teia se existir
	State.buttonPressed = false; // garantir que botão não fica preso
	updateBestDistance();
	
	// Mostrar botões de game over
	document.getElementById('gameOverButtons').style.display = 'flex';
	
	// Mostrar botão voltar
	document.getElementById('backButton').style.display = 'block';
	
	// Mostrar botão reiniciar
	document.getElementById('restartButton').style.display = 'block';
	
	console.log('💥 Game Over!');
}

// Atualizar melhor distância
function updateBestDistance() {
	if (State.distance > State.bestDistance) {
		State.bestDistance = State.distance;
	}
}

// Criar objeto
function spawnObject() {
	State.objects.push({
		x: Config.width,
		y: Config.groundY,
		size: Config.objectSize,
		color: Config.objectColor
	});
}

// Inicializar prédios
function initBuildings() {
	State.buildings = [];
	const buildingColors = ['#6B7280', '#4B5563', '#9CA3AF', '#374151', '#1F2937'];
	let currentX = Config.width;
	
	for (let i = 0; i < 8; i++) {
		const width = Math.random() * 80 + 60; // 60-140px
		const height = Config.height + 100; // sempre ultrapassa o topo
		const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
		
		// Gerar estado das janelas (acesas/apagadas) no momento da criação
		const numWindows = width > 100 ? 3 : 2;
		const windowSpacingY = 35;
		const numFloors = Math.floor((Config.asphaltY + Config.playerSize - 60) / windowSpacingY);
		const windowStates = [];
		
		for (let floor = 0; floor < numFloors; floor++) {
			windowStates[floor] = [];
			for (let w = 0; w < numWindows; w++) {
				windowStates[floor][w] = Math.random() > 0.3; // 70% acesas
			}
		}
		
		State.buildings.push({
			x: currentX,
			width: width,
			height: height,
			color: color,
			speed: 2, // velocidade de movimento (mais lento que o jogo)
			windowStates: windowStates // estado fixo das janelas
		});
		
		// Adicionar espaço entre prédios
		currentX += width + Math.random() * 60 + 40; // espaço de 40-100px
	}
}

// Atualizar prédios
function updateBuildings() {
	// Mover prédios
	for (let building of State.buildings) {
		building.x -= building.speed;
	}
	
	// Remover prédios que saíram completamente da tela
	State.buildings = State.buildings.filter(building => building.x + building.width > -50);
	
	// Adicionar novo prédio quando houver espaço
	if (State.buildings.length > 0) {
		const lastBuilding = State.buildings[State.buildings.length - 1];
		const lastBuildingEnd = lastBuilding.x + lastBuilding.width;
		
		// Se o último prédio está longe o suficiente, criar novo
		if (lastBuildingEnd < Config.width - 100) {
			const buildingColors = ['#6B7280', '#4B5563', '#9CA3AF', '#374151', '#1F2937'];
			const width = Math.random() * 80 + 60;
			const minGap = 50; // espaço mínimo garantido
			const extraGap = Math.random() * 60; // espaço extra aleatório
			
			// Gerar estado das janelas
			const numWindows = width > 100 ? 3 : 2;
			const windowSpacingY = 35;
			const numFloors = Math.floor((Config.asphaltY + Config.playerSize - 60) / windowSpacingY);
			const windowStates = [];
			
			for (let floor = 0; floor < numFloors; floor++) {
				windowStates[floor] = [];
				for (let w = 0; w < numWindows; w++) {
					windowStates[floor][w] = Math.random() > 0.3;
				}
			}
			
			State.buildings.push({
				x: lastBuildingEnd + minGap + extraGap,
				width: width,
				height: Config.height + 100,
				color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
				speed: 2,
				windowStates: windowStates
			});
		}
	}
}

// Desenhar prédio com detalhes
function drawBuilding(ctx, building) {
	// Corpo do prédio (ultrapassa o topo)
	ctx.fillStyle = building.color;
	ctx.fillRect(building.x, 0, building.width, Config.asphaltY + Config.playerSize);
	
	// Porta no térréo
	const doorWidth = building.width * 0.3;
	const doorHeight = 40;
	const doorX = building.x + building.width / 2 - doorWidth / 2;
	const doorY = Config.asphaltY + Config.playerSize - doorHeight;
	ctx.fillStyle = '#1F2937';
	ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
	
	// Janelas em vários andares
	const windowSize = 12;
	const windowSpacingY = 35; // espaçamento vertical entre andares
	const numWindows = building.width > 100 ? 3 : 2;
	
	// Desenhar janelas em vários andares (começando do primeiro andar)
	const numFloors = building.windowStates.length;
	
	for (let floor = 0; floor < numFloors; floor++) {
		const windowY = Config.asphaltY + Config.playerSize - 60 - (floor * windowSpacingY);
		
		for (let i = 0; i < numWindows; i++) {
			const windowX = building.x + (i + 1) * (building.width / (numWindows + 1)) - windowSize / 2;
			
			// Usar estado fixo: acesa ou apagada
			ctx.fillStyle = building.windowStates[floor][i] ? '#FCD34D' : '#4B5563';
			ctx.fillRect(windowX, windowY, windowSize, windowSize);
		}
	}
}

// Renderizar
function render() {
	const ctx = Config.ctx;
	
	// Limpar tela com fundo azul céu
	ctx.fillStyle = '#5DADE2';
	ctx.fillRect(0, 0, Config.width, Config.height);
	
	// Desenhar prédios no fundo
	for (let building of State.buildings) {
		drawBuilding(ctx, building);
	}
	
	// Desenhar asfalto
	ctx.fillStyle = '#2C2C2C';
	ctx.fillRect(0, Config.asphaltY + Config.playerSize, Config.width, Config.asphaltHeight);
	
	// Desenhar faixa branca tracejada (mais próxima do centro do asfalto)
	ctx.fillStyle = '#FFFFFF';
	const laneY = Config.asphaltY + Config.playerSize + 25; // mais acima, próxima do centro
	const dashPattern = Config.laneDashWidth + Config.laneDashGap;
	for (let x = -dashPattern + (Config.laneOffset % dashPattern); x < Config.width; x += dashPattern) {
		ctx.fillRect(x, laneY, Config.laneDashWidth, 4);
	}
	
	// Atualizar offset da faixa
	if (State.isRunning) {
		Config.laneOffset -= Config.laneSpeed;
	}
	
	// Desenhar personagem (fixo no X, mas move no Y)
	if (Config.playerImage && Config.playerImage.complete) {
		let frameX = 0;
		let frameY = 0;
		
		// Verificar estado do personagem para escolher o frame correto
		if (State.playerState === 'noChao') {
			// Corrida: usar frames 1-6 (índices 0-5) da primeira linha
			frameX = State.currentFrame * Config.spriteFrameWidth;
			frameY = 0;
		} else if (State.playerState === 'pulando') {
			// Pulo: frame 7 está na segunda linha, primeira posição (X=0, Y=64)
			frameX = 0;
			frameY = 64;
		} else if (State.playerState === 'balancando') {
			// Pendurado na teia: frame 8 está na segunda linha, segunda posição (X=64, Y=64)
			frameX = 64;
			frameY = 64;
		}
		
		// Desenhar frame específico do spritesheet
		ctx.drawImage(
			Config.playerImage,
			frameX, frameY, // posição do recorte no spritesheet (sourceX, sourceY)
			Config.spriteFrameWidth, Config.spriteFrameHeight, // tamanho do recorte
			Config.playerX, State.playerY, // posição de destino no canvas
			Config.playerSize, Config.playerSize // tamanho de destino
		);
	} else {
		// Fallback: desenhar retângulo se imagem não carregar
		ctx.fillStyle = Config.playerColor;
		ctx.fillRect(
			Config.playerX,
			State.playerY,
			Config.playerSize,
			Config.playerSize
		);
	}
	
	// Desenhar teia (se estiver balançando) - POR CIMA do personagem
	if (State.playerState === 'balancando' && State.webbedToPoint) {
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(State.webbedToPoint.x, State.webbedToPoint.y);
		ctx.lineTo(Config.playerX + Config.playerSize / 2, State.playerY + Config.playerSize / 2);
		ctx.stroke();
		
		// Desenhar ponto de ancoragem
		ctx.fillStyle = '#fff';
		ctx.beginPath();
		ctx.arc(State.webbedToPoint.x, State.webbedToPoint.y, 4, 0, Math.PI * 2);
		ctx.fill();
	}
	
	// Desenhar objetos
	for (let obj of State.objects) {
		ctx.fillStyle = obj.color;
		ctx.fillRect(obj.x, obj.y, obj.size, obj.size);
	}
	
	// Desenhar HUD dentro do canvas com estilo futurista
	const hudX = 10;
	const hudY = 10;
	const hudWidth = 220;
	const hudHeight = 60;
	
	// Fundo translúcido
	ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
	ctx.beginPath();
	ctx.roundRect(hudX, hudY, hudWidth, hudHeight, 8);
	ctx.fill();
	
	// Borda ciano
	ctx.strokeStyle = '#22D3EE';
	ctx.lineWidth = 2;
	ctx.stroke();
	
	// Texto do HUD
	ctx.fillStyle = '#E0F2FE';
	ctx.font = 'bold 16px Courier New';
	ctx.textAlign = 'left';
	
	// Distância
	const distanceStr = String(State.distance).padStart(5, '0');
	ctx.fillText('Distância: ' + distanceStr + ' m', hudX + 12, hudY + 25);
	
	// Recorde
	const bestStr = String(State.bestDistance).padStart(5, '0');
	ctx.fillText('Recorde: ' + bestStr + ' m', hudX + 12, hudY + 48);
	
	// Mostrar Vitória
	if (State.victory) {
		ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
		ctx.fillRect(0, 0, Config.width, Config.height);
		
		ctx.fillStyle = '#00ff00';
		ctx.font = 'bold 48px Courier New';
		ctx.textAlign = 'center';
		ctx.fillText('Você venceu!', Config.width / 2, Config.height / 2);
		ctx.fillStyle = '#fff';
		ctx.font = '20px Courier New';
		ctx.fillText('99999 metros percorridos!', Config.width / 2, Config.height / 2 + 50);
		ctx.textAlign = 'left';
	}
	
	// Mostrar Game Over
	if (State.gameOver) {
		ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
		ctx.fillRect(0, 0, Config.width, Config.height);
		
		// Título RONY RUNNER acima do Game Over
		ctx.fillStyle = '#FFFFFF';
		ctx.font = 'bold 32px Courier New';
		ctx.textAlign = 'center';
		ctx.fillText('RONY RUNNER', Config.width / 2, Config.height / 2 - 60);
		
		ctx.fillStyle = '#ff0000';
		ctx.font = 'bold 48px Courier New';
		ctx.fillText('Game Over', Config.width / 2, Config.height / 2);
		ctx.textAlign = 'left';
	}
}

// Iniciar quando página carregar
window.addEventListener('DOMContentLoaded', init);
