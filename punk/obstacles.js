/* ============================================
   Obstáculos e Objetos
   ============================================ */

// Probabilidade de spawnar dois veículos pequenos juntos (25%)
const DOUBLE_SMALL_VEHICLE_CHANCE = 0.25;

// Criar objeto com tipos variados
function spawnObject(config) {
	// Verificar se há espaço mínimo desde o último obstáculo
	if (State.objects.length > 0) {
		const lastObj = State.objects[State.objects.length - 1];
		const lastObjEnd = lastObj.x + lastObj.width;
		// Só spawnar se houver pelo menos 50px de distância
		if (lastObjEnd > config.width - 50) {
			return; // Não spawnar ainda
		}
	}
	
	// Obter configurações da fase atual
	const phase = getCurrentPhase();
	const obstacleConfig = phase.obstacles;
	
	// Construir array de tipos disponíveis baseado na fase
	const obstacleTypes = [];
	
	if (obstacleConfig.types.includes('small')) {
		obstacleTypes.push({
			type: 'normal',
			width: obstacleConfig.small.width,
			height: obstacleConfig.small.height,
			emoji: obstacleConfig.small.emojis[Math.floor(Math.random() * obstacleConfig.small.emojis.length)],
			size: 'small'
		});
	}
	
	if (obstacleConfig.types.includes('medium')) {
		obstacleTypes.push({
			type: 'normal',
			width: obstacleConfig.medium.width,
			height: obstacleConfig.medium.height,
			emoji: obstacleConfig.medium.emojis[Math.floor(Math.random() * obstacleConfig.medium.emojis.length)],
			size: 'medium'
		});
	}
	
	if (obstacleConfig.types.includes('large')) {
		obstacleTypes.push({
			type: 'normal',
			width: obstacleConfig.large.width,
			height: obstacleConfig.large.height,
			emoji: obstacleConfig.large.emojis[Math.floor(Math.random() * obstacleConfig.large.emojis.length)],
			size: 'large'
		});
	}
	
	// Escolher tipo aleatório
	const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
	
	const obstacle = {
		x: config.width,
		// Ajustar Y para o carro ficar alinhado ao asfalto (não flutuando)
		y: config.groundY + config.playerSize - obstacleType.height + 20, // +20px para descer mais
		width: obstacleType.width,
		height: obstacleType.height,
		color: config.objectColor,
		type: obstacleType.type || 'normal',
		emoji: obstacleType.emoji || null,
		size: obstacleType.size || null // 'small' ou 'large'
	};
	
	// Se for buraco, adicionar propriedades extras
	if (obstacleType.type === 'buraco') {
		obstacle.coneWidth = obstacleType.coneWidth;
		obstacle.coneHeight = obstacleType.coneHeight;
		obstacle.holeWidth = obstacleType.holeWidth;
		obstacle.holeHeight = obstacleType.holeHeight;
		// Y do buraco: começa 2px acima do asfalto para garantir detecção de colisão
		obstacle.holeY = config.asphaltY + config.playerSize - 2;
		// Y do cone: alinhado ao chão como os quadrados vermelhos
		obstacle.coneY = config.groundY + config.playerSize - obstacle.coneHeight;
	}
	
	State.objects.push(obstacle);
	
	// Lógica de spawn duplo apenas para veículos pequenos
	if (obstacleType.size === 'small' && Math.random() < DOUBLE_SMALL_VEHICLE_CHANCE) {
		// Spawnar segundo veículo pequeno com pequeno espaçamento
		const gap = 15; // Espaçamento entre os dois veículos (quase colados)
		
		// Criar segundo veículo com emoji diferente (se possível)
		const secondEmoji = obstacleConfig.small.emojis[Math.floor(Math.random() * obstacleConfig.small.emojis.length)];
		
		const secondObstacle = {
			x: config.width + obstacleType.width + gap, // Posicionado após o primeiro com gap
			y: config.groundY + config.playerSize - obstacleType.height + 20,
			width: obstacleType.width,
			height: obstacleType.height,
			color: config.objectColor,
			type: 'normal',
			emoji: secondEmoji,
			size: 'small'
		};
		
		State.objects.push(secondObstacle);
		console.log(`🚗🚗 Spawn duplo de veículos pequenos! (${obstacle.emoji} + ${secondObstacle.emoji})`);
	}
}

// Atualizar posição dos obstáculos
function updateObjects(config) {
	// Velocidade dinâmica baseada no modo
	const currentSpeed = State.isPunkMode ? config.worldSpeedPunk : config.worldSpeedNormal;
	
	// Mover objetos
	for (let obj of State.objects) {
		obj.x -= currentSpeed;
	}
	
	// Remover objetos fora da tela
	State.objects = State.objects.filter(obj => obj.x + obj.width > 0);
}
