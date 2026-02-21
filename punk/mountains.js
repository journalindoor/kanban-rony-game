/* ============================================
   Sistema de Montanhas (Fase 0)
   ============================================ */

// Inicializar montanhas
function initMountains(config, isTransition = false) {
	if (getCurrentBasePhase() !== 0) {
		// Se não é Fase 0, limpar montanhas
		if (!isTransition) {
			State.mountains = [];
		}
		return;
	}
	
	// Durante transições, NÃO limpar montanhas antigas
	// Elas vão sair naturalmente da tela
	if (!isTransition) {
		State.mountains = [];
	} else {
		// Marcar montanhas antigas para não gerar novas do tipo antigo
		State.mountains.forEach(mountain => {
			mountain.isOldPhase = true;
		});
		console.log(`🏔️ Transição: ${State.mountains.length} montanhas antigas continuarão se movendo`);
	}
	
	let currentX = config.width + 100;
	
	// Camadas de profundidade (distante, média, próxima)
	const layers = [
		{ colors: ['#A8D5BA', '#9FCFB0'], speed: 0.15, count: 3, minWidth: 200, maxWidth: 350, minHeight: 80, maxHeight: 120 },
		{ colors: ['#7FB77E', '#6FAF75'], speed: 0.3, count: 4, minWidth: 180, maxWidth: 300, minHeight: 100, maxHeight: 150 },
		{ colors: ['#4E8C5A', '#3E7A4F'], speed: 0.5, count: 5, minWidth: 150, maxWidth: 250, minHeight: 120, maxHeight: 180 }
	];
	
	layers.forEach((layer, layerIndex) => {
		for (let i = 0; i < layer.count; i++) {
			const width = Math.random() * (layer.maxWidth - layer.minWidth) + layer.minWidth;
			const height = Math.random() * (layer.maxHeight - layer.minHeight) + layer.minHeight;
			const color = layer.colors[Math.floor(Math.random() * layer.colors.length)];
			
			State.mountains.push({
				x: currentX,
				width: width,
				height: height,
				color: color,
				layer: layerIndex,
				speed: layer.speed,
				isOldPhase: false // Marca como fase atual
			});
			
			currentX += width + Math.random() * 100 + 50;
		}
	});
}

// Atualizar montanhas
function updateMountains(config) {
	if (getCurrentBasePhase() !== 0 || !State.mountains) return;
	
	const baseSpeed = config.buildingSpeedBase;
	const speedMultiplier = State.isPunkMode ? (config.worldSpeedPunk / config.worldSpeedNormal) : 1;
	
	// Mover montanhas com velocidade de parallax
	for (let mountain of State.mountains) {
		mountain.x -= baseSpeed * mountain.speed * speedMultiplier;
	}
	
	// Remover montanhas que saíram completamente da tela
	State.mountains = State.mountains.filter(mountain => {
		const isOffScreen = mountain.x + mountain.width < -100;
		if (isOffScreen && mountain.isOldPhase) {
			console.log(`🗑️ Montanha antiga removida da tela (x: ${Math.floor(mountain.x)})`);
		}
		return !isOffScreen;
	});
	
	// Encontrar montanhas da FASE ATUAL (não antigas) para spawnar novas
	const currentPhaseMountains = State.mountains.filter(m => !m.isOldPhase);
	
	// Adicionar novas montanhas (baseado apenas em montanhas da fase atual)
	if (currentPhaseMountains.length > 0 || getCurrentBasePhase() === 0) {
		const layers = [
			{ colors: ['#A8D5BA', '#9FCFB0'], speed: 0.15, minWidth: 200, maxWidth: 350, minHeight: 80, maxHeight: 120, layer: 0 },
			{ colors: ['#7FB77E', '#6FAF75'], speed: 0.3, minWidth: 180, maxWidth: 300, minHeight: 100, maxHeight: 150, layer: 1 },
			{ colors: ['#4E8C5A', '#3E7A4F'], speed: 0.5, minWidth: 150, maxWidth: 250, minHeight: 120, maxHeight: 180, layer: 2 }
		];
		
		layers.forEach(layer => {
			// Filtrar apenas montanhas da fase atual nesta camada
			const mountainsInLayer = currentPhaseMountains.filter(m => m.layer === layer.layer);
			
			// Se não há montanhas nesta camada, criar a primeira
			if (mountainsInLayer.length === 0 && getCurrentBasePhase() === 0) {
				const width = Math.random() * (layer.maxWidth - layer.minWidth) + layer.minWidth;
				const height = Math.random() * (layer.maxHeight - layer.minHeight) + layer.minHeight;
				const color = layer.colors[Math.floor(Math.random() * layer.colors.length)];
				const spawnX = config.width + 100;
				
				State.mountains.push({
					x: spawnX,
					width: width,
					height: height,
					color: color,
					layer: layer.layer,
					speed: layer.speed,
					isOldPhase: false
				});
			} else if (mountainsInLayer.length > 0) {
				const lastMountain = mountainsInLayer[mountainsInLayer.length - 1];
				const lastEnd = lastMountain.x + lastMountain.width;
				
				if (lastEnd < config.width) {
					const width = Math.random() * (layer.maxWidth - layer.minWidth) + layer.minWidth;
					const height = Math.random() * (layer.maxHeight - layer.minHeight) + layer.minHeight;
					const color = layer.colors[Math.floor(Math.random() * layer.colors.length)];
					const gap = Math.random() * 100 + 50;
					const spawnX = Math.max(lastEnd + gap, config.width + 50);
					
					State.mountains.push({
						x: spawnX,
						width: width,
						height: height,
						color: color,
						layer: layer.layer,
						speed: layer.speed,
						isOldPhase: false // Marca como fase atual
					});
				}
			}
		});
	}
}
