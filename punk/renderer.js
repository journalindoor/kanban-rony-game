/* ============================================
   Renderização (Canvas, Sprites, HUD)
   ============================================ */

// Desenhar prédio com detalhes
function drawBuilding(ctx, building, config) {
	const phase = getCurrentPhase();
	
	ctx.fillStyle = building.color;
	ctx.fillRect(building.x, 0, building.width, config.asphaltY + config.playerSize);
	
	// Porta no térreo
	const doorWidth = building.width * 0.3;
	const doorHeight = 40;
	const doorX = building.x + building.width / 2 - doorWidth / 2;
	const doorY = config.asphaltY + config.playerSize - doorHeight;
	ctx.fillStyle = '#1F2937';
	ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
	
	// Janelas em vários andares
	const windowSize = 12;
	const windowSpacingY = 35;
	const numWindows = building.width > 100 ? 3 : 2;
	const numFloors = building.windowStates.length;
	
	for (let floor = 0; floor < numFloors; floor++) {
		const windowY = config.asphaltY + config.playerSize - 60 - (floor * windowSpacingY);
		
		for (let i = 0; i < numWindows; i++) {
			const windowX = building.x + (i + 1) * (building.width / (numWindows + 1)) - windowSize / 2;
			ctx.fillStyle = building.windowStates[floor][i] ? phase.environment.windowLightColor : phase.environment.windowOffColor;
			ctx.fillRect(windowX, windowY, windowSize, windowSize);
		}
	}
}

// Desenhar cone de trânsito
function drawCone(ctx, x, y, width, height) {
	ctx.fillStyle = '#F97316';
	ctx.beginPath();
	ctx.moveTo(x + width / 2, y);
	ctx.lineTo(x, y + height);
	ctx.lineTo(x + width, y + height);
	ctx.closePath();
	ctx.fill();
}

// Desenhar buraco
function drawHole(ctx, x, y, width, height) {
	const gradient = ctx.createLinearGradient(x, y, x, y + height);
	gradient.addColorStop(0, '#5DADE2');
	gradient.addColorStop(1, '#1B4F72');
	ctx.fillStyle = gradient;
	ctx.fillRect(x, y, width, height);
}

