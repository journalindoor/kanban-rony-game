/* ============================================
   🏃 RonyOffice PUNK - Runner Game
   Ponto de Entrada Principal
   ============================================ */

// Inicializar
function init() {
	console.log('🚀 INIT chamado - Página carregada');
	console.log('🌍 Ambiente:', window.location.href);
	
	try {
		Config.canvas = document.getElementById('gameCanvas');
		if (!Config.canvas) {
			throw new Error('Canvas não encontrado!');
		}
		Config.ctx = Config.canvas.getContext('2d');
		
		console.log('✅ Canvas inicializado:', Config.canvas ? 'OK' : 'ERRO');
	} catch (error) {
		console.error('❌ ERRO ao inicializar canvas:', error);
		return;
	}
	
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
	console.log('🖼️ Iniciando carregamento de sprites...');
	
	Config.playerImage = new Image();
	Config.playerImageNormal = Config.playerImage;
	Config.playerImage.onload = () => {
		console.log('✅ Spritesheet normal carregado');
		console.log('   - Dimensões:', Config.playerImage.width, 'x', Config.playerImage.height);
	};
	Config.playerImage.onerror = (e) => {
		console.error('❌ Erro ao carregar spritesheet normal:', e);
		console.error('   - URL tentada:', Config.playerImage.src);
		Config.playerImage = null;
	};
	Config.playerImage.src = 'punk/assets/corre-rony-spritesheet.png';
	console.log('🔗 Carregando spritesheet normal de:', Config.playerImage.src);
	
	Config.playerImagePunk = new Image();
	Config.playerImagePunk.onload = () => {
		console.log('✅ Spritesheet PUNK carregado');
		console.log('   - Dimensões:', Config.playerImagePunk.width, 'x', Config.playerImagePunk.height);
	};
	Config.playerImagePunk.onerror = (e) => {
		console.error('❌ Erro ao carregar spritesheet PUNK:', e);
		console.error('   - URL tentada:', Config.playerImagePunk.src);
		Config.playerImagePunk = Config.playerImageNormal;
	};
	Config.playerImagePunk.src = 'punk/assets/corre-punk-spritesheet.png';
	console.log('🔗 Carregando spritesheet PUNK de:', Config.playerImagePunk.src);
	
	// Botões
	console.log('🎮 Inicializando botões e event listeners...');
	
	const startButton = document.getElementById('startButton');
	const restartButton = document.getElementById('restartButton');
	const backButton = document.getElementById('backButton');
	const continueButton = document.getElementById('continueButton');
	
	if (startButton) startButton.addEventListener('click', startGame);
	if (restartButton) restartButton.addEventListener('click', restartGame);
	if (backButton) {
		backButton.addEventListener('click', () => {
			// Resetar flag de abertura automática para próxima entrada
			resetReadingPanelAutoOpen();
			window.location.href = 'index.html';
		});
	}
	if (continueButton) continueButton.addEventListener('click', resumeGame);
	
	console.log('✅ Botões inicializados');
	
	// Eventos de janela
	document.addEventListener('visibilitychange', handleVisibilityChange);
	window.addEventListener('blur', handleWindowBlur);
	
	// Listeners para mudanças de fullscreen e orientação (mobile)
	if (isMobileDevice()) {
		// Atualizar quando entrar/sair de fullscreen
		document.addEventListener('fullscreenchange', () => {
			console.log('🔄 Fullscreen mudou:', isFullscreen() ? 'ATIVO' : 'INATIVO');
		});
		document.addEventListener('webkitfullscreenchange', () => {
			console.log('🔄 Fullscreen mudou (webkit):', isFullscreen() ? 'ATIVO' : 'INATIVO');
		});
		document.addEventListener('mozfullscreenchange', () => {
			console.log('🔄 Fullscreen mudou (moz):', isFullscreen() ? 'ATIVO' : 'INATIVO');
		});
		
		// Atualizar quando a orientação mudar
		window.addEventListener('orientationchange', () => {
			console.log('🔄 Orientação mudou:', screen.orientation?.type || window.orientation);
		});
		
		// Atualizar quando a janela for redimensionada
		window.addEventListener('resize', () => {
			console.log('🔄 Janela redimensionada:', window.innerWidth, 'x', window.innerHeight);
		});
		
		console.log('✅ Listeners de fullscreen e orientação adicionados');
	}
	
	// Botão de pulo
	const jumpButton = document.getElementById('jumpButton');
	if (jumpButton) {
		const buttonPressHandler = handleButtonPress(Config);
		jumpButton.addEventListener('mousedown', buttonPressHandler);
		jumpButton.addEventListener('touchstart', buttonPressHandler);
		jumpButton.addEventListener('mouseup', handleButtonRelease);
		jumpButton.addEventListener('touchend', handleButtonRelease);
		jumpButton.addEventListener('mouseleave', handleButtonRelease);
		console.log('✅ Botão de pulo inicializado');
	} else {
		console.warn('⚠️ Botão de pulo não encontrado');
	}
	
	// Listener de teclado para barra de espaço
	let spacePressed = false;
	document.addEventListener('keydown', (e) => {
		// Bloquear se painel de leitura estiver aberto
		if (isReadingPanelOpen) return;
		
		if (e.code === 'Space' && !spacePressed) {
			e.preventDefault();
			spacePressed = true;
			
			// Adicionar efeito visual no botão
			if (jumpButton) {
				jumpButton.classList.add('pressed');
			}
			
			// Executar pulo
			if (!State.buttonPressed) {
				State.buttonPressed = true;
				jump(Config);
			}
		}
	});
	
	document.addEventListener('keyup', (e) => {
		if (e.code === 'Space') {
			e.preventDefault();
			spacePressed = false;
			
			// Remover efeito visual do botão
			if (jumpButton) {
				jumpButton.classList.remove('pressed');
			}
			
			// Soltar botão
			if (State.buttonPressed) {
				State.buttonPressed = false;
				
				// Se estiver balançando e soltar, soltar a teia
				if (State.playerState === 'balancando') {
					soltarTeia();
				}
			}
		}
	});
	
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
	
	// Mousemove no canvas (para mudar cursor quando sobre botão)
	Config.canvas.addEventListener('mousemove', handleCanvasMouseMove);
	
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
function handleCanvasMouseMove(event) {
	if (isReadingPanelOpen || State.gameOver || State.victory || !State.isRunning) {
		Config.canvas.style.cursor = 'default';
		return;
	}
	
	const rect = Config.canvas.getBoundingClientRect();
	const mouseX = event.clientX - rect.left;
	const mouseY = event.clientY - rect.top;
	
	// Verificar se o mouse está sobre o botão de fullscreen (mobile apenas)
	if (isMobileDevice()) {
		const fsX = ReadingSystem.fullscreenButtonX;
		const fsY = ReadingSystem.fullscreenButtonY;
		const fsSize = ReadingSystem.fullscreenButtonSize;
		
		if (mouseX >= fsX && mouseX <= fsX + fsSize &&
		    mouseY >= fsY && mouseY <= fsY + fsSize) {
			Config.canvas.style.cursor = 'pointer';
			return;
		}
	}
	
	// Verificar se o mouse está sobre o botão de leitura
	const btnX = ReadingSystem.buttonX;
	const btnY = ReadingSystem.buttonY;
	const btnSize = ReadingSystem.buttonSize;
	
	if (mouseX >= btnX && mouseX <= btnX + btnSize &&
	    mouseY >= btnY && mouseY <= btnY + btnSize) {
		Config.canvas.style.cursor = 'pointer';
	} else {
		Config.canvas.style.cursor = 'default';
	}
}

function handleCanvasClick(event) {
	if (isReadingPanelOpen || State.gameOver || State.victory || !State.isRunning) return;
	
	const rect = Config.canvas.getBoundingClientRect();
	const clickX = event.clientX - rect.left;
	const clickY = event.clientY - rect.top;
	
	// Verificar se clicou no botão de fullscreen (mobile apenas)
	if (isMobileDevice()) {
		const fsX = ReadingSystem.fullscreenButtonX;
		const fsY = ReadingSystem.fullscreenButtonY;
		const fsSize = ReadingSystem.fullscreenButtonSize;
		
		if (clickX >= fsX && clickX <= fsX + fsSize &&
		    clickY >= fsY && clickY <= fsY + fsSize) {
			toggleFullscreen();
			return;
		}
	}
	
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
