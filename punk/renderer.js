/* ============================================
   Renderização (Canvas, Sprites, HUD)
   ============================================ */

// Desenhar céu em faixas horizontais (estilo retrô)
function drawPixelSky(ctx, phase, width, height) {
	const baseColor = phase.sky.color;
	
	// Criar faixas horizontais com variações do baseColor
	const numStripes = 8;
	const stripeHeight = height / numStripes;
	
	// Converter hex para RGB para criar variações
	const hex = baseColor.replace('#', '');
	const r = parseInt(hex.substr(0, 2), 16);
	const g = parseInt(hex.substr(2, 2), 16);
	const b = parseInt(hex.substr(4, 2), 16);
	
	for (let i = 0; i < numStripes; i++) {
		// Criar 3 tons discretos baseados na cor da fase
		let factor;
		if (i < 3) factor = 1.1; // Mais claro no topo
		else if (i < 6) factor = 1.0; // Tom base no meio
		else factor = 0.9; // Mais escuro embaixo
		
		const newR = Math.min(255, Math.floor(r * factor));
		const newG = Math.min(255, Math.floor(g * factor));
		const newB = Math.min(255, Math.floor(b * factor));
		
		const color = `rgb(${newR}, ${newG}, ${newB})`;
		ctx.fillStyle = color;
		ctx.fillRect(0, i * stripeHeight, width, stripeHeight + 1);
	}
}

// Desenhar montanha
function drawMountain(ctx, mountain, config) {
	const x = Math.floor(mountain.x);
	const width = Math.floor(mountain.width);
	const height = Math.floor(mountain.height);
	const baseY = config.asphaltY + config.playerSize - 40;
	
	ctx.fillStyle = mountain.color;
	ctx.beginPath();
	ctx.moveTo(x, baseY);
	ctx.lineTo(x + width * 0.3, baseY - height * 0.7);
	ctx.quadraticCurveTo(
		x + width * 0.5, baseY - height,
		x + width * 0.7, baseY - height * 0.7
	);
	ctx.lineTo(x + width, baseY);
	ctx.closePath();
	ctx.fill();
}

