/* ============================================
   🏃 RonyOffice PUNK - Runner Game
   Ponto de Entrada Principal
   ============================================ */

// Inicializar
function init() {
	console.log('🚀 INIT chamado - Página carregada');
	
	Config.canvas = document.getElementById('gameCanvas');
	Config.ctx = Config.canvas.getContext('2d');
	
	console.log('✅ Canvas inicializado:', Config.canvas ? 'OK' : 'ERRO');
	
	// Mobile: modal de rotação
	if (isMobileDevice()) {
		document.getElementById('rotateModal').style.display = 'flex';
		document.getElementById('startButton').style.display = 'none';
		document.getElementById('gameTitle').style.display = 'none';
		document.getElementById('gameSubtitle').style.display = 'none';
		
		document.getElementById('confirmRotateButton').addEventListener('click', () => {
			document.getElementById('rotateModal').style.display = 'none';
			document.getElementById('startButton').style.display = 'block';
			document.getElementById('gameTitle').style.display = 'block';
			document.getElementById('gameSubtitle').style.display = 'block';
			requestFullscreen();
		});
	}
	
	// Carregar sprites
	Config.playerImage = new Image();
	Config.playerImageNormal = Config.playerImage;
	Config.playerImage.onload = () => console.log('✅ Spritesheet normal carregado');
	Config.playerImage.onerror = () => {
		console.error('❌ Erro ao carregar spritesheet');
		Config.playerImage = null;
	};
	Config.playerImage.src = 'punk/assets/corre-rony-spritesheet.png';
	
	Config.playerImagePunk = new Image();
	Config.playerImagePunk.onload = () => console.log('✅ Spritesheet PUNK carregado');
	Config.playerImagePunk.onerror = () => {
		console.error('❌ Erro ao carregar spritesheet PUNK');
		Config.playerImagePunk = Config.playerImageNormal;
	};
	Config.playerImagePunk.src = 'punk/assets/corre-punk-spritesheet.png';
	
	// Botões
	document.getElementById('startButton').addEventListener('click', startGame);
	document.getElementById('restartButton').addEventListener('click', restartGame);
	document.getElementById('backButton').addEventListener('click', () => {
		// Resetar flag de abertura automática para próxima entrada
		resetReadingPanelAutoOpen();
		window.location.href = 'index.html';
	});
	document.getElementById('continueButton').addEventListener('click', resumeGame);
	
	// Eventos de janela
	document.addEventListener('visibilitychange', handleVisibilityChange);
	window.addEventListener('blur', handleWindowBlur);
	
	// Botão de pulo
	const jumpButton = document.getElementById('jumpButton');
	const buttonPressHandler = handleButtonPress(Config);
	jumpButton.addEventListener('mousedown', buttonPressHandler);
	jumpButton.addEventListener('touchstart', buttonPressHandler);
	jumpButton.addEventListener('mouseup', handleButtonRelease);
	jumpButton.addEventListener('touchend', handleButtonRelease);
	jumpButton.addEventListener('mouseleave', handleButtonRelease);
	
	// Botão de fechar painel de leitura
	const closeBtn = document.getElementById('readingCloseBtn');
	if (closeBtn) {
		closeBtn.addEventListener('click', () => {
			closeReadingPanel();
			
			// Mostrar apenas botão de pulo (botão de leitura está no canvas)
			if (State.isRunning && !State.gameOver && !State.victory) {
				document.getElementById('jumpButton').style.display = 'block';
			}
		});
	}
	
	// Clique no canvas (para botão de leitura)
	Config.canvas.addEventListener('click', handleCanvasClick);
	
	console.log('🏃 Runner inicializado');
}

// Começar jogo
function startGame() {
	if (State.isRunning) return;
	
	console.log('🎮 startGame() chamado - Inicializando...');
	
	document.getElementById('startButton').style.display = 'none';
	document.getElementById('gameTitle').style.display = 'none';
	document.getElementById('gameSubtitle').style.display = 'none';
	// jumpButton será mostrado quando fechar o painel
	
	initBuildings(Config);
	resetState(Config);
	
	// Abrir painel de leitura apenas na primeira entrada do jogo
	if (!ReadingSystem.hasOpenedAutomatically) {
		ReadingSystem.hasOpenedAutomatically = true;
		unlockReadingContent();
		openReadingPanel();
	} else {
		// Nas próximas vezes (reiniciar), apenas mostra os botões de UI
		document.getElementById('jumpButton').style.display = 'block';
	}
	
	gameLoop();
	
	console.log('🏃 Jogo iniciado com painel de leitura!');
	console.log(`🌍 Fase atual: ${getCurrentPhase().name}`);
}

