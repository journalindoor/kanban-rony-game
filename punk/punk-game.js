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
	playerSize: 30,
	playerColor: '#0088ff',
	playerX: 150, // posição fixa na tela (meio-esquerda)
	groundY: 300, // altura do chão
	
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
	playerY: 300,
	velocityY: 0,
	gameOver: false,
	
	// Teia/Pêndulo
	webbedToPoint: null, // {x, y} ponto fixo no teto onde a teia está presa
	webStartX: 0, // posição X inicial do ponto da teia
	fixedPlayerY: 0, // Y congelado do personagem durante teia
	
	// Sistema de distância
	distance: 0, // em metros
	bestDistance: 0, // recorde
	lastTime: 0, // timestamp do último frame
	timeAccumulator: 0, // acumulador para incrementar distância
	victory: false, // vitória aos 99999m
};

// Inicializar
function init() {
	Config.canvas = document.getElementById('gameCanvas');
	Config.ctx = Config.canvas.getContext('2d');
	
	// Botão começar
	const startButton = document.getElementById('startButton');
	startButton.addEventListener('click', startGame);
	
	// Botão reiniciar
	const restartButton = document.getElementById('restartButton');
	restartButton.addEventListener('click', restartGame);
	
	// Event listeners para pulo
	document.addEventListener('keydown', handleKeyPress);
	document.addEventListener('mousedown', handleMouseClick);
	document.addEventListener('touchstart', handleTouchStart);
	
	console.log('🏃 Runner inicializado');
}

// Pulo por teclado
function handleKeyPress(e) {
	if (e.code === 'Space') {
		e.preventDefault();
		jump();
	}
}

// Pulo por clique do mouse (botão esquerdo)
function handleMouseClick(e) {
	if (e.button === 0) { // botão esquerdo
		jump();
	}
}

// Pulo por toque na tela (telefones)
function handleTouchStart(e) {
	e.preventDefault();
	jump();
}

// Função de pulo (controle principal)
function jump() {
	if (!State.isRunning || State.gameOver) return;
	
	// ESTADO: noChao → pulo vertical normal
	if (State.playerState === 'noChao') {
		State.velocityY = -Config.jumpForce;
		State.playerState = 'pulando';
	}
	// ESTADO: pulando → ativar teia
	else if (State.playerState === 'pulando') {
		ativarTeia();
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
	State.distance = 0;
	State.webbedToPoint = null;
	State.webStartX = 0;
	State.fixedPlayerY = 0;
	State.lastTime = performance.now();
	State.timeAccumulator = 0;
	State.victory = false;
	
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

// Atualizar lógica
function update() {
	if (State.gameOver || State.victory) return;
	
	// Calcular deltaTime e atualizar distância
	updateDistance();
	
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
	
	// CONGELAR PERSONAGEM NO Y
	State.playerY = State.fixedPlayerY;
	
	// Mover ponto da teia para a esquerda (simulando que o personagem avança)
	State.webbedToPoint.x -= Config.worldSpeed;
	
	// Calcular distância percorrida pela teia
	const distanciaPercorrida = State.webStartX - State.webbedToPoint.x;
	const distanciaInicial = State.webStartX - Config.playerX;
	
	// CONDIÇÃO PARA SOLTAR A TEIA:
	// Quando a teia percorreu a mesma distância que foi criada à frente
	if (distanciaPercorrida >= distanciaInicial) {
		soltarTeia();
	}
}

// Soltar teia e voltar para queda livre
function soltarTeia() {
	State.webbedToPoint = null;
	State.playerState = 'pulando';
	
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
	ctx.fillStyle = Config.playerColor;
	ctx.fillRect(
		Config.playerX,
		State.playerY,
		Config.playerSize,
		Config.playerSize
	);
	
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
