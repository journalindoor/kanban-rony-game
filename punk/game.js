/* ============================================
   🏃 RonyOffice PUNK - Runner Game
   Ponto de Entrada Principal
   ============================================ */

// Inicializar
function init() {
	Config.canvas = document.getElementById('gameCanvas');
	Config.ctx = Config.canvas.getContext('2d');
	
	// Verificar se é mobile e mostrar modal de rotação
	if (isMobileDevice()) {
		document.getElementById('rotateModal').style.display = 'flex';
		document.getElementById('startButton').style.display = 'none';
		document.getElementById('gameTitle').style.display = 'none';
		document.getElementById('gameSubtitle').style.display = 'none';
		
		// Configurar botão de confirmação de rotação
		document.getElementById('confirmRotateButton').addEventListener('click', () => {
			document.getElementById('rotateModal').style.display = 'none';
			document.getElementById('startButton').style.display = 'block';
			document.getElementById('gameTitle').style.display = 'block';
			document.getElementById('gameSubtitle').style.display = 'block';
			
			// Solicitar fullscreen
			requestFullscreen();
		});
	}
	
	// Carregar imagem do personagem normal
	Config.playerImage = new Image();
	Config.playerImageNormal = Config.playerImage; // referência para resetar
	
	// Event listener para quando a imagem carregar com sucesso
	Config.playerImage.onload = function() {
		console.log('✅ Spritesheet normal do personagem carregado com sucesso!');
	};
	
	// Event listener para caso a imagem falhe ao carregar
	Config.playerImage.onerror = function() {
		console.error('❌ Erro ao carregar spritesheet do personagem. Usando fallback.');
		Config.playerImage = null; // Forçar uso do fallback
	};
	
	Config.playerImage.src = 'punk/assets/corre-rony-spritesheet.png';
	
	// Carregar imagem do personagem punk
	Config.playerImagePunk = new Image();
	
	Config.playerImagePunk.onload = function() {
		console.log('✅ Spritesheet PUNK do personagem carregado com sucesso!');
	};
	
	Config.playerImagePunk.onerror = function() {
		console.error('❌ Erro ao carregar spritesheet PUNK. Usando sprite normal.');
		Config.playerImagePunk = Config.playerImageNormal;
	};
	
	Config.playerImagePunk.src = 'punk/assets/corre-punk-spritesheet.png';
	
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
	
	// Botão continuar (pausa)
	const continueButton = document.getElementById('continueButton');
	continueButton.addEventListener('click', resumeGame);
	
	// Detectar quando usuário sai da aba
	document.addEventListener('visibilitychange', handleVisibilityChange);
	window.addEventListener('blur', handleWindowBlur);
	
	// Botão de pulo (Único controle)
	const jumpButton = document.getElementById('jumpButton');
	
	// Eventos de pressão (iniciar ação)
	const buttonPressHandler = handleButtonPress(Config);
	jumpButton.addEventListener('mousedown', buttonPressHandler);
	jumpButton.addEventListener('touchstart', buttonPressHandler);
	
	// Eventos de soltar (encerrar ação)
	jumpButton.addEventListener('mouseup', handleButtonRelease);
	jumpButton.addEventListener('touchend', handleButtonRelease);
	
	// Soltar botão se mouse sair do botão
	jumpButton.addEventListener('mouseleave', handleButtonRelease);
	
	console.log('🏃 Runner inicializado');
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
	document.getElementById('gameSubtitle').style.display = 'none';
	
	// Mostrar botão de pulo
	document.getElementById('jumpButton').style.display = 'block';
	
	// Inicializar prédios
	initBuildings(Config);
	
	// Resetar estado
	resetState(Config);
	
	// Iniciar loop
	gameLoop();
	
	console.log('🏃 Jogo iniciado!');
}
// Pausar jogo
function pauseGame() {
	if (!State.isRunning || State.gameOver || State.victory || State.isPaused) return;
	
	State.isPaused = true;
	document.getElementById('pauseModal').style.display = 'flex';
	console.log('⏸️ Jogo pausado');
}

// Retomar jogo
function resumeGame() {
	if (!State.isPaused) return;
	
	State.isPaused = false;
	document.getElementById('pauseModal').style.display = 'none';
	
	// Resetar lastTime para evitar salto de distância
	State.lastTime = performance.now();
	
	console.log('▶️ Jogo retomado');
}

// Handler para mudança de visibilidade da aba
function handleVisibilityChange() {
	if (document.hidden) {
		pauseGame();
	}
}

// Handler para quando janela perde foco
function handleWindowBlur() {
	pauseGame();
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
	
	// Calcular deltaTime e atualizar distância
	updateDistance();
	
	// Atualizar animação do spritesheet
	updateSpriteAnimation(Config);
	
	// Atualizar prédios
	updateBuildings(Config);
	
	// Física do personagem
	updatePlayerPhysics(Config);
	
	// Atualizar timer de invencibilidade
	if (State.isInvincible) {
		State.invincibilityTimer--;
		if (State.invincibilityTimer <= 0) {
			State.isInvincible = false;
			State.invincibilityTimer = 0;
			console.log('✨ Invencibilidade terminou - Colisões ativas novamente');
		}
	}
	
	// Atualizar efeitos de transformação
	if (State.isTransforming) {
		State.transformTimer--;
		
		// Atualizar partículas
		State.transformParticles.forEach(p => {
			p.x += p.vx;
			p.y += p.vy;
			p.life--;
		});
		
		// Remover partículas mortas
		State.transformParticles = State.transformParticles.filter(p => p.life > 0);
		
		// Terminar transformação
		if (State.transformTimer <= 0) {
			State.isTransforming = false;
			State.transformParticles = [];
		}
	}
	
	// Mover o mundo (velocidade dinâmica baseada no modo)
	const currentSpeed = State.isPunkMode ? Config.worldSpeedPunk : Config.worldSpeedNormal;
	State.worldOffset += currentSpeed;
	
	// Spawnar objetos
	const now = Date.now();
	if (now - State.lastObjectSpawn > Config.objectSpawnInterval) {
		spawnObject(Config);
		State.lastObjectSpawn = now;
	}
	
	// Mover objetos
	updateObjects(Config);
	
	// Sistema de itens
	spawnGuitarItem(Config);
	updateGuitarItem(Config);
	checkGuitarCollection(Config);
	
	// Verificar colisões
	checkCollisions(Config, gameOver);
}

// Game Over
function gameOver() {
	console.log('🚨 gameOver() CHAMADO!');
	console.log(`   Estado no momento: isPunkMode=${State.isPunkMode}, hasGuitarProtection=${State.hasGuitarProtection}`);
	console.log(`   Distância: ${State.distance}m`);
	
	State.gameOver = true;
	State.isRunning = false;
	State.webbedToPoint = null; // remover teia se existir
	State.buttonPressed = false; // garantir que botão não fica preso
	
	// Atualizar melhor distância
	if (State.distance > State.bestDistance) {
		State.bestDistance = State.distance;
	}
	
	// Mostrar botões de game over
	document.getElementById('gameOverButtons').style.display = 'flex';
	
	// Esconder botão de pulo
	document.getElementById('jumpButton').style.display = 'none';
	
	// Mostrar botão voltar
	document.getElementById('backButton').style.display = 'block';
	
	// Mostrar botão reiniciar
	document.getElementById('restartButton').style.display = 'block';
	
	console.log('💥 TELA DE GAME OVER EXIBIDA');
}

// Iniciar quando página carregar
window.addEventListener('DOMContentLoaded', init);