// Desenhar prédio com estilo pixel art
function drawBuilding(ctx, building, config) {
	const phase = getCurrentPhase();
	const x = Math.floor(building.x);
	const width = Math.floor(building.width);
	const height = config.asphaltY + config.playerSize;
	
	// FASE 0: Baixada Fluminense
	if (getCurrentBasePhase() === 0 && building.houseType) {
		const houseHeight = building.houseHeight || 80;
		const baseY = config.asphaltY + config.playerSize - houseHeight;
		
		// Fachada
		ctx.fillStyle = building.color;
		ctx.fillRect(x, baseY, width, houseHeight);
		
		// Borda lateral escura
		ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
		ctx.fillRect(x, baseY, 2, houseHeight);
		
		// Telhado
		if (building.roofType === 'triangular') {
			const roofColor = building.roofColor || '#8B4513';
			ctx.fillStyle = roofColor;
			ctx.beginPath();
			ctx.moveTo(x - 4, baseY);
			ctx.lineTo(x + width / 2, baseY - 20);
			ctx.lineTo(x + width + 4, baseY);
			ctx.closePath();
			ctx.fill();
		} else {
			const roofColor = building.roofColor || '#5A3E2B';
			ctx.fillStyle = roofColor;
			ctx.fillRect(x, baseY - 8, width, 8);
		}
		
		// Muro frontal (30% das casas)
		if (building.hasWall) {
			ctx.fillStyle = '#696969';
			const wallHeight = 10;
			ctx.fillRect(x, config.asphaltY + config.playerSize - wallHeight, width, wallHeight);
			ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
			ctx.fillRect(x, config.asphaltY + config.playerSize - wallHeight, 1, wallHeight);
		}
		
		// Placa de comércio
		if (building.houseType === 'shop' && building.signText) {
			ctx.fillStyle = '#FFD700';
			ctx.fillRect(x + 4, baseY + 8, width - 8, 16);
			ctx.fillStyle = '#000000';
			ctx.font = 'bold 10px "Courier New", monospace';
			ctx.textAlign = 'center';
			ctx.fillText(building.signText, x + width / 2, baseY + 17);
		}
		
		// Porta
		const doorWidth = building.houseType === 'shop' ? width * 0.4 : width * 0.3;
		const doorHeight = building.houseType === 'shop' ? 40 : 40;
		const doorX = x + (width - doorWidth) / 2;
		const doorY = config.asphaltY + config.playerSize - doorHeight;
		ctx.fillStyle = '#3E2723';
		ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
		ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
		ctx.fillRect(doorX + 2, doorY + 2, doorWidth - 4, doorHeight - 4);
		
		// Janelas (posicionadas acima da porta para evitar sobreposição)
		const numWindows = building.houseType === 'wide' ? 3 : (building.houseType === 'shop' ? 1 : 2);
		const windowY = baseY + 20;
		const doorTopY = doorY;
		
		for (let i = 0; i < numWindows; i++) {
			const windowX = x + (i + 1) * (width / (numWindows + 1));
			const windowBottomY = windowY + 12;
			
			// Verificar se janela NÃO intersecta com porta
			const windowLeft = windowX - 6;
			const windowRight = windowX + 6;
			const doorLeft = doorX;
			const doorRight = doorX + doorWidth;
			
			// Desenhar apenas se janela está completamente acima da porta OU fora da área horizontal da porta
			const isAboveDoor = windowBottomY < doorTopY;
			const isLeftOfDoor = windowRight < doorLeft;
			const isRightOfDoor = windowLeft > doorRight;
			
			if (isAboveDoor || isLeftOfDoor || isRightOfDoor) {
				ctx.fillStyle = building.windowStates?.[0]?.[i] ? '#FCD34D' : '#4B5563';
				ctx.fillRect(windowX - 6, windowY, 12, 12);
				ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
				ctx.fillRect(windowX, windowY, 1, 12);
				ctx.fillRect(windowX - 6, windowY + 6, 12, 1);
			}
		}
		return;
	}
	
	// Outras fases: prédios normais
	ctx.fillStyle = building.color;
	ctx.fillRect(x, 0, width, height);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
	ctx.fillRect(x, 0, 2, height);
	ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
	ctx.fillRect(x + width - 2, 0, 2, height);
	
	const doorWidth = Math.floor(width * 0.3 / 8) * 8;
	const doorHeight = 40;
	const doorX = x + Math.floor((width - doorWidth) / 2);
	const doorY = config.asphaltY + config.playerSize - doorHeight;
	ctx.fillStyle = '#000000';
	ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
	ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
	ctx.fillRect(doorX + 2, doorY + 2, doorWidth - 4, doorHeight - 4);
	
	const windowSize = 8;
	const numWindows = building.width > 100 ? 3 : 2;
	const numFloors = building.windowStates.length;
	for (let floor = 0; floor < numFloors; floor++) {
		const windowY = config.asphaltY + config.playerSize - 56 - (floor * 32);
		for (let i = 0; i < numWindows; i++) {
			const windowX = Math.floor(x + (i + 1) * (width / (numWindows + 1)));
			const isLit = building.windowStates[floor][i];
			ctx.fillStyle = isLit ? phase.environment.windowLightColor : phase.environment.windowOffColor;
			ctx.fillRect(windowX - 4, windowY, windowSize, windowSize);
			if (isLit) {
				ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
				ctx.fillRect(windowX, windowY, 1, windowSize);
				ctx.fillRect(windowX - 4, windowY + 4, windowSize, 1);
			}
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

// Desenhar buraco (estilo pixel art - sem gradiente)
function drawHole(ctx, x, y, width, height) {
	// Fundo escuro
	ctx.fillStyle = '#1B4F72';
	ctx.fillRect(x, y, width, height);
	
	// Padrão de pixels alternados (textura simples)
	ctx.fillStyle = '#2A5F82';
	for (let py = y; py < y + height; py += 4) {
		for (let px = x; px < x + width; px += 4) {
			if ((px + py) % 8 === 0) {
				ctx.fillRect(px, py, 2, 2);
			}
		}
	}
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
	
// Offset visual para personagem parecer estar dentro da rua
	const visualOffsetY = 12;
	
	ctx.drawImage(
		config.playerImage,
		frameX, frameY,
		config.spriteFrameWidth, config.spriteFrameHeight,
		config.playerX, State.playerY + visualOffsetY,
			config.playerSize, config.playerSize
		);
		
		if (State.isInvincible) ctx.globalAlpha = 1.0;
		
		// Efeitos de transformação
		if (State.isTransforming) {
			const visualOffsetY = 12;
			const glowSize = 50 + Math.sin(State.transformTimer / 3) * 10;
			ctx.font = `${Math.floor(glowSize)}px "Courier New", monospace`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			
			const numGlows = 4;
			for (let i = 0; i < numGlows; i++) {
				const angle = (Math.PI * 2 * i) / numGlows + State.transformTimer / 10;
				const glowX = config.playerX + config.playerSize / 2 + Math.cos(angle) * 35;
				const glowY = State.playerY + visualOffsetY + config.playerSize / 2 + Math.sin(angle) * 35;
				
				const alpha = State.transformTimer / 45;
				ctx.globalAlpha = alpha * 0.8;
				ctx.fillText('✨', glowX, glowY);
			}
			ctx.globalAlpha = 1.0;
		}
	} else {
		// Fallback
		const visualOffsetY = 12;
		ctx.fillStyle = config.playerColor;
		ctx.fillRect(config.playerX, State.playerY + visualOffsetY, config.playerSize, config.playerSize);
	}
	
	// Partículas de transformação (fade em steps discretos)
	if (State.transformParticles.length > 0) {
		ctx.font = '20px "Courier New", monospace';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		
		State.transformParticles.forEach(p => {
			// Opacidade em steps (1 → 0.66 → 0.33 → 0)
			const lifePercent = p.life / 45;
			let alpha;
			if (lifePercent > 0.66) alpha = 1.0;
			else if (lifePercent > 0.33) alpha = 0.66;
			else alpha = 0.33;
			
			ctx.globalAlpha = alpha;
			ctx.fillText(p.emoji, Math.floor(p.x), Math.floor(p.y));
		});
		ctx.globalAlpha = 1.0;
	}
	
	// Debug hitbox
	if (debugHitbox) {
		const visualOffsetY = 12;
		let hitbox = config.hitboxes.correndo;
		if (State.playerState === 'pulando') hitbox = config.hitboxes.pulando;
		else if (State.playerState === 'balancando') hitbox = config.hitboxes.pendurado;
		
		const hitboxX = config.playerX + hitbox.offsetX;
		const hitboxY = State.playerY + hitbox.offsetY + visualOffsetY;
		
		ctx.strokeStyle = '#00ff00';
		ctx.lineWidth = 1;
		ctx.strokeRect(hitboxX, hitboxY, hitbox.width, hitbox.height);
		ctx.fillStyle = '#00ff00';
		ctx.font = '10px "Courier New", monospace';
		ctx.fillText('PLAYER', hitboxX, hitboxY - 2);
	}
}

// Desenhar teia
function drawWeb(ctx, config) {
	if (State.playerState === 'balancando' && State.webbedToPoint) {
		const visualOffsetY = 12;
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(State.webbedToPoint.x, State.webbedToPoint.y);
		ctx.lineTo(config.playerX + config.playerSize / 2, State.playerY + visualOffsetY + config.playerSize / 2);
		ctx.stroke();
		
		// Desenhar ponto de ancoragem
		ctx.fillStyle = '#fff';
		ctx.beginPath();
		ctx.arc(State.webbedToPoint.x, State.webbedToPoint.y, 4, 0, Math.PI * 2);
		ctx.fill();
	}
}

// Desenhar HUD (estilo pixel art)
function drawHUD(ctx, config) {
	const hudX = 10;
	const hudY = 10;
	const hudWidth = 220;
	const hudHeight = 60;
	
	// Fundo sólido preto
	ctx.fillStyle = '#000000';
	ctx.fillRect(hudX, hudY, hudWidth, hudHeight);
	
	// Borda clara 1px (estilo retrô)
	ctx.strokeStyle = '#00FFFF';
	ctx.lineWidth = 1;
	ctx.strokeRect(hudX, hudY, hudWidth, hudHeight);
	
	// Sombra pixel (2px offset, sem blur)
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect(hudX + 2, hudY + 2, hudWidth, hudHeight);
	
	// Redesenhar fundo por cima da sombra
	ctx.fillStyle = '#000000';
	ctx.fillRect(hudX, hudY, hudWidth, hudHeight);
	ctx.strokeStyle = '#00FFFF';
	ctx.strokeRect(hudX, hudY, hudWidth, hudHeight);
	
	// Texto do HUD (sem suavização)
	ctx.fillStyle = '#00FFFF';
	ctx.font = '12px "Courier New", monospace';
	ctx.textAlign = 'left';
	
	// Distância
	const distanceStr = String(State.distance).padStart(5, '0');
	ctx.fillText('DIST: ' + distanceStr + 'm', hudX + 8, hudY + 22);
	
	// Recorde
	const bestStr = String(State.bestDistance).padStart(5, '0');
	ctx.fillText('BEST: ' + bestStr + 'm', hudX + 8, hudY + 42);
	
	// Indicador de fase (debug)
	const phaseId = getCurrentPhaseId();
	ctx.fillStyle = '#FF00FF';
	ctx.font = '10px "Courier New", monospace';
	ctx.fillText('PHASE: ' + phaseId, hudX + 8, hudY + 56);
	
	// Indicador de teias
	if (State.hasGuitarProtection) {
		ctx.fillStyle = '#FFFF00';
		ctx.font = '10px "Courier New", monospace';
		ctx.fillText('WEBS: ' + State.webUsesRemaining, hudX + 120, hudY + 56);
	}
}

// Desenhar tela de vitória (estilo pixel art)
function drawVictory(ctx, config) {
	// Overlay sólido
	ctx.fillStyle = '#000000';
	ctx.globalAlpha = 0.8;
	ctx.fillRect(0, 0, config.width, config.height);
	ctx.globalAlpha = 1.0;
	
	// Texto com sombra pixel
	ctx.fillStyle = '#006600';
	ctx.font = 'bold 48px "Courier New", monospace';
	ctx.textAlign = 'center';
	ctx.fillText('VOCE VENCEU!', config.width / 2 + 3, config.height / 2 - 17);
	ctx.fillStyle = '#00FF00';
	ctx.fillText('VOCE VENCEU!', config.width / 2, config.height / 2 - 20);
	
	ctx.fillStyle = '#CCCCCC';
	ctx.font = '16px "Courier New", monospace';
	ctx.fillText('99999 metros!', config.width / 2, config.height / 2 + 30);
	ctx.textAlign = 'left';
}

// Desenhar tela de game over (estilo pixel art)
function drawGameOver(ctx, config) {
	// Overlay sólido (sem transparência gradual)
	ctx.fillStyle = '#000000';
	ctx.globalAlpha = 0.8;
	ctx.fillRect(0, 0, config.width, config.height);
	ctx.globalAlpha = 1.0;
	
	// Título com sombra pixel
	ctx.fillStyle = '#000000';
	ctx.font = 'bold 32px "Courier New", monospace';
	ctx.textAlign = 'center';
	ctx.fillText('RONY RUNNER', config.width / 2 + 2, config.height / 2 - 98);
	ctx.fillStyle = '#FFFFFF';
	ctx.fillText('RONY RUNNER', config.width / 2, config.height / 2 - 100);
	
	// Mensagem de derrota com sombra
	ctx.fillStyle = '#800000';
	ctx.font = 'bold 36px "Courier New", monospace';
	ctx.fillText('BATEU!', config.width / 2 + 2, config.height / 2 - 38);
	ctx.fillStyle = '#FF0000';
	ctx.fillText('BATEU!', config.width / 2, config.height / 2 - 40);
	
	ctx.fillStyle = '#CCCCCC';
	ctx.font = '16px "Courier New", monospace';
	ctx.fillText('Ainda bem que o Rony tem plano de saude...', config.width / 2, config.height / 2 + 20);
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
	ctx.font = '20px "Courier New", monospace';
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
		ctx.font = '10px "Courier New", monospace';
		ctx.fillText('GUITAR', State.guitarItem.x, State.guitarItem.y - 2);
	}
}

// Renderizar tudo
function render() {
	const ctx = Config.ctx;
	const phase = getCurrentPhase();
	
	// Desabilitar suavização para visual pixel art
	ctx.imageSmoothingEnabled = false;
	
	// Limpar tela com céu em faixas horizontais (estilo retrô)
	drawPixelSky(ctx, phase, Config.width, Config.height);
	
	// Desenhar montanhas (fase 0 apenas)
	if (getCurrentBasePhase() === 0 && State.mountains) {
		for (let mountain of State.mountains) {
			drawMountain(ctx, mountain, Config);
		}
	}
	
	// Desenhar prédios no fundo
	for (let building of State.buildings) {
		drawBuilding(ctx, building, Config);
	}
	
	// Desenhar asfalto com textura pixel
	const asphaltY = Config.asphaltY + Config.playerSize;
	ctx.fillStyle = phase.environment.asphaltColor;
	ctx.fillRect(0, asphaltY, Config.width, Config.asphaltHeight);
	
	// FASE 0: Bueiros
	if (getCurrentBasePhase() === 0) {
		const laneY = Config.asphaltY + Config.playerSize + 25;
		const bueiroSpacing = 1200;
		const offset = Math.floor(Config.laneOffset);
		const width = 28;
		const height = 14;
		
		for (let x = -bueiroSpacing + (offset % bueiroSpacing); x < Config.width + width; x += bueiroSpacing) {
			const bueiroX = Math.floor(x);
			const bueiroY = laneY - height / 2;
			
			ctx.fillStyle = '#1A1A1A';
			ctx.beginPath();
			ctx.ellipse(bueiroX + width/2, bueiroY + height/2, width/2, height/2, 0, 0, Math.PI * 2);
			ctx.fill();
			
			ctx.strokeStyle = '#2B2B2B';
			ctx.lineWidth = 1;
			ctx.stroke();
			
			ctx.strokeStyle = '#0D0D0D';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.ellipse(bueiroX + width/2, bueiroY + height - 2, width/2 - 2, height/2 - 2, 0, 0, Math.PI);
			ctx.stroke();
			
			ctx.strokeStyle = '#252525';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(bueiroX + 6, bueiroY + height/2);
			ctx.lineTo(bueiroX + width - 6, bueiroY + height/2);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(bueiroX + width/2, bueiroY + 3);
			ctx.lineTo(bueiroX + width/2, bueiroY + height - 3);
			ctx.stroke();
		}
	} else {
		ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
		for (let py = asphaltY; py < asphaltY + Config.asphaltHeight; py += 4) {
			for (let px = 0; px < Config.width; px += 4) {
				if (Math.random() > 0.7) {
					ctx.fillRect(px, py, 2, 2);
				}
			}
		}
	}
	
	// Faixa tracejada (não desenhar na fase 0)
	if (getCurrentBasePhase() !== 0) {
		ctx.fillStyle = phase.environment.laneColor;
		const laneY = Config.asphaltY + Config.playerSize + 25;
		const dashPattern = Config.laneDashWidth + Config.laneDashGap;
		for (let x = -dashPattern + (Config.laneOffset % dashPattern); x < Config.width; x += dashPattern) {
			ctx.fillRect(Math.floor(x), laneY, Config.laneDashWidth, 6);
		}
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
			const fontSize = Math.floor(Math.min(obj.width, obj.height));
			ctx.font = `${fontSize}px "Courier New", monospace`;
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
				ctx.font = '10px "Courier New", monospace';
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
	
	// Desenhar botão de leitura (sempre visível durante o jogo)
	if (State.isRunning && !isReadingPanelOpen) {
		drawReadingButton(ctx, Config.width);
		
		// Desenhar botão de fullscreen (apenas em mobile)
		if (isMobileDevice()) {
			drawFullscreenButton(ctx, Config.width);
		}
	}
	
	// Mostrar Vitória
	if (State.victory) {
		drawVictory(ctx, Config);
	}
	
	// Mostrar Game Over
	if (State.gameOver) {
		drawGameOver(ctx, Config);
	}
}

// Desenhar botão de leitura (estilo pixel art)
function drawReadingButton(ctx, canvasWidth) {
	// Verificar se ReadingSystem está disponível
	if (typeof ReadingSystem === 'undefined') {
		console.error('❌ ReadingSystem não definido em drawReadingButton');
		return;
	}
	
	// Posição do botão (canto superior direito)
	ReadingSystem.buttonX = canvasWidth - ReadingSystem.buttonSize - 10;
	const x = ReadingSystem.buttonX;
	const y = ReadingSystem.buttonY;
	const size = ReadingSystem.buttonSize;
	
	// Inicializar tempo de animação se há novo conteúdo e ainda não foi inicializado
	if (ReadingSystem.hasNewContent && ReadingSystem.animationStartTime === 0) {
		ReadingSystem.animationStartTime = performance.now();
	} else if (!ReadingSystem.hasNewContent) {
		ReadingSystem.animationStartTime = 0;
	}
	
	// Calcular pulsação suave (apenas quando há novo conteúdo)
	let pulseScale = 1;
	let glowIntensity = 0;
	
	if (ReadingSystem.hasNewContent && ReadingSystem.animationStartTime > 0) {
		const elapsed = performance.now() - ReadingSystem.animationStartTime;
		const pulseSpeed = 0.002; // Velocidade da pulsação (mais lento = mais suave)
		const pulseAmount = 0.06; // Quantidade de pulsação (6% de variação)
		
		// Pulsação suave usando sine wave
		pulseScale = 1 + Math.sin(elapsed * pulseSpeed) * pulseAmount;
		
		// Intensidade do glow (0 a 1) também baseado em sine wave
		glowIntensity = (Math.sin(elapsed * pulseSpeed) + 1) / 2; // Normalizar para 0-1
	}
	
	// Aplicar escala de pulsação
	const scaledSize = size * pulseScale;
	const offsetX = (scaledSize - size) / 2;
	const offsetY = (scaledSize - size) / 2;
	const scaledX = x - offsetX;
	const scaledY = y - offsetY;
	
	// Cor do botão (amarelo se há novo conteúdo, cinza caso contrário)
	const buttonColor = ReadingSystem.hasNewContent ? '#FFFF00' : '#666666';
	
	// Glow externo (apenas quando há novo conteúdo)
	if (ReadingSystem.hasNewContent && glowIntensity > 0) {
		const glowSize = 4 * glowIntensity;
		const glowAlpha = 0.4 * glowIntensity;
		
		ctx.fillStyle = `rgba(255, 255, 0, ${glowAlpha})`;
		ctx.fillRect(
			scaledX - glowSize,
			scaledY - glowSize,
			scaledSize + glowSize * 2,
			scaledSize + glowSize * 2
		);
	}
	
	// Sombra pixel (2px offset, sem blur)
	ctx.fillStyle = '#000000';
	ctx.fillRect(scaledX + 2, scaledY + 2, scaledSize, scaledSize);
	
	// Fundo do botão
	ctx.fillStyle = buttonColor;
	ctx.fillRect(scaledX, scaledY, scaledSize, scaledSize);
	
	// Borda preta 2px
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 2;
	ctx.strokeRect(scaledX, scaledY, scaledSize, scaledSize);
	
	// Ícone de caderno simplificado (pixel art)
	ctx.fillStyle = '#FFFFFF';
	const iconPadding = 10 * pulseScale;
	const iconX = scaledX + iconPadding;
	const iconY = scaledY + iconPadding;
	const iconWidth = scaledSize - iconPadding * 2;
	const iconHeight = scaledSize - iconPadding * 2;
	
	ctx.fillRect(iconX, iconY, iconWidth, iconHeight);
	
	// Linhas do caderno (pretas, grossas)
	ctx.fillStyle = '#000000';
	for (let i = 1; i <= 3; i++) {
		const lineY = iconY + (iconHeight / 4) * i;
		ctx.fillRect(iconX + 4 * pulseScale, lineY, iconWidth - 8 * pulseScale, 2 * pulseScale);
	}
	
	// Espiral (círculos sólidos)
	for (let i = 0; i < 3; i++) {
		const spiralY = iconY + 8 * pulseScale + (i * 8 * pulseScale);
		ctx.fillRect(iconX - 4 * pulseScale, spiralY, 4 * pulseScale, 4 * pulseScale);
	}
	
	// Badge "Novo" se houver conteúdo novo
	if (ReadingSystem.hasNewContent) {
		const badgeWidth = 32;
		const badgeHeight = 12;
		const badgeX = scaledX + scaledSize - badgeWidth + 2;
		const badgeY = scaledY - 4;
		
		// Glow do badge (pulsante)
		if (glowIntensity > 0) {
			const badgeGlowAlpha = 0.5 * glowIntensity;
			ctx.fillStyle = `rgba(255, 0, 0, ${badgeGlowAlpha})`;
			ctx.fillRect(
				badgeX - 2,
				badgeY - 2,
				badgeWidth + 4,
				badgeHeight + 4
			);
		}
		
		// Fundo vermelho
		ctx.fillStyle = '#CC0000';
		ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
		
		// Borda branca
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 1;
		ctx.strokeRect(badgeX, badgeY, badgeWidth, badgeHeight);
		
		// Texto "Novo" com opacidade pulsante
		const textAlpha = 0.7 + (glowIntensity * 0.3); // Varia de 0.7 a 1.0
		ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
		ctx.font = 'bold 8px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('NOVO', badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
		
		// Resetar alinhamento
		ctx.textAlign = 'left';
		ctx.textBaseline = 'alphabetic';
	}
	
	// Calcular escala do pulse (se estiver ativo - para quando fecha painel)
	let closePulseScale = 1;
	if (ReadingSystem.buttonPulseTime > 0) {
		const elapsed = performance.now() - ReadingSystem.buttonPulseTime;
		const pulseDuration = 300; // 300ms
		
		if (elapsed < pulseDuration) {
			// Animação: 1 → 1.15 → 1
			const progress = elapsed / pulseDuration;
			const pulsePhase = Math.sin(progress * Math.PI); // 0 → 1 → 0
			closePulseScale = 1 + (pulsePhase * 0.15);
			
			// Nota: Esta animação de fechamento é separada e sobrescreve a pulsação acima
			// quando o painel é fechado
		} else {
			// Terminou a animação
			ReadingSystem.buttonPulseTime = 0;
		}
	}
}

// Desenhar botão de fullscreen (estilo pixel art - apenas mobile)
function drawFullscreenButton(ctx, canvasWidth) {
	// Verificar se ReadingSystem está disponível
	if (typeof ReadingSystem === 'undefined') {
		console.error('❌ ReadingSystem não definido em drawFullscreenButton');
		return;
	}
	
	// Posição do botão (ao lado esquerdo do botão de leitura)
	const readingBtnX = canvasWidth - ReadingSystem.buttonSize - 10;
	ReadingSystem.fullscreenButtonX = readingBtnX - ReadingSystem.fullscreenButtonSize - ReadingSystem.fullscreenButtonGap;
	
	const x = ReadingSystem.fullscreenButtonX;
	const y = ReadingSystem.fullscreenButtonY;
	const size = ReadingSystem.fullscreenButtonSize;
	
	// Verificar se está em fullscreen
	const inFullscreen = isFullscreen();
	const buttonColor = inFullscreen ? '#00CC00' : '#666666'; // Verde se ativo, cinza se não
	
	// Sombra pixel (2px offset, sem blur)
	ctx.fillStyle = '#000000';
	ctx.fillRect(x + 2, y + 2, size, size);
	
	// Fundo do botão
	ctx.fillStyle = buttonColor;
	ctx.fillRect(x, y, size, size);
	
	// Borda preta 2px
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, size, size);
	
	// Ícone de fullscreen (setas nos cantos)
	ctx.fillStyle = '#FFFFFF';
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 3;
	
	const iconPadding = 12;
	const iconSize = size - iconPadding * 2;
	const iconX = x + iconPadding;
	const iconY = y + iconPadding;
	const arrowSize = 8;
	
	if (inFullscreen) {
		// Ícone de sair do fullscreen (setas apontando para dentro)
		// Canto superior esquerdo
		ctx.beginPath();
		ctx.moveTo(iconX + arrowSize, iconY);
		ctx.lineTo(iconX, iconY);
		ctx.lineTo(iconX, iconY + arrowSize);
		ctx.stroke();
		
		// Canto superior direito
		ctx.beginPath();
		ctx.moveTo(iconX + iconSize - arrowSize, iconY);
		ctx.lineTo(iconX + iconSize, iconY);
		ctx.lineTo(iconX + iconSize, iconY + arrowSize);
		ctx.stroke();
		
		// Canto inferior esquerdo
		ctx.beginPath();
		ctx.moveTo(iconX, iconY + iconSize - arrowSize);
		ctx.lineTo(iconX, iconY + iconSize);
		ctx.lineTo(iconX + arrowSize, iconY + iconSize);
		ctx.stroke();
		
		// Canto inferior direito
		ctx.beginPath();
		ctx.moveTo(iconX + iconSize, iconY + iconSize - arrowSize);
		ctx.lineTo(iconX + iconSize, iconY + iconSize);
		ctx.lineTo(iconX + iconSize - arrowSize, iconY + iconSize);
		ctx.stroke();
	} else {
		// Ícone de entrar em fullscreen (setas apontando para fora)
		// Canto superior esquerdo
		ctx.beginPath();
		ctx.moveTo(iconX, iconY + arrowSize);
		ctx.lineTo(iconX, iconY);
		ctx.lineTo(iconX + arrowSize, iconY);
		ctx.stroke();
		
		// Canto superior direito
		ctx.beginPath();
		ctx.moveTo(iconX + iconSize, iconY + arrowSize);
		ctx.lineTo(iconX + iconSize, iconY);
		ctx.lineTo(iconX + iconSize - arrowSize, iconY);
		ctx.stroke();
		
		// Canto inferior esquerdo
		ctx.beginPath();
		ctx.moveTo(iconX + arrowSize, iconY + iconSize);
		ctx.lineTo(iconX, iconY + iconSize);
		ctx.lineTo(iconX, iconY + iconSize - arrowSize);
		ctx.stroke();
		
		// Canto inferior direito
		ctx.beginPath();
		ctx.moveTo(iconX + iconSize - arrowSize, iconY + iconSize);
		ctx.lineTo(iconX + iconSize, iconY + iconSize);
		ctx.lineTo(iconX + iconSize, iconY + iconSize - arrowSize);
		ctx.stroke();
	}
}
