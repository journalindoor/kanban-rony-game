/* ============================================
   Prédios e Cenário
   ============================================ */

// Inicializar prédios
function initBuildings(config) {
	State.buildings = [];
	const buildingColors = ['#6B7280', '#4B5563', '#9CA3AF', '#374151', '#1F2937'];
	let currentX = config.width;
	
	for (let i = 0; i < 8; i++) {
		const width = Math.random() * 80 + 60; // 60-140px
		const height = config.height + 100; // sempre ultrapassa o topo
		const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
		
		// Gerar estado das janelas (acesas/apagadas) no momento da criação
		const numWindows = width > 100 ? 3 : 2;
		const windowSpacingY = 35;
		const numFloors = Math.floor((config.asphaltY + config.playerSize - 60) / windowSpacingY);
		const windowStates = [];
		
		for (let floor = 0; floor < numFloors; floor++) {
			windowStates[floor] = [];
			for (let w = 0; w < numWindows; w++) {
				windowStates[floor][w] = Math.random() > 0.3; // 70% acesas
			}
		}
		
		State.buildings.push({
			x: currentX,
			width: width,
			height: height,
			color: color,
			windowStates: windowStates // estado fixo das janelas
		});
		
		// Adicionar espaço entre prédios
		currentX += width + Math.random() * 60 + 40; // espaço de 40-100px
	}
}

// Atualizar prédios
function updateBuildings(config) {
	// Velocidade proporcional ao modo (Punk = mais rápido)
	const speedMultiplier = State.isPunkMode ? (config.worldSpeedPunk / config.worldSpeedNormal) : 1;
	const currentBuildingSpeed = config.buildingSpeedBase * speedMultiplier;
	
	// Mover prédios
	for (let building of State.buildings) {
		building.x -= currentBuildingSpeed;
	}
	
	// Remover prédios que saíram completamente da tela
	State.buildings = State.buildings.filter(building => building.x + building.width > -50);
	
	// Adicionar novo prédio quando houver espaço
	if (State.buildings.length > 0) {
		const lastBuilding = State.buildings[State.buildings.length - 1];
		const lastBuildingEnd = lastBuilding.x + lastBuilding.width;
		
		// Se o último prédio está longe o suficiente, criar novo
		if (lastBuildingEnd < config.width - 100) {
			const buildingColors = ['#6B7280', '#4B5563', '#9CA3AF', '#374151', '#1F2937'];
			const width = Math.random() * 80 + 60;
			const minGap = 50; // espaço mínimo garantido
			const extraGap = Math.random() * 60; // espaço extra aleatório
			
			// Gerar estado das janelas
			const numWindows = width > 100 ? 3 : 2;
			const windowSpacingY = 35;
			const numFloors = Math.floor((config.asphaltY + config.playerSize - 60) / windowSpacingY);
			const windowStates = [];
			
			for (let floor = 0; floor < numFloors; floor++) {
				windowStates[floor] = [];
				for (let w = 0; w < numWindows; w++) {
					windowStates[floor][w] = Math.random() > 0.3;
				}
			}
			
			State.buildings.push({
				x: lastBuildingEnd + minGap + extraGap,
				width: width,
				height: config.height + 100,
				color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
				windowStates: windowStates
			});
		}
	}
}
