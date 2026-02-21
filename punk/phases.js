/* ============================================
   Sistema de Fases (Biomas/Mapas) com Suporte a Variantes
   ============================================ */

const Phases = [
	// Fase 0a: Cidade Urbana - DIA
	{
		basePhase: 0,
		variant: 'a',
		name: 'Cidade Urbana - Dia',
		sky: { color: '#7EC8FF', gradient: null }, // Azul claro limpo (dia)
		environment: {
			type: 'buildings',
			colors: ['#D2B48C', '#C68642', '#E9967A', '#8FBC8F', '#87CEFA', '#CD5C5C'], // Cores mais vivas (dia)
			asphaltColor: '#5A5A5A',
			laneColor: '#FFFFFF',
			windowLightColor: '#FCD34D',
			windowOffColor: '#CCCCCC'
		},
		obstacles: {
			types: ['small', 'medium', 'large'],
			small: {
				emojis: ['🚗', '🚕', '🚙', '🛻'], // SEM polícia (🚓)
				width: 100,
				height: 100
			},
			medium: {
				emojis: ['🚐', '🚎'],
				width: 115,
				height: 115
			},
			large: {
				emojis: ['🚌', '🚚', '🚛'],
				width: 110,
				height: 110
			}
		},
		items: {
			guitar: {
				enabled: true,
				emoji: '🎸',
				firstSpawnMin: 100,
				firstSpawnMax: 150,
				spawnIntervalMin: 150,
				spawnIntervalMax: 200,
				respawnAfterLoss: 300
			}
		}
	},
	
	// Fase 0b: Cidade Urbana - TARDE
	{
		basePhase: 0,
		variant: 'b',
		name: 'Cidade Urbana - Tarde',
		sky: { color: '#FF9A5C', gradient: null }, // Laranja/rosado de fim de tarde
		environment: {
			type: 'buildings',
			colors: ['#D4A574', '#C89664', '#E89B7A', '#7DAF7D', '#77BFEA', '#BD4C4C'], // Tons quentes (tarde)
			asphaltColor: '#4A4A4A',
			laneColor: '#FFFFFF',
			windowLightColor: '#FFA500',
			windowOffColor: '#8B7355'
		},
		obstacles: {
			types: ['small', 'medium', 'large'],
			small: {
				emojis: ['🚗', '🚕', '🚙', '🛻'], // SEM polícia (🚓)
				width: 100,
				height: 100
			},
			medium: {
				emojis: ['🚐', '🚎'],
				width: 115,
				height: 115
			},
			large: {
				emojis: ['🚌', '🚚', '🚛'],
				width: 110,
				height: 110
			}
		},
		items: {
			guitar: {
				enabled: true,
				emoji: '🎸',
				firstSpawnMin: 100,
				firstSpawnMax: 150,
				spawnIntervalMin: 150,
				spawnIntervalMax: 200,
				respawnAfterLoss: 300
			}
		}
	},
	
	// Fase 0c: Cidade Urbana - NOITE
	{
		basePhase: 0,
		variant: 'c',
		name: 'Cidade Urbana - Noite',
		sky: { color: '#1C1F4A', gradient: null }, // Azul escuro/arroxeado (noite)
		environment: {
			type: 'buildings',
			colors: ['#3A3A4A', '#2E2E3E', '#4A4A5A', '#323242', '#262636'], // Tons escuros (noite)
			asphaltColor: '#2A2A2A',
			laneColor: '#FFD700',
			windowLightColor: '#FFA500', // Janelas acesas (noite)
			windowOffColor: '#1a1a2e'
		},
		obstacles: {
			types: ['small', 'medium', 'large'],
			small: {
				emojis: ['🚗', '🚕', '🚙', '🚓', '🛻'], // COM polícia (🚓)
				width: 100,
				height: 100
			},
			medium: {
				emojis: ['🚐', '🚎'],
				width: 115,
				height: 115
			},
			large: {
				emojis: ['🚌', '🚚', '🚛', '🚑'], // Ambulância comum à noite
				width: 110,
				height: 110
			}
		},
		items: {
			guitar: {
				enabled: true,
				emoji: '🎸',
				firstSpawnMin: 100,
				firstSpawnMax: 150,
				spawnIntervalMin: 150,
				spawnIntervalMax: 200,
				respawnAfterLoss: 300
			}
		}
	},
	
	// Fase 1: Cidade Normal
	{
		basePhase: 1,
		variant: null,
		name: 'Cidade',
		sky: { color: '#5DADE2', gradient: null },
		environment: {
			type: 'buildings',
			colors: ['#6B7280', '#4B5563', '#9CA3AF', '#374151', '#1F2937'],
			asphaltColor: '#374151',
			laneColor: '#FFFFFF',
			windowLightColor: '#FCD34D',
			windowOffColor: '#4B5563'
		},
		obstacles: {
			types: ['small', 'medium', 'large'],
			small: {
				emojis: ['🚗', '🚕', '🚙', '🚓', '🛻'],
				width: 100,
				height: 100
			},
			medium: {
				emojis: ['🚐', '🚎'],
				width: 115,
				height: 115
			},
			large: {
				emojis: ['🚌', '🚚', '🚛', '🚒', '🚑'],
				width: 110,
				height: 110
			}
		},
		items: {
			guitar: {
				enabled: true,
				emoji: '🎸',
				firstSpawnMin: 100,
				firstSpawnMax: 150,
				spawnIntervalMin: 150,
				spawnIntervalMax: 200,
				respawnAfterLoss: 300
			}
		}
	},
	
	// Fase 2: Cidade Noturna
	{
		basePhase: 2,
		variant: null,
		name: 'Cidade Noturna',
		sky: { color: '#1a1a2e', gradient: null },
		environment: {
			type: 'buildings',
			colors: ['#0f0f1e', '#16213e', '#1f2833', '#0a1128', '#1b1b2f'],
			asphaltColor: '#1a1a1a',
			laneColor: '#FFD700',
			windowLightColor: '#FFA500',
			windowOffColor: '#1a1a2e'
		},
		obstacles: {
			types: ['small', 'medium', 'large'],
			small: {
				emojis: ['🚗', '🚕', '🚙', '🚓', '🛻'],
				width: 100,
				height: 100
			},
			medium: {
				emojis: ['🚐', '🚎'],
				width: 115,
				height: 115
			},
			large: {
				emojis: ['🚌', '🚚', '🚛', '🚒', '🚑'],
				width: 110,
				height: 110
			}
		},
		items: {
			guitar: {
				enabled: true,
				emoji: '🎸',
				firstSpawnMin: 100,
				firstSpawnMax: 150,
				spawnIntervalMin: 150,
				spawnIntervalMax: 200,
				respawnAfterLoss: 300
			}
		}
	},
	
	// Fase 3: Cidade Noturna (clone da Fase 2)
	{
		basePhase: 3,
		variant: null,
		name: 'Cidade Noturna',
		sky: { color: '#1a1a2e', gradient: null },
		environment: {
			type: 'buildings',
			colors: ['#0f0f1e', '#16213e', '#1f2833', '#0a1128', '#1b1b2f'],
			asphaltColor: '#1a1a1a',
			laneColor: '#FFD700',
			windowLightColor: '#FFA500',
			windowOffColor: '#1a1a2e'
		},
		obstacles: {
			types: ['small', 'medium', 'large'],
			small: {
				emojis: ['🚗', '🚕', '🚙', '🚓', '🛻'],
				width: 100,
				height: 100
			},
			medium: {
				emojis: ['🚐', '🚎'],
				width: 115,
				height: 115
			},
			large: {
				emojis: ['🚌', '🚚', '🚛', '🚒', '🚑'],
				width: 110,
				height: 110
			}
		},
		items: {
			guitar: {
				enabled: true,
				emoji: '🎸',
				firstSpawnMin: 100,
				firstSpawnMax: 150,
				spawnIntervalMin: 150,
				spawnIntervalMax: 200,
				respawnAfterLoss: 300
			}
		}
	},
	
	// Fase 4: Cidade Noturna (clone da Fase 2)
	{
		basePhase: 4,
		variant: null,
		name: 'Cidade Noturna',
		sky: { color: '#1a1a2e', gradient: null },
		environment: {
			type: 'buildings',
			colors: ['#0f0f1e', '#16213e', '#1f2833', '#0a1128', '#1b1b2f'],
			asphaltColor: '#1a1a1a',
			laneColor: '#FFD700',
			windowLightColor: '#FFA500',
			windowOffColor: '#1a1a2e'
		},
		obstacles: {
			types: ['small', 'medium', 'large'],
			small: {
				emojis: ['🚗', '🚕', '🚙', '🚓', '🛻'],
				width: 100,
				height: 100
			},
			medium: {
				emojis: ['🚐', '🚎'],
				width: 115,
				height: 115
			},
			large: {
				emojis: ['🚌', '🚚', '🚛', '🚒', '🚑'],
				width: 110,
				height: 110
			}
		},
		items: {
			guitar: {
				enabled: true,
				emoji: '🎸',
				firstSpawnMin: 100,
				firstSpawnMax: 150,
				spawnIntervalMin: 150,
				spawnIntervalMax: 200,
				respawnAfterLoss: 300
			}
		}
	},
	
	// Fase 5: Cidade Noturna (clone da Fase 2)
	{
		basePhase: 5,
		variant: null,
		name: 'Cidade Noturna',
		sky: { color: '#1a1a2e', gradient: null },
		environment: {
			type: 'buildings',
			colors: ['#0f0f1e', '#16213e', '#1f2833', '#0a1128', '#1b1b2f'],
			asphaltColor: '#1a1a1a',
			laneColor: '#FFD700',
			windowLightColor: '#FFA500',
			windowOffColor: '#1a1a2e'
		},
		obstacles: {
			types: ['small', 'medium', 'large'],
			small: {
				emojis: ['🚗', '🚕', '🚙', '🚓', '🛻'],
				width: 100,
				height: 100
			},
			medium: {
				emojis: ['🚐', '🚎'],
				width: 115,
				height: 115
			},
			large: {
				emojis: ['🚌', '🚚', '🚛', '🚒', '🚑'],
				width: 110,
				height: 110
			}
		},
		items: {
			guitar: {
				enabled: true,
				emoji: '🎸',
				firstSpawnMin: 100,
				firstSpawnMax: 150,
				spawnIntervalMin: 150,
				spawnIntervalMax: 200,
				respawnAfterLoss: 300
			}
		}
	},
	
	// Fase 6: Cidade Noturna (clone da Fase 2)
	{
		basePhase: 6,
		variant: null,
		name: 'Cidade Noturna',
		sky: { color: '#1a1a2e', gradient: null },
		environment: {
			type: 'buildings',
			colors: ['#0f0f1e', '#16213e', '#1f2833', '#0a1128', '#1b1b2f'],
			asphaltColor: '#1a1a1a',
			laneColor: '#FFD700',
			windowLightColor: '#FFA500',
			windowOffColor: '#1a1a2e'
		},
		obstacles: {
			types: ['small', 'medium', 'large'],
			small: {
				emojis: ['🚗', '🚕', '🚙', '🚓', '🛻'],
				width: 100,
				height: 100
			},
			medium: {
				emojis: ['🚐', '🚎'],
				width: 115,
				height: 115
			},
			large: {
				emojis: ['🚌', '🚚', '🚛', '🚒', '🚑'],
				width: 110,
				height: 110
			}
		},
		items: {
			guitar: {
				enabled: true,
				emoji: '🎸',
				firstSpawnMin: 100,
				firstSpawnMax: 150,
				spawnIntervalMin: 150,
				spawnIntervalMax: 200,
				respawnAfterLoss: 300
			}
		}
	}
];

