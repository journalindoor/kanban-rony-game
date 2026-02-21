/* ============================================
   Prédios e Cenário
   ============================================ */

// Inicializar prédios
function initBuildings(config) {
	const phase = getCurrentPhase();
	const envConfig = phase.environment;
	State.buildings = [];
	const buildingColors = envConfig.colors;
	let currentX = config.width + 100;
	
	// FASE 0: Casas da Baixada Fluminense
	if (currentPhaseIndex === 0) {
		const houseColors = ['#D2B48C', '#C68642', '#E9967A', '#8FBC8F', '#87CEFA', '#CD5C5C'];
		const shopColors = ['#FF6347', '#FFD700', '#4169E1'];
		const roofColors = ['#8B4513', '#5A3E2B', '#654321'];
		const houseTypes = ['simple', 'simple', 'wide', 'shop'];
		const signTexts = ['BAR', 'MERCADO', 'OFICINA', 'LOJA'];
		
		for (let i = 0; i < 12; i++) {
			const houseType = houseTypes[Math.floor(Math.random() * houseTypes.length)];
			const width = houseType === 'wide' ? (Math.random() * 40 + 100) : 
			              houseType === 'shop' ? (Math.random() * 30 + 70) : 
			              (Math.random() * 40 + 60);
			const houseHeight = Math.random() * 30 + 60;
			const color = houseType === 'shop' ? 
			              shopColors[Math.floor(Math.random() * shopColors.length)] :
			              houseColors[Math.floor(Math.random() * houseColors.length)];
			const roofType = Math.random() > 0.5 ? 'triangular' : 'flat';
			const roofColor = roofColors[Math.floor(Math.random() * roofColors.length)];
			const hasWall = Math.random() > 0.7;
			const signText = houseType === 'shop' ? signTexts[Math.floor(Math.random() * signTexts.length)] : null;
			
			const numWindows = houseType === 'wide' ? 3 : (houseType === 'shop' ? 1 : 2);
			const windowStates = [[]];
			for (let w = 0; w < numWindows; w++) {
				windowStates[0][w] = Math.random() > 0.4;
			}
			
			State.buildings.push({
				x: currentX,
				width: width,
				height: houseHeight,
				color: color,
				houseType: houseType,
				houseHeight: houseHeight,
				roofType: roofType,
				roofColor: roofColor,
				hasWall: hasWall,
				signText: signText,
				windowStates: windowStates
			});
			
			currentX += width + Math.random() * 20 + 5;
		}
		return;
	}
	
	// Outras fases: prédios normais
	for (let i = 0; i < 8; i++) {
		const width = Math.random() * 80 + 60;
		const height = config.height + 100;
		const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
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
			x: currentX,
			width: width,
			height: height,
			color: color,
			windowStates: windowStates
		});
		currentX += width + Math.random() * 60 + 40;
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
		
		// Criar novo apenas quando o último prédio está completamente dentro da tela
		if (lastBuildingEnd < config.width) {
			const phase = getCurrentPhase();
			const envConfig = phase.environment;
			const buildingColors = envConfig.colors;
			
			// FASE 0: Casas da Baixada
			if (currentPhaseIndex === 0) {
				const houseColors = ['#D2B48C', '#C68642', '#E9967A', '#8FBC8F', '#87CEFA', '#CD5C5C'];
				const shopColors = ['#FF6347', '#FFD700', '#4169E1'];
				const roofColors = ['#8B4513', '#5A3E2B', '#654321'];
				const houseTypes = ['simple', 'simple', 'wide', 'shop'];
				const signTexts = ['BAR', 'MERCADO', 'OFICINA', 'LOJA'];
				
				const houseType = houseTypes[Math.floor(Math.random() * houseTypes.length)];
				const width = houseType === 'wide' ? (Math.random() * 40 + 100) : 
				              houseType === 'shop' ? (Math.random() * 30 + 70) : 
				              (Math.random() * 40 + 60);
				const houseHeight = Math.random() * 30 + 60;
				const color = houseType === 'shop' ? 
				              shopColors[Math.floor(Math.random() * shopColors.length)] :
				              houseColors[Math.floor(Math.random() * houseColors.length)];
				const roofType = Math.random() > 0.5 ? 'triangular' : 'flat';
				const roofColor = roofColors[Math.floor(Math.random() * roofColors.length)];
				const hasWall = Math.random() > 0.7;
				const signText = houseType === 'shop' ? signTexts[Math.floor(Math.random() * signTexts.length)] : null;
				
				const numWindows = houseType === 'wide' ? 3 : (houseType === 'shop' ? 1 : 2);
				const windowStates = [[]];
				for (let w = 0; w < numWindows; w++) {
					windowStates[0][w] = Math.random() > 0.4;
				}
				
				const minGap = 5;
				const extraGap = Math.random() * 20;
				const spawnX = Math.max(lastBuildingEnd + minGap + extraGap, config.width + 10);
				
				State.buildings.push({
					x: spawnX,
					width: width,
					height: houseHeight,
					color: color,
					houseType: houseType,
					houseHeight: houseHeight,
					roofType: roofType,
					roofColor: roofColor,
					hasWall: hasWall,
					signText: signText,
					windowStates: windowStates
				});
			} else {
				// Outras fases: prédios normais
				const width = Math.random() * 80 + 60;
				const minGap = 50;
				const extraGap = Math.random() * 60;
				const spawnX = Math.max(lastBuildingEnd + minGap + extraGap, config.width + 10);
				
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
					x: spawnX,
					width: width,
					height: config.height + 100,
					color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
					windowStates: windowStates
				});
			}
		}
	}
}
