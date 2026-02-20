/* ============================================
   🔧 Sistema de DEBUG
   Controles para testar fases e visualizar hitboxes
   ============================================ */

// Variável global para controle de hitbox
let debugHitbox = false;

// Inicializar controles de debug
function initDebugControls() {
	// Botões de fase
	const phaseBtn0 = document.getElementById('phaseBtn0');
	const phaseBtn1 = document.getElementById('phaseBtn1');
	const phaseBtn2 = document.getElementById('phaseBtn2');
	
	// Botão de hitbox
	const hitboxToggleBtn = document.getElementById('hitboxToggleBtn');
	
	// Event listeners para botões de fase
	phaseBtn0.addEventListener('click', () => {
		switchPhase(0);
		updatePhaseButtons();
	});
	
	phaseBtn1.addEventListener('click', () => {
		switchPhase(1);
		updatePhaseButtons();
	});
	
	phaseBtn2.addEventListener('click', () => {
		switchPhase(2);
		updatePhaseButtons();
	});
	
	// Event listener para toggle de hitbox
	hitboxToggleBtn.addEventListener('click', () => {
		debugHitbox = !debugHitbox;
		updateHitboxButton();
		console.log(`🔧 Debug Hitbox: ${debugHitbox ? 'ON' : 'OFF'}`);
	});
	
	// Inicializar estado dos botões
	updatePhaseButtons();
	updateHitboxButton();
	
	console.log('🔧 Sistema de DEBUG inicializado');
}

// Mudar de fase
function switchPhase(phaseIndex) {
	const previousPhase = getCurrentPhase().name;
	
	if (setPhase(phaseIndex)) {
		console.log(`🌍 Mudança de fase: ${previousPhase} → ${getCurrentPhase().name}`);
		
		// Se o jogo estiver rodando, atualizar o ambiente
		if (State.isRunning) {
			// Reinicializar prédios com cores da nova fase
			initBuildings(Config);
			console.log('🏗️ Ambiente atualizado para nova fase');
		}
	}
}

// Atualizar estado visual dos botões de fase
function updatePhaseButtons() {
	const phaseBtn0 = document.getElementById('phaseBtn0');
	const phaseBtn1 = document.getElementById('phaseBtn1');
	const phaseBtn2 = document.getElementById('phaseBtn2');
	
	// Remover classe active de todos
	phaseBtn0.classList.remove('active');
	phaseBtn1.classList.remove('active');
	phaseBtn2.classList.remove('active');
	
	// Adicionar classe active ao botão da fase atual
	if (currentPhaseIndex === 0) {
		phaseBtn0.classList.add('active');
	} else if (currentPhaseIndex === 1) {
		phaseBtn1.classList.add('active');
	} else if (currentPhaseIndex === 2) {
		phaseBtn2.classList.add('active');
	}
}

// Atualizar estado visual do botão de hitbox
function updateHitboxButton() {
	const hitboxToggleBtn = document.getElementById('hitboxToggleBtn');
	
	if (debugHitbox) {
		hitboxToggleBtn.textContent = 'ON';
		hitboxToggleBtn.classList.add('active');
	} else {
		hitboxToggleBtn.textContent = 'OFF';
		hitboxToggleBtn.classList.remove('active');
	}
}

// Desenhar hitbox genérica
function drawDebugHitbox(ctx, x, y, width, height, label = '') {
	if (!debugHitbox) return;
	
	ctx.strokeStyle = '#00ff00';
	ctx.lineWidth = 1;
	ctx.strokeRect(x, y, width, height);
	
	// Desenhar label se fornecido
	if (label) {
		ctx.fillStyle = '#00ff00';
		ctx.font = '10px Arial';
		ctx.fillText(label, x, y - 2);
	}
}

// Inicializar quando o DOM carregar
window.addEventListener('DOMContentLoaded', () => {
	initDebugControls();
});