let currentPhaseIndex = 0;

// Constantes de progressão
const METERS_PER_PHASE = 150;

// Agrupar fases por basePhase
function getPhasesByBase() {
	const grouped = {};
	Phases.forEach((phase, index) => {
		if (!grouped[phase.basePhase]) {
			grouped[phase.basePhase] = [];
		}
		grouped[phase.basePhase].push({ ...phase, index });
	});
	return grouped;
}

// Obter próxima fase baseado na distância
function getPhaseIndexByDistance(distance) {
	const phasesByBase = getPhasesByBase();
	const basePhaseKeys = Object.keys(phasesByBase).map(Number).sort((a, b) => a - b);
	
	// Quantas trocas de fase já ocorreram
	const phaseChanges = Math.floor(distance / METERS_PER_PHASE);
	
	// Construir sequência linear de fases
	let phaseSequence = [];
	basePhaseKeys.forEach(basePhase => {
		const variants = phasesByBase[basePhase];
		variants.forEach(variant => {
			phaseSequence.push(variant.index);
		});
	});
	
	// Se não há fases, retorna 0
	if (phaseSequence.length === 0) return 0;
	
	// Loop infinito: quando acabar a sequência, volta ao início
	const phaseIndex = phaseSequence[phaseChanges % phaseSequence.length];
	
	// Debug detalhado a cada múltiplo de 200m
	if (distance > 0 && distance % METERS_PER_PHASE === 0) {
		const phase = Phases[phaseIndex];
		const phaseId = phase.variant ? `${phase.basePhase}${phase.variant}` : `${phase.basePhase}`;
		console.log(`📊 [${distance}m] Mudanças: ${phaseChanges}, Sequência total: ${phaseSequence.length}, Índice calculado: ${phaseIndex}, Fase: ${phaseId}`);
	}
	
	return phaseIndex;
}

