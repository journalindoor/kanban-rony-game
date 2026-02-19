/* ============================================
   Física do Personagem e Pêndulo
   ============================================ */

// Física do personagem (baseada em estados)
function updatePlayerPhysics(config) {
	if (State.playerState === 'balancando') {
		// MODO PÊNDULO
		updatePendulum(config);
	} else {
		// MODO NORMAL (noChao ou pulando)
		
		// Aplicar gravidade
		State.velocityY += config.gravity;
		
		// Atualizar posição Y
		State.playerY += State.velocityY;
		
		// Limitar personagem dentro da tela
		if (State.playerY < config.ceilingY) {
			State.playerY = config.ceilingY;
			State.velocityY = 0;
		}
		
		// Verificar se tocou o chão
		if (State.playerY >= config.groundY) {
			State.playerY = config.groundY;
			State.velocityY = 0;
			State.playerState = 'noChao';
			// Recarregar teias ao tocar o chão
		// Se tem guitarra (modo punk), ganha 5 teias; senão, apenas 1
		State.webUsesRemaining = State.hasGuitarProtection ? 5 : 1;
		}
	}
}

// Atualizar física do pêndulo
function updatePendulum(config) {
	if (!State.webbedToPoint) {
		// Segurança: se não tem ponto de teia, voltar para queda
		State.playerState = 'pulando';
		return;
	}
	
	// CONDIÇÃO 1: Botão solto
	if (!State.buttonPressed) {
		soltarTeia();
		return;
	}
	
	// CONGELAR PERSONAGEM NO Y (com deslocamento visual)
	State.playerY = State.fixedPlayerY + State.webOffsetY;
	
	// Animação de peso corporal
	if (State.webbedToPoint.x >= config.playerX) {
		// FASE 1: Teia vindo - descer levemente (efeito peso)
		if (State.webOffsetY < 6) {
			State.webOffsetY += 0.2;
		}
	} else {
		// FASE 2: Teia passou - subir levemente (efeito impulso)
		if (State.webOffsetY > 0) {
			State.webOffsetY -= 0.2;
		} else {
			State.webOffsetY = 0; // garantir que não fique negativo
		}
	}
	
	// Velocidade dinâmica baseada no modo
	const currentSpeed = State.isPunkMode ? config.worldSpeedPunk : config.worldSpeedNormal;
	
	// Mover ponto da teia para a esquerda (simulando que o personagem avança)
	State.webbedToPoint.x -= currentSpeed;
	
	// Calcular distância percorrida pela teia
	const distanciaPercorrida = State.webStartX - State.webbedToPoint.x;
	const distanciaInicial = State.webStartX - config.playerX;
	
	// CONDIÇÃO 2: Limite traseiro (50% mais tempo)
	// Quando a teia percorreu 1.5x a distância que foi criada à frente
	if (distanciaPercorrida >= distanciaInicial * 1.5) {
		soltarTeia();
	}
}

// Ativar modo teia (somente quando está no ar)
function ativarTeia(config) {
	// Criar ponto de ancoragem fora da área visível, acima do topo
	const webX = config.playerX + 200; // mais à frente para diágonal
	const webY = -50; // acima do topo da tela (fora da área visível)
	
	State.webbedToPoint = { x: webX, y: webY };
	State.webStartX = webX; // salvar posição inicial
	State.fixedPlayerY = State.playerY; // congelar Y atual
	
	// Decrementar usos disponíveis
	State.webUsesRemaining--;
	
	// Resetar animação
	State.webOffsetY = 0;
	State.webOffsetDirection = 'down';
	
	// Mudar estado para balançando
	State.playerState = 'balancando';
}

// Soltar teia e voltar para queda livre
function soltarTeia() {
	State.webbedToPoint = null;
	State.playerState = 'pulando';
	
	// Resetar animação
	State.webOffsetY = 0;
	State.webOffsetDirection = 'down';
	
	// Velocidade Y começa em 0 (cai reto)
	State.velocityY = 0;
}

// Função de pulo (controle principal)
function jump(config) {
	if (!State.isRunning || State.gameOver) return;
	
	// ESTADO: noChao → pulo vertical normal
	if (State.playerState === 'noChao') {
		// Pulo diferenciado: Punk pula mais alto que Rony normal
		const jumpForce = State.isPunkMode ? config.jumpForcePunk : config.jumpForceNormal;
		State.velocityY = -jumpForce;
		State.playerState = 'pulando';
	}
	// ESTADO: pulando → ativar teia (se tiver teias disponíveis)
	else if (State.playerState === 'pulando') {
		if (State.webUsesRemaining > 0) {
			ativarTeia(config);
		}
	}
	// ESTADO: balancando → ignorar input
	else if (State.playerState === 'balancando') {
		// NÃO fazer nada
		return;
	}
}