// Pausar jogo
function pauseGame() {
	if (isReadingPanelOpen) {
		console.log('⚠️ Pause padrão bloqueado - Painel de leitura está aberto');
		return;
	}
	
	if (!State.isRunning || State.gameOver || State.victory || State.isPaused) return;
	
	State.isPaused = true;
	document.getElementById('pauseModal').style.display = 'flex';
	console.log('⏸️ Jogo pausado (pause padrão)');
}

// Retomar jogo
function resumeGame() {
	if (!State.isPaused) return;
	
	State.isPaused = false;
	document.getElementById('pauseModal').style.display = 'none';
	State.lastTime = performance.now();
	
	console.log('▶️ Jogo retomado');
}

function handleVisibilityChange() {
	if (document.hidden) pauseGame();
}

function handleWindowBlur() {
	pauseGame();
}
// Reiniciar jogo
function restartGame() {
	document.getElementById('gameOverButtons').style.display = 'none';
	startGame();
}

// Loop principal
function gameLoop() {
	if (!State.isRunning) return;
	update();
	render();
	requestAnimationFrame(gameLoop);
}

// Atualizar lógica
function update() {
	if (State.gameOver || State.victory || State.isPaused) return;
	
	updateDistance();
	updateSpriteAnimation(Config);
	updateBuildings(Config);
	updatePlayerPhysics(Config);
	
	// Invencibilidade
	if (State.isInvincible) {
		State.invincibilityTimer--;
		if (State.invincibilityTimer <= 0) {
			State.isInvincible = false;
			State.invincibilityTimer = 0;
			console.log('✨ Invencibilidade terminou');
		}
	}
	
	// Transformação
	if (State.isTransforming) {
		State.transformTimer--;
		State.transformParticles.forEach(p => {
			p.x += p.vx;
			p.y += p.vy;
			p.life--;
		});
		State.transformParticles = State.transformParticles.filter(p => p.life > 0);
		
		if (State.transformTimer <= 0) {
			State.isTransforming = false;
			State.transformParticles = [];
		}
	}
	
	// Mundo
	const currentSpeed = State.isPunkMode ? Config.worldSpeedPunk : Config.worldSpeedNormal;
	State.worldOffset += currentSpeed;
	
	// Spawn objetos
	const now = Date.now();
	if (now - State.lastObjectSpawn > Config.objectSpawnInterval) {
		spawnObject(Config);
		State.lastObjectSpawn = now;
	}
	
	updateObjects(Config);
	
	// Itens
	spawnGuitarItem(Config);
	updateGuitarItem(Config);
	checkGuitarCollection(Config);
	
	checkCollisions(Config, gameOver);
}

// Handler de clique no canvas (botão de leitura)
function handleCanvasClick(event) {
	if (isReadingPanelOpen || State.gameOver || State.victory || !State.isRunning) return;
	
	const rect = Config.canvas.getBoundingClientRect();
	const clickX = event.clientX - rect.left;
	const clickY = event.clientY - rect.top;
	
	// Verificar se clicou no botão de leitura
	const btnX = ReadingSystem.buttonX;
	const btnY = ReadingSystem.buttonY;
	const btnSize = ReadingSystem.buttonSize;
	
	if (clickX >= btnX && clickX <= btnX + btnSize &&
	    clickY >= btnY && clickY <= btnY + btnSize) {
		openReadingPanel();
		document.getElementById('jumpButton').style.display = 'none';
	}
}

// Game Over
function gameOver() {
	console.log('🚨 gameOver() CHAMADO!');
	console.log(`   Estado: isPunkMode=${State.isPunkMode}, hasGuitarProtection=${State.hasGuitarProtection}`);
	console.log(`   Distância: ${State.distance}m`);
	
	State.gameOver = true;
	State.isRunning = false;
	State.webbedToPoint = null;
	State.buttonPressed = false;
	
	if (State.distance > State.bestDistance) {
		State.bestDistance = State.distance;
	}
	
	document.getElementById('gameOverButtons').style.display = 'flex';
	document.getElementById('jumpButton').style.display = 'none';
	document.getElementById('backButton').style.display = 'block';
	document.getElementById('restartButton').style.display = 'block';
	
	console.log('💥 TELA DE GAME OVER EXIBIDA');
}

// Iniciar quando DOM carregar
window.addEventListener('DOMContentLoaded', () => {
	console.log('📄 DOM Loaded - Chamando init()');
	try {
		init();
	} catch (error) {
		console.error('❌ ERRO no init():', error);
	}
});
