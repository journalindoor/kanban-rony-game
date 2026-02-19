/* ============================================
   Renderização (Canvas, Sprites, HUD)
   ============================================ */

// Desenhar prédio com detalhes
function drawBuilding(ctx, building, config) {
	// Corpo do prédio (ultrapassa o topo)
	ctx.fillStyle = building.color;
	ctx.fillRect(building.x, 0, building.width, config.asphaltY + config.playerSize);
	
	// Porta no térréo
	const doorWidth = building.width * 0.3;
	const doorHeight = 40;
	const doorX = building.x + building.width / 2 - doorWidth / 2;
	const doorY = config.asphaltY + config.playerSize - doorHeight;
	ctx.fillStyle = '#1F2937';
	ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
	
	// Janelas em vários andares
	const windowSize = 12;
	const windowSpacingY = 35; // espaçamento vertical entre andares
	const numWindows = building.width > 100 ? 3 : 2;
	
	// Desenhar janelas em vários andares (começando do primeiro andar)
	const numFloors = building.windowStates.length;
	
	for (let floor = 0; floor < numFloors; floor++) {
		const windowY = config.asphaltY + config.playerSize - 60 - (floor * windowSpacingY);
		
		for (let i = 0; i < numWindows; i++) {
			const windowX = building.x + (i + 1) * (building.width / (numWindows + 1)) - windowSize / 2;
			
			// Usar estado fixo: acesa ou apagada
			ctx.fillStyle = building.windowStates[floor][i] ? '#FCD34D' : '#4B5563';
			ctx.fillRect(windowX, windowY, windowSize, windowSize);
		}
	}
}

// Desenhar cone de trânsito (triângulo)
function drawCone(ctx, x, y, width, height) {
	ctx.fillStyle = '#F97316'; // Laranja
	ctx.beginPath();
	ctx.moveTo(x + width / 2, y); // Topo do triângulo
	ctx.lineTo(x, y + height); // Base esquerda
	ctx.lineTo(x + width, y + height); // Base direita
	ctx.closePath();
	ctx.fill();
}

// Desenhar buraco com gradiente vertical
function drawHole(ctx, x, y, width, height) {
	// Criar gradiente vertical (azul céu → azul escuro)
	const gradient = ctx.createLinearGradient(x, y, x, y + height);
	gradient.addColorStop(0, '#5DADE2'); // Topo: mesma cor do céu
	gradient.addColorStop(1, '#1B4F72'); // Base: azul escuro
	
	ctx.fillStyle = gradient;
	ctx.fillRect(x, y, width, height);
}

