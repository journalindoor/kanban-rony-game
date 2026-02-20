/* ============================================
   Sistema de Itens Coletáveis
   ============================================ */

// Spawn de item guitarra com regras variadas
function spawnGuitarItem(config) {
	// Obter configurações da fase atual
	const phase = getCurrentPhase();
	const guitarConfig = phase.items.guitar;
	
	// Verificar se guitarra está habilitada nesta fase
	if (!guitarConfig.enabled) return;
	
	// Não spawnar se já tem item ativo
	if (State.guitarItem.active) return;
	
	// REGRA 1: Primeiro spawn aleatório (baseado na fase)
	if (!State.guitarItem.firstSpawnDone && State.distance >= guitarConfig.firstSpawnMin) {
		const randomSpawn = guitarConfig.firstSpawnMin + Math.floor(Math.random() * (guitarConfig.firstSpawnMax - guitarConfig.firstSpawnMin + 1));
		
		if (State.distance >= randomSpawn) {
			spawnGuitar(config);
			State.guitarItem.firstSpawnDone = true;
			console.log(`🎸 Primeira guitarra spawnou aos ${State.distance}m (alvo: ${randomSpawn}m)`);
			return;
		}
	}
	
	// Se jogador tem guitarra ativa, não spawnar outra
	if (State.hasGuitarProtection) {
		// Log apenas a cada 50m para não poluir console
		if (Math.floor(State.distance) % 50 === 0 && State.distance > 0) {
			console.log(`🎸 Aguardando... (jogador já tem guitarra aos ${State.distance}m)`);
		}
		return;
	}
	
	// REGRA 2: Após perder guitarra, próximo spawn (baseado na fase)
	if (State.guitarCollisionDistance > 0) {
		const nextSpawnAfterCollision = State.guitarCollisionDistance + guitarConfig.respawnAfterLoss;
		
		// Log de progresso a cada 50m
		if (Math.floor(State.distance) % 50 === 0 && State.distance < nextSpawnAfterCollision) {
			const remaining = nextSpawnAfterCollision - State.distance;
			console.log(`🎸 Próxima guitarra em ${remaining}m (após colisão aos ${State.guitarCollisionDistance}m)`);
		}
		
		if (State.distance >= nextSpawnAfterCollision && State.distance > State.guitarItem.lastSpawnDistance + 10) {
			spawnGuitar(config);
			State.guitarCollisionDistance = 0; // resetar contador
			console.log(`🎸 SPAWNOU! Guitarra apareceu aos ${State.distance}m (${guitarConfig.respawnAfterLoss}m após colisão em ${nextSpawnAfterCollision - guitarConfig.respawnAfterLoss}m)`);
			return;
		}
	}
	
	// REGRA 3: Spawn normal (baseado na fase)
	const timeSinceLastSpawn = State.distance - State.guitarItem.lastSpawnDistance;
	const randomInterval = guitarConfig.spawnIntervalMin + Math.floor(Math.random() * (guitarConfig.spawnIntervalMax - guitarConfig.spawnIntervalMin + 1));
	
	if (timeSinceLastSpawn >= randomInterval && State.distance > State.guitarItem.lastSpawnDistance + 100) {
		spawnGuitar(config);
		console.log(`🎸 Guitarra spawnou normalmente aos ${State.distance}m (${timeSinceLastSpawn}m desde última)`);
	}
}

// Função auxiliar para spawnar guitarra
function spawnGuitar(config) {
	const itemHeight = 30;
	const itemY = config.groundY - 80; // altura alcançável com pulo
	
	State.guitarItem.active = true;
	State.guitarItem.x = config.width;
	State.guitarItem.y = itemY;
	State.guitarItem.width = itemHeight;
	State.guitarItem.height = itemHeight;
	State.guitarItem.lastSpawnDistance = State.distance;
}

// Atualizar posição do item
function updateGuitarItem(config) {
	if (State.guitarItem.active) {
		// Guitarra sempre move com velocidade NORMAL (não acelera com o modo Punk)
		const guitarSpeed = config.worldSpeedNormal;
		
		// Mover item para esquerda
		State.guitarItem.x -= guitarSpeed;
		
		// Remover se sair da tela
		if (State.guitarItem.x + State.guitarItem.width < 0) {
			State.guitarItem.active = false;
			console.log('🎸 Guitarra saiu da tela sem ser coletada');
		}
	}
}

// Verificar se jogador coletou o item
function checkGuitarCollection(config) {
	if (!State.guitarItem.active) return;
	
	// Determinar qual hitbox usar baseado no estado
	let hitbox;
	if (State.playerState === 'noChao') {
		hitbox = config.hitboxes.correndo;
	} else if (State.playerState === 'pulando') {
		hitbox = config.hitboxes.pulando;
	} else if (State.playerState === 'balancando') {
		hitbox = config.hitboxes.pendurado;
	}
	
	// Hitbox do jogador
	const playerLeft = config.playerX + hitbox.offsetX;
	const playerRight = config.playerX + hitbox.offsetX + hitbox.width;
	const playerTop = State.playerY + hitbox.offsetY;
	const playerBottom = State.playerY + hitbox.offsetY + hitbox.height;
	
	// Hitbox do item
	const itemLeft = State.guitarItem.x;
	const itemRight = State.guitarItem.x + State.guitarItem.width;
	const itemTop = State.guitarItem.y;
	const itemBottom = State.guitarItem.y + State.guitarItem.height;
	
	// Detecção AABB
	if (
		playerRight > itemLeft &&
		playerLeft < itemRight &&
		playerBottom > itemTop &&
		playerTop < itemBottom
	) {
		// Coletou o item!
		State.guitarItem.active = false;
		State.isPunkMode = true;
		State.hasGuitarProtection = true;
		
		// Trocar sprite
		Config.playerImage = Config.playerImagePunk;
		
		// ATIVAR TRANSFORMAÇÃO COM EFEITOS VISUAIS
		State.isTransforming = true;
		State.transformTimer = 45; // 0.75s de efeitos visuais
		
		// Gerar partículas de transformação
		State.transformParticles = [];
		const particleEmojis = ['✨', '💫', '🎵', '⚡', '🎸', '🌟'];
		for (let i = 0; i < 12; i++) {
			const angle = (Math.PI * 2 * i) / 12; // distribuir em círculo
			State.transformParticles.push({
				emoji: particleEmojis[Math.floor(Math.random() * particleEmojis.length)],
				x: Config.playerX + Config.playerSize / 2,
				y: State.playerY + Config.playerSize / 2,
				vx: Math.cos(angle) * 3, // velocidade radial
				vy: Math.sin(angle) * 3 - 1, // pequeno impulso pra cima
				life: 45 // duração em frames
			});
		}
		
		// Mini salto visual (boost no pulo)
		if (State.playerState === 'noChao') {
			State.velocityY = -8; // pequeno impulso pra cima
			State.playerState = 'pulando';
		}
		
		// Dar 5 teias (só será ativado quando tocar o chão)
		// Mas se já estiver no chão, ativa imediatamente
		if (State.playerState === 'noChao') {
			State.webUsesRemaining = 5;
		}
		
		console.log(`🎸 GUITARRA COLETADA aos ${State.distance}m!`);
		console.log('✅ Modo PUNK ativado! 5 teias disponíveis ao tocar o chão.');
		console.log('🛡️ Vida extra ativa - próxima colisão não mata!');
	}
}
