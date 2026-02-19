/* ============================================
   Detecção de Colisões
   ============================================ */

// Lidar com colisão (usa guitarra como vida extra ou game over)
function handleCollision(config, gameOverCallback) {
	// IGNORAR colisões durante invencibilidade
	if (State.isInvincible) {
		console.log('💫 Colisão ignorada - Jogador invencível!');
		return;
	}
	
	console.log('⚠️ COLISÃO DETECTADA!');
	console.log(`   Estado atual: isPunkMode=${State.isPunkMode}, hasGuitarProtection=${State.hasGuitarProtection}`);
	
	if (State.hasGuitarProtection) {
		// Tem guitarra - perde ela mas continua jogando
		console.log('💥 COLISÃO COM PROTEÇÃO! Perdeu a guitarra (vida extra usada)');
		console.log(`📍 Colisão aos ${State.distance}m - Próxima guitarra em ${State.distance + 300}m`);
		
		State.hasGuitarProtection = false;
		State.isPunkMode = false;
		State.guitarCollisionDistance = State.distance; // salva onde perdeu
		
		// Volta para sprite normal
		Config.playerImage = Config.playerImageNormal;
		
		// Volta para 1 teia
		State.webUsesRemaining = 1;
		
		// ATIVAR INVENCIBILIDADE TEMPORÁRIA (3 segundos = 180 frames a 60fps)
		State.isInvincible = true;
		State.invincibilityTimer = 180; // 3 segundos * 60 fps
		console.log('💫 Invencibilidade ativada por 3s');
		
		console.log('🎸 Modo PUNK desativado - Voltou para Rony normal');
		console.log(`   Novo estado: isPunkMode=${State.isPunkMode}, hasGuitarProtection=${State.hasGuitarProtection}, isInvincible=${State.isInvincible}`);
		console.log('✅ JOGO CONTINUA (não chamou gameOver)');
		
		// NÃO chamar gameOver - jogador continua vivo!
		return;
	} else {
		// Sem guitarra - game over normal
		console.log('💥 COLISÃO SEM PROTEÇÃO! Game Over!');
		console.log('❌ Chamando gameOver()...');
		gameOverCallback();
	}
}

// Verificar colisões AABB
function checkCollisions(config, gameOverCallback) {
	// Determinar qual hitbox usar baseado no estado
	let hitbox;
	if (State.playerState === 'noChao') {
		hitbox = config.hitboxes.correndo;
	} else if (State.playerState === 'pulando') {
		hitbox = config.hitboxes.pulando;
	} else if (State.playerState === 'balancando') {
		hitbox = config.hitboxes.pendurado;
	}
	
	// Usar hitbox real ao invés do tamanho do sprite
	const playerLeft = config.playerX + hitbox.offsetX;
	const playerRight = config.playerX + hitbox.offsetX + hitbox.width;
	const playerTop = State.playerY + hitbox.offsetY;
	const playerBottom = State.playerY + hitbox.offsetY + hitbox.height;
	
	for (let obj of State.objects) {
		if (obj.type === 'buraco') {
			// Para buraco: cone tem colisão, buraco tem colisão
			
			// 1. Verificar colisão com o cone (triângulo)
			const coneLeft = obj.x;
			const coneRight = obj.x + obj.coneWidth;
			const coneTop = obj.coneY;
			const coneBottom = obj.coneY + obj.coneHeight;
			
			if (
				playerRight > coneLeft &&
				playerLeft < coneRight &&
				playerBottom > coneTop &&
				playerTop < coneBottom
			) {
				handleCollision(config, gameOverCallback);
				return;
			}
			
			// 2. Verificar colisão com o buraco
			const holeLeft = obj.x + obj.coneWidth;
			const holeRight = obj.x + obj.coneWidth + obj.holeWidth;
			const holeTop = obj.holeY;
			const holeBottom = obj.holeY + obj.holeHeight;
			
			// Detecção AABB no buraco
			if (
				playerRight > holeLeft &&
				playerLeft < holeRight &&
				playerBottom > holeTop &&
				playerTop < holeBottom
			) {
				handleCollision(config, gameOverCallback);
				return;
			}
		} else {
			// Obstáculos normais
			let objLeft = obj.x;
			let objRight = obj.x + obj.width;
			let objTop = obj.y;
			let objBottom = obj.y + obj.height;
			
			// Ajustar hitbox do carro (emoji) para área visual real
			if (obj.emoji) {
				// Carros grandes usam reduções menores para manter hitbox de 104x91px
				if (obj.size === 'large') {
					// Para carro de 110px manter hitbox de 104x91px
					const topReduction = obj.height * 0.1273;    // ~14px
					const bottomReduction = obj.height * 0.0455; // ~5px (110 - 14 - 5 = 91px)
					const sideReduction = obj.width * 0.0273;    // ~3px (110 - 6 = 104px)
					
					objTop += topReduction;
					objBottom -= bottomReduction;
					objLeft += sideReduction;
					objRight -= sideReduction;
				} else {
					// Carros pequenos e médios - reduções normais
					const topReduction = obj.height * 0.25;
					const bottomReduction = obj.height * 0.05;
					const sideReduction = obj.width * 0.10;
					
					objTop += topReduction;
					objBottom -= bottomReduction;
					objLeft += sideReduction;
					objRight -= sideReduction;
				}
			}
			
			// Detecção AABB
			if (
				playerRight > objLeft &&
				playerLeft < objRight &&
				playerBottom > objTop &&
				playerTop < objBottom
			) {
				// Colisão detectada
				handleCollision(config, gameOverCallback);
				return;
			}
		}
	}
}
