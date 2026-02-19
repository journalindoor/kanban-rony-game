/* ============================================
   Obstáculos e Objetos
   ============================================ */

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
	
	// Definir tipos de obstáculos
	const obstacleTypes = [
		// Tipo 1: Carros pequenos (100px)
		{
			type: 'normal',
			width: config.objectSize * 2.5,  // 100px
			height: config.objectSize * 2.5, // 100px
			emoji: ['🚗', '🚕', '🚙', '🚓','🛻'][Math.floor(Math.random() * 5)], // 5 carros pequenos
			size: 'small'
		},
		// Tipo 2: Carros médios (115px - 15% maiores)
		{
			type: 'normal',
			width: config.objectSize * 2.875,  // 115px
			height: config.objectSize * 2.875, // 115px
			emoji: ['🚐', '🚎','🚒','🚑'][Math.floor(Math.random() * 4)], // Minibus, Trólebus, caminhão de bombeiros e ambulancia
			size: 'medium'
		},
		// Tipo 3: Carros grandes (110px)
		{
			type: 'normal',
			width: config.objectSize * 2.75,  // 110px (reduzido de 120px)
			height: config.objectSize * 2.75, // 110px
			emoji: ['🚌', '🚚', '🚛'][Math.floor(Math.random() * 3)], // Ônibus, caminhões (sem trólebus)
			size: 'large'
		}
	];
	
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
