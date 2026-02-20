/* ============================================
   Sistema de Fases (Biomas/Mapas)
   ============================================ */

const Phases = [
	// Fase 0: Cidade Urbana / Bairro Residencial
	{
		name: 'Cidade Urbana',
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
	
	// Fase 1: Cidade Normal
	{
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

// Obter fase atual
function getCurrentPhase() {
	return Phases[currentPhaseIndex];
}

// Mudar de fase
function setPhase(phaseIndex) {
	if (phaseIndex >= 0 && phaseIndex < Phases.length) {
		currentPhaseIndex = phaseIndex;
		const phaseName = getCurrentPhase().name;
		console.log(`🌍 Mudou para fase: ${phaseName}`);
		
		unlockReadingContent();
		
		return true;
	}
	console.warn(`⚠️ Fase ${phaseIndex} não existe`);
	return false;
}
