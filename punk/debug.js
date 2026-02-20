/* ============================================
   🔧 Sistema de DEBUG
   Controles para testar fases e visualizar hitboxes
   Ativação: Código Konami (Cima, Cima, Baixo, Baixo, Esquerda, Direita, Esquerda, Direita, B, A, Enter)
   ============================================ */

// Variável global para controle de hitbox
let debugHitbox = false;

// Sistema de detecção do Konami Code
const KonamiCode = {
	// Sequência esperada: Cima, Cima, Baixo, Baixo, Esquerda, Direita, Esquerda, Direita, B, A, Enter
	sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'],
	currentIndex: 0,
	lastInputTime: 0,
	timeout: 2000, // 2 segundos para resetar se não continuar a sequência
	
	// Verificar tecla pressionada
	checkKey: function(key) {
		const now = Date.now();
		
		// Resetar se passou muito tempo desde a última tecla
		if (now - this.lastInputTime > this.timeout) {
			this.currentIndex = 0;
		}
		
		this.lastInputTime = now;
		
		// Verificar se a tecla está correta na sequência
		if (key === this.sequence[this.currentIndex]) {
			this.currentIndex++;
			
			// Sequência completa!
			if (this.currentIndex === this.sequence.length) {
				this.currentIndex = 0;
				return true;
			}
		} else {
			// Tecla errada, resetar sequência
			this.currentIndex = 0;
			
			// Tentar novamente caso a tecla errada seja o início da sequência
			if (key === this.sequence[0]) {
				this.currentIndex = 1;
			}
		}
		
		return false;
	},
	
	reset: function() {
		this.currentIndex = 0;
	}
};

// Alternar visibilidade do debug panel
function toggleDebugPanel() {
	const panel = document.getElementById('debugPanel');
	panel.classList.toggle('active');
	
	if (panel.classList.contains('active')) {
		console.log('🎮 DEBUG MODE ACTIVATED!');
	} else {
		console.log('🔒 Debug mode deactivated');
	}
}

// Mostrar debug panel
function showDebugPanel() {
	const panel = document.getElementById('debugPanel');
	panel.classList.add('active');
	console.log('🎮 DEBUG MODE ACTIVATED!');
}

// Esconder debug panel
function hideDebugPanel() {
	const panel = document.getElementById('debugPanel');
	panel.classList.remove('active');
	console.log('🔒 Debug mode deactivated');
}

// Inicializar controles de debug
function initDebugControls() {
	// Gerar botões de fase dinamicamente
	generatePhaseButtons();
	
	// Botão de hitbox
	const hitboxToggleBtn = document.getElementById('hitboxToggleBtn');
	
	// Event listener para toggle de hitbox
	hitboxToggleBtn.addEventListener('click', () => {
		debugHitbox = !debugHitbox;
		updateHitboxButton();
		console.log(`🔧 Debug Hitbox: ${debugHitbox ? 'ON' : 'OFF'}`);
	});
	
	// Adicionar botão de fechar ao debug panel
	const debugTitle = document.querySelector('.debug-title');
	const closeBtn = document.createElement('button');
	closeBtn.textContent = '×';
	closeBtn.className = 'debug-close-btn';
	closeBtn.addEventListener('click', hideDebugPanel);
	debugTitle.appendChild(closeBtn);
	
	// Listener global para Konami Code
	document.addEventListener('keydown', (e) => {
		// Verificar Konami Code
		if (KonamiCode.checkKey(e.key)) {
			showDebugPanel();
		}
		
		// ESC para fechar debug panel
		if (e.key === 'Escape') {
			const panel = document.getElementById('debugPanel');
			if (panel.classList.contains('active')) {
				hideDebugPanel();
				e.preventDefault();
			}
		}
	});
	
	// Inicializar estado dos botões
	updatePhaseButtons();
	updateHitboxButton();
	
	console.log(`🔧 Sistema de DEBUG inicializado - ${Phases.length} fases disponíveis`);
	console.log('🎮 Dica: Use o código Konami para ativar o debug menu!');
}

// Gerar botões de fase dinamicamente
function generatePhaseButtons() {
	const container = document.getElementById('phaseButtonsContainer');
	container.innerHTML = ''; // Limpar container
	
	// Criar um botão para cada fase
	Phases.forEach((phase, index) => {
		const button = document.createElement('button');
		button.id = `phaseBtn${index}`;
		button.className = 'debug-btn phase-btn';
		button.textContent = `Fase ${index}`;
		
		// Marcar fase atual como ativa
		if (index === currentPhaseIndex) {
			button.classList.add('active');
		}
		
		// Event listener
		button.addEventListener('click', () => {
			switchPhase(index);
			updatePhaseButtons();
		});
		
		container.appendChild(button);
	});
}

// Mudar de fase
function switchPhase(phaseIndex) {
	const previousPhase = getCurrentPhase().name;
	
	if (setPhase(phaseIndex)) {
		console.log(`🌍 Mudança de fase: ${previousPhase} → ${getCurrentPhase().name}`);
		
		// Desbloquear a fase no painel de leitura
		if (!ReadingSystem.unlockedPhases.includes(phaseIndex)) {
			ReadingSystem.unlockedPhases.push(phaseIndex);
			ReadingSystem.hasNewContent = true;
			console.log(`📚 Fase ${phaseIndex} desbloqueada no painel de leitura`);
		}
		
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
	// Remover classe active de todos
	Phases.forEach((phase, index) => {
		const button = document.getElementById(`phaseBtn${index}`);
		if (button) {
			button.classList.remove('active');
		}
	});
	
	// Adicionar classe active ao botão da fase atual
	const currentButton = document.getElementById(`phaseBtn${currentPhaseIndex}`);
	if (currentButton) {
		currentButton.classList.add('active');
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
		ctx.font = '10px "Courier New", monospace';
		ctx.fillText(label, x, y - 2);
	}
}

// Inicializar quando o DOM carregar
window.addEventListener('DOMContentLoaded', () => {
	initDebugControls();
});
