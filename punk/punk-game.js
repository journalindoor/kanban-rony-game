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
	
	// Animação de spritesheet
	currentFrame: 0, // frame atual (0-3)
	lastFrameTime: 0, // timestamp da última troca de frame
};

// Inicializar
function init() {
	Config.canvas = document.getElementById('gameCanvas');
	Config.ctx = Config.canvas.getContext('2d');
	
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
	// Criar ponto de ancoragem no teto, à frente do personagem
	const webX = Config.playerX + 150; // alguns metros à frente
	const webY = Config.ceilingY; // topo da arena
	
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
	// Esconder botão reiniciar
	document.getElementById('restartButton').style.display = 'none';
	
	// Resetar e iniciar
	startGame();
}

// Começar jogo
function startGame() {
	if (State.isRunning) return;
	
	// Esconder botão
	document.getElementById('startButton').style.display = 'none';
	
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
	const playerLeft = Config.playerX;
	const playerRight = Config.playerX + Config.playerSize;
	const playerTop = State.playerY;
	const playerBottom = State.playerY + Config.playerSize;
	
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

// Renderizar
function render() {
	const ctx = Config.ctx;
	
	// Limpar tela
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, Config.width, Config.height);
	
	// Desenhar linha do chão (referência)
	ctx.strokeStyle = '#333';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(0, Config.groundY + Config.playerSize);
	ctx.lineTo(Config.width, Config.groundY + Config.playerSize);
	ctx.stroke();
	
	// Desenhar teia (se estiver balançando)
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
	
	// Desenhar objetos
	for (let obj of State.objects) {
		ctx.fillStyle = obj.color;
		ctx.fillRect(obj.x, obj.y, obj.size, obj.size);
	}
	
	// Atualizar HUD (fora do canvas)
	const distanceStr = String(State.distance).padStart(5, '0');
	const bestStr = String(State.bestDistance).padStart(5, '0');
	document.getElementById('distanceDisplay').textContent = distanceStr;
	document.getElementById('recordDisplay').textContent = bestStr;
	
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
		
		ctx.fillStyle = '#ff0000';
		ctx.font = 'bold 48px Courier New';
		ctx.textAlign = 'center';
		ctx.fillText('Game Over', Config.width / 2, Config.height / 2);
		ctx.textAlign = 'left';
	}
}

// Iniciar quando página carregar
window.addEventListener('DOMContentLoaded', init);
