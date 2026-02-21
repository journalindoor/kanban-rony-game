/* ============================================
   Sistema de Montanhas (Fase 0)
   ============================================ */

// Inicializar montanhas
function initMountains(config) {
	if (currentPhaseIndex !== 0) {
		State.mountains = [];
		return;
	}
	
	State.mountains = [];
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
				speed: layer.speed
			});
			
			currentX += width + Math.random() * 100 + 50;
		}
	});
}

// Atualizar montanhas
function updateMountains(config) {
	if (currentPhaseIndex !== 0 || !State.mountains) return;
	
	const baseSpeed = config.buildingSpeedBase;
	const speedMultiplier = State.isPunkMode ? (config.worldSpeedPunk / config.worldSpeedNormal) : 1;
	
	// Mover montanhas com velocidade de parallax
	for (let mountain of State.mountains) {
		mountain.x -= baseSpeed * mountain.speed * speedMultiplier;
	}
	
	// Remover montanhas que saíram da tela
	State.mountains = State.mountains.filter(mountain => mountain.x + mountain.width > -100);
	
	// Adicionar novas montanhas
	if (State.mountains.length > 0) {
		const layers = [
			{ colors: ['#A8D5BA', '#9FCFB0'], speed: 0.15, minWidth: 200, maxWidth: 350, minHeight: 80, maxHeight: 120, layer: 0 },
			{ colors: ['#7FB77E', '#6FAF75'], speed: 0.3, minWidth: 180, maxWidth: 300, minHeight: 100, maxHeight: 150, layer: 1 },
			{ colors: ['#4E8C5A', '#3E7A4F'], speed: 0.5, minWidth: 150, maxWidth: 250, minHeight: 120, maxHeight: 180, layer: 2 }
		];
		
		layers.forEach(layer => {
			const mountainsInLayer = State.mountains.filter(m => m.layer === layer.layer);
			
			if (mountainsInLayer.length > 0) {
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
						speed: layer.speed
					});
				}
			}
		});
	}
}