// Desenhar personagem
function drawPlayer(ctx, config) {
	if (config.playerImage && config.playerImage.complete) {
		let frameX = 0;
		let frameY = 0;
		
		// Verificar estado do personagem para escolher o frame correto
		if (State.playerState === 'noChao') {
			// Corrida: usar frames 1-6 (índices 0-5) da primeira linha
			frameX = State.currentFrame * config.spriteFrameWidth;
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
	
		// Aplicar efeito de piscar durante invencibilidade
		if (State.isInvincible) {
			// Piscar a cada 10 frames (alterna entre 50% e 100% de opacidade)
			const blinkCycle = Math.floor(State.invincibilityTimer / 10) % 2;
			ctx.globalAlpha = blinkCycle === 0 ? 0.5 : 1.0;
		}
	
		// Desenhar frame específico do spritesheet
		ctx.drawImage(
			config.playerImage,
			frameX, frameY,
			config.spriteFrameWidth, config.spriteFrameHeight,
			config.playerX, State.playerY,
			config.playerSize, config.playerSize
		);
		
		// Resetar opacidade
		if (State.isInvincible) {
			ctx.globalAlpha = 1.0;
		}
		
		// Desenhar efeitos de transformação (brilho ao redor)
		if (State.isTransforming) {
			// Brilho pulsante ao redor do personagem
			const glowSize = 50 + Math.sin(State.transformTimer / 3) * 10; // pulsa
			ctx.font = `${glowSize}px Arial`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			
			// Múltiplos brilhos em círculo
			const numGlows = 4;
			for (let i = 0; i < numGlows; i++) {
				const angle = (Math.PI * 2 * i) / numGlows + State.transformTimer / 10;
				const glowX = config.playerX + config.playerSize / 2 + Math.cos(angle) * 35;
				const glowY = State.playerY + config.playerSize / 2 + Math.sin(angle) * 35;
				
				// Fade out no final
				const alpha = State.transformTimer / 45;
				ctx.globalAlpha = alpha * 0.8;
				ctx.fillText('✨', glowX, glowY);
			}
			
			ctx.globalAlpha = 1.0;
		}
	} else {
		// Fallback: desenhar retângulo se imagem não carregar
		ctx.fillStyle = config.playerColor;
		ctx.fillRect(
			config.playerX,
			State.playerY,
			config.playerSize,
			config.playerSize
		);
	}
	
	// Desenhar partículas de transformação (sobre o personagem)
	if (State.transformParticles.length > 0) {
		ctx.font = '20px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		
		State.transformParticles.forEach(p => {
			const alpha = p.life / 45; // fade out
			ctx.globalAlpha = alpha;
			ctx.fillText(p.emoji, p.x, p.y);
		});
		
		ctx.globalAlpha = 1.0;
	}
}

// Desenhar teia
function drawWeb(ctx, config) {
	if (State.playerState === 'balancando' && State.webbedToPoint) {
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(State.webbedToPoint.x, State.webbedToPoint.y);
		ctx.lineTo(config.playerX + config.playerSize / 2, State.playerY + config.playerSize / 2);
		ctx.stroke();
		
		// Desenhar ponto de ancoragem
		ctx.fillStyle = '#fff';
		ctx.beginPath();
		ctx.arc(State.webbedToPoint.x, State.webbedToPoint.y, 4, 0, Math.PI * 2);
		ctx.fill();
	}
}

// Desenhar HUD
function drawHUD(ctx, config) {
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
	
	// Indicador de teias (se tiver guitarra)
	if (State.hasGuitarProtection) {
		ctx.fillStyle = '#FFD700'; // dourado
		ctx.font = 'bold 14px Courier New';
		ctx.fillText('🕷️ Teias: ' + State.webUsesRemaining, hudX + 12, hudY + 70);
	}
}

// Desenhar tela de vitória
function drawVictory(ctx, config) {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
	ctx.fillRect(0, 0, config.width, config.height);
	
	ctx.fillStyle = '#00ff00';
	ctx.font = 'bold 48px Courier New';
	ctx.textAlign = 'center';
	ctx.fillText('Você venceu!', config.width / 2, config.height / 2);
	ctx.fillStyle = '#fff';
	ctx.font = '20px Courier New';
	ctx.fillText('99999 metros percorridos!', config.width / 2, config.height / 2 + 50);
	ctx.textAlign = 'left';
}

// Desenhar tela de game over
function drawGameOver(ctx, config) {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
	ctx.fillRect(0, 0, config.width, config.height);
	
	// Título RONY RUNNER acima do Game Over
	ctx.fillStyle = '#FFFFFF';
	ctx.font = 'bold 32px Courier New';
	ctx.textAlign = 'center';
	ctx.fillText('RONY RUNNER', config.width / 2, config.height / 2 - 100);
	
	// Mensagem de derrota
	ctx.fillStyle = '#ff0000';
	ctx.font = 'bold 36px Courier New';
	ctx.fillText('BATEU!', config.width / 2, config.height / 2 - 40);
	
	ctx.fillStyle = '#FFFFFF';
	ctx.font = '20px Courier New';
	ctx.fillText('Ainda bem que o Rony tem plano de saúde...', config.width / 2, config.height / 2);
	ctx.textAlign = 'left';
}

// Desenhar item guitarra
function drawGuitarItem(ctx) {
	if (!State.guitarItem.active) return;
	
	const centerX = State.guitarItem.x + State.guitarItem.width / 2;
	const centerY = State.guitarItem.y + State.guitarItem.height / 2;
	const radius = State.guitarItem.width / 2;
	
	// Desenhar círculo com borda
	ctx.fillStyle = '#4A0E4E'; // roxo escuro
	ctx.strokeStyle = '#FFD700'; // dourado
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();
	
	// Desenhar emoji 🎸
	ctx.font = '20px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText('🎸', centerX, centerY);
}

// Renderizar tudo
function render() {
	const ctx = Config.ctx;
	
	// Limpar tela com fundo azul céu
	ctx.fillStyle = '#5DADE2';
	ctx.fillRect(0, 0, Config.width, Config.height);
	
	// Desenhar prédios no fundo
	for (let building of State.buildings) {
		drawBuilding(ctx, building, Config);
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
	
	// Atualizar offset da faixa (velocidade proporcional ao modo)
	if (State.isRunning && !State.isPaused) {
		const speedMultiplier = State.isPunkMode ? (Config.worldSpeedPunk / Config.worldSpeedNormal) : 1;
		const currentLaneSpeed = Config.laneSpeedBase * speedMultiplier;
		Config.laneOffset -= currentLaneSpeed;
	}
	
	// Desenhar personagem (fixo no X, mas move no Y)
	drawPlayer(ctx, Config);
	
	// Desenhar teia (se estiver balançando) - POR CIMA do personagem
	drawWeb(ctx, Config);
	
	// Desenhar objetos
	for (let obj of State.objects) {
		if (obj.type === 'buraco') {
			// Desenhar cone à esquerda (no nível do chão)
			drawCone(ctx, obj.x, obj.coneY, obj.coneWidth, obj.coneHeight);
			// Desenhar buraco à direita do cone
			drawHole(ctx, obj.x + obj.coneWidth, obj.holeY, obj.holeWidth, obj.holeHeight);
		} else if (obj.emoji) {
			// Obstáculo com emoji (carro)
			const fontSize = Math.min(obj.width, obj.height);
			ctx.font = `${fontSize}px Arial`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(obj.emoji, obj.x + obj.width / 2, obj.y + obj.height / 2);
			
			// DEBUG: Mostrar hitbox ajustado
			let topReduction, bottomReduction, sideReduction;
			
			if (obj.size === 'large') {
				// Carros grandes (110px) - reduções ajustadas para manter hitbox 104x91px
				topReduction = obj.height * 0.1273;
				bottomReduction = obj.height * 0.0455;
				sideReduction = obj.width * 0.0273;
			} else {
				// Carros pequenos e médios - reduções normais
				topReduction = obj.height * 0.25;
				bottomReduction = obj.height * 0.05;
				sideReduction = obj.width * 0.10;
			}
			
			const hitboxX = obj.x + sideReduction;
			const hitboxY = obj.y + topReduction;
			const hitboxWidth = obj.width - (sideReduction * 2);
			const hitboxHeight = obj.height - topReduction - bottomReduction;
			
			// Hitbox calculada (sem visualização)
		} else {
			// Outros obstáculos continuam como retângulos vermelhos
			ctx.fillStyle = obj.color;
			ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
		}
	}
	
	// Desenhar item guitarra (antes do HUD para ficar atrás)
	drawGuitarItem(ctx);
	
	// Desenhar HUD
	drawHUD(ctx, Config);
	
	// Mostrar Vitória
	if (State.victory) {
		drawVictory(ctx, Config);
	}
	
	// Mostrar Game Over
	if (State.gameOver) {
		drawGameOver(ctx, Config);
	}
}