// Verificar se deve trocar de fase baseado na distância
function checkPhaseTransition(distance) {
	const newPhaseIndex = getPhaseIndexByDistance(distance);
	
	if (newPhaseIndex !== currentPhaseIndex) {
		const oldPhaseId = getCurrentPhaseId();
		const oldBasePhase = getCurrentBasePhase();
		
		// Trocar fase
		currentPhaseIndex = newPhaseIndex;
		
		const newPhaseId = getCurrentPhaseId();
		const newBasePhase = getCurrentBasePhase();
		
		console.log(`🔄 Transição de fase: ${oldPhaseId} → ${newPhaseId} (${distance}m)`);
		
		// Só desbloqueia conteúdo de leitura se a base mudou
		if (oldBasePhase !== newBasePhase) {
			unlockReadingContent();
		}
		
		return true; // Houve transição
	}
	
	return false; // Não houve transição
}

// Obter fase atual
function getCurrentPhase() {
	return Phases[currentPhaseIndex];
}

// Obter fase base (para narrativa/desbloqueio)
function getCurrentBasePhase() {
	return getCurrentPhase().basePhase;
}

// Obter variante da fase atual (null, "a", "b", etc)
function getCurrentVariant() {
	return getCurrentPhase().variant;
}

// Obter identificador completo da fase (ex: "0", "0a", "1b")
function getCurrentPhaseId() {
	const phase = getCurrentPhase();
	return phase.variant ? `${phase.basePhase}${phase.variant}` : `${phase.basePhase}`;
}

// Mudar de fase (manual - para debug)
function setPhase(phaseIndex) {
	if (phaseIndex >= 0 && phaseIndex < Phases.length) {
		currentPhaseIndex = phaseIndex;
		const phase = getCurrentPhase();
		const phaseId = getCurrentPhaseId();
		console.log(`🌍 Mudou para fase: ${phase.name} (ID: ${phaseId}, Base: ${phase.basePhase})`);
		
		unlockReadingContent();
		
		return true;
	}
	console.warn(`⚠️ Fase ${phaseIndex} não existe`);
	return false;
}