// Desenhar personagem
function drawPlayer(ctx, config) {
	if (config.playerImage && config.playerImage.complete) {
		let frameX = 0, frameY = 0;
		
		// Escolher frame baseado no estado
		if (State.playerState === 'noChao') {
			frameX = State.currentFrame * config.spriteFrameWidth;
			frameY = 0;
		} else if (State.playerState === 'pulando') {
			frameX = 0;
			frameY = 64;
		} else if (State.playerState === 'balancando') {
			frameX = 64;
			frameY = 64;
		}
	
		// Piscar durante invencibilidade
		if (State.isInvincible) {
			const blinkCycle = Math.floor(State.invincibilityTimer / 10) % 2;
			ctx.globalAlpha = blinkCycle === 0 ? 0.5 : 1.0;
		}
	
		ctx.drawImage(
			config.playerImage,
			frameX, frameY,
			config.spriteFrameWidth, config.spriteFrameHeight,
			config.playerX, State.playerY,
			config.playerSize, config.playerSize
		);
		
		if (State.isInvincible) ctx.globalAlpha = 1.0;
		
		// Efeitos de transformação
		if (State.isTransforming) {
			const glowSize = 50 + Math.sin(State.transformTimer / 3) * 10;
			ctx.font = `${glowSize}px Arial`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			
			const numGlows = 4;
			for (let i = 0; i < numGlows; i++) {
				const angle = (Math.PI * 2 * i) / numGlows + State.transformTimer / 10;
				const glowX = config.playerX + config.playerSize / 2 + Math.cos(angle) * 35;
				const glowY = State.playerY + config.playerSize / 2 + Math.sin(angle) * 35;
				
				const alpha = State.transformTimer / 45;
				ctx.globalAlpha = alpha * 0.8;
				ctx.fillText('✨', glowX, glowY);
			}
			ctx.globalAlpha = 1.0;
		}
	} else {
		// Fallback
		ctx.fillStyle = config.playerColor;
		ctx.fillRect(config.playerX, State.playerY, config.playerSize, config.playerSize);
	}
	
	// Partículas de transformação
	if (State.transformParticles.length > 0) {
		ctx.font = '20px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		
		State.transformParticles.forEach(p => {
			const alpha = p.life / 45;
			ctx.globalAlpha = alpha;
			ctx.fillText(p.emoji, p.x, p.y);
		});
		ctx.globalAlpha = 1.0;
	}
	
	// Debug hitbox
	if (debugHitbox) {
		let hitbox = config.hitboxes.correndo;
		if (State.playerState === 'pulando') hitbox = config.hitboxes.pulando;
		else if (State.playerState === 'balancando') hitbox = config.hitboxes.pendurado;
		
		const hitboxX = config.playerX + hitbox.offsetX;
		const hitboxY = State.playerY + hitbox.offsetY;
		
		ctx.strokeStyle = '#00ff00';
		ctx.lineWidth = 1;
		ctx.strokeRect(hitboxX, hitboxY, hitbox.width, hitbox.height);
		ctx.fillStyle = '#00ff00';
		ctx.font = '10px Arial';
		ctx.fillText('PLAYER', hitboxX, hitboxY - 2);
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
	
	// Obter emoji da guitarra da fase atual
	const phase = getCurrentPhase();
	const guitarEmoji = phase.items.guitar.emoji;
	
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
	
	// Desenhar emoji (da fase)
	ctx.font = '20px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(guitarEmoji, centerX, centerY);
	
	// DEBUG: Desenhar hitbox do item
	if (debugHitbox) {
		ctx.strokeStyle = '#00ff00';
		ctx.lineWidth = 1;
		ctx.strokeRect(State.guitarItem.x, State.guitarItem.y, State.guitarItem.width, State.guitarItem.height);
		
		// Label
		ctx.fillStyle = '#00ff00';
		ctx.font = '10px Arial';
		ctx.fillText('GUITAR', State.guitarItem.x, State.guitarItem.y - 2);
	}
}

// Renderizar tudo
function render() {
	const ctx = Config.ctx;
	const phase = getCurrentPhase();
	
	// Limpar tela com fundo (cor da fase)
	ctx.fillStyle = phase.sky.color;
	ctx.fillRect(0, 0, Config.width, Config.height);
	
	// Desenhar prédios no fundo
	for (let building of State.buildings) {
		drawBuilding(ctx, building, Config);
	}
	
	// Desenhar asfalto (cor da fase)
	ctx.fillStyle = phase.environment.asphaltColor;
	ctx.fillRect(0, Config.asphaltY + Config.playerSize, Config.width, Config.asphaltHeight);
	
	// Desenhar faixa tracejada (cor da fase)
	ctx.fillStyle = phase.environment.laneColor;
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
			
			// DEBUG: Desenhar hitbox do obstáculo
			if (debugHitbox) {
				ctx.strokeStyle = '#00ff00';
				ctx.lineWidth = 1;
				ctx.strokeRect(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
				
				// Label
				ctx.fillStyle = '#00ff00';
				ctx.font = '10px Arial';
				ctx.fillText(obj.size.toUpperCase(), hitboxX, hitboxY - 2);
			}
		} else {
			// Outros obstáculos continuam como retângulos vermelhos
			ctx.fillStyle = obj.color;
			ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
			
			// DEBUG: Hitbox para outros obstáculos
			if (debugHitbox) {
				ctx.strokeStyle = '#00ff00';
				ctx.lineWidth = 1;
				ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
			}
		}
	}
	
	// Desenhar item guitarra (antes do HUD para ficar atrás)
	drawGuitarItem(ctx);
	
	// Desenhar HUD
	drawHUD(ctx, Config);
	
	// Desenhar banner de fase (sobre o HUD)
	drawPhaseBanner(ctx, Config.width);
	
	// Desenhar botão de leitura (UI fixa)
	drawReadingButton(ctx, Config.width);
	
	// Mostrar Vitória
	if (State.victory) {
		drawVictory(ctx, Config);
	}
	
	// Mostrar Game Over
	if (State.gameOver) {
		drawGameOver(ctx, Config);
	}
	
	// Desenhar painel de leitura POR ÚLTIMO - acima de TUDO
	drawReadingPanel(ctx, Config.width, Config.height);
}
