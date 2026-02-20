/* ============================================
   UI - Sistema de Interface (Painel de Leitura, Banner de Fase)
   ============================================ */

// ==================== PAINEL DE LEITURA ====================

// Estado do painel de leitura
let isReadingPanelOpen = false;

const ReadingSystem = {
	hasNewContent: false,
	buttonX: 0,
	buttonY: 10,
	buttonSize: 50,
	currentPhaseContent: 'Conteúdo da fase\n\n[Clique no botão de leitura para ver informações sobre a fase]',
	closeButtonBounds: null
};

// Desbloquear novo conteúdo
function unlockReadingContent() {
	ReadingSystem.hasNewContent = true;
	const phaseName = getCurrentPhase().name;
	ReadingSystem.currentPhaseContent = `Conteúdo da fase: ${phaseName}\n\n[Em breve você poderá ler histórias e informações sobre esta fase]`;
	console.log(`📖 Novo conteúdo de leitura desbloqueado!`);
}

// Abrir painel de leitura
function openReadingPanel() {
	isReadingPanelOpen = true;
	State.isPaused = true;
	
	const jumpButton = document.getElementById('jumpButton');
	if (jumpButton) jumpButton.style.display = 'none';
	
	if (ReadingSystem.hasNewContent) {
		ReadingSystem.hasNewContent = false;
	}
	
	console.log(`📚 Painel de leitura aberto - Jogo pausado`);
}

// Fechar painel de leitura
function closeReadingPanel() {
	isReadingPanelOpen = false;
	State.isPaused = false;
	State.lastTime = performance.now();
	
	if (State.isRunning && !State.gameOver && !State.victory) {
		const jumpButton = document.getElementById('jumpButton');
		if (jumpButton) jumpButton.style.display = 'block';
	}
	
	console.log(`📕 Painel de leitura fechado - Jogo retomado`);
}

// Desenhar botão de leitura
function drawReadingButton(ctx, canvasWidth) {
	if (isReadingPanelOpen) return;
	
	ReadingSystem.buttonX = canvasWidth - ReadingSystem.buttonSize - 10;
	const x = ReadingSystem.buttonX;
	const y = ReadingSystem.buttonY;
	const size = ReadingSystem.buttonSize;
	
	const buttonColor = ReadingSystem.hasNewContent ? '#FFD700' : '#555555';
	
	ctx.fillStyle = buttonColor;
	ctx.fillRect(x, y, size, size);
	
	ctx.strokeStyle = '#333333';
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, size, size);
	
	// Ícone de caderno
	ctx.fillStyle = '#FFFFFF';
	const iconPadding = 8;
	const iconX = x + iconPadding;
	const iconY = y + iconPadding;
	const iconWidth = size - iconPadding * 2;
	const iconHeight = size - iconPadding * 2;
	
	ctx.fillRect(iconX, iconY, iconWidth, iconHeight);
	
	ctx.strokeStyle = '#333333';
	ctx.lineWidth = 1;
	for (let i = 1; i <= 3; i++) {
		const lineY = iconY + (iconHeight / 4) * i;
		ctx.beginPath();
		ctx.moveTo(iconX + 4, lineY);
		ctx.lineTo(iconX + iconWidth - 4, lineY);
		ctx.stroke();
	}
	
	ctx.strokeStyle = '#333333';
	ctx.lineWidth = 2;
	for (let i = 0; i < 4; i++) {
		const spiralY = iconY + 6 + (i * 7);
		ctx.beginPath();
		ctx.arc(iconX - 2, spiralY, 2, 0, Math.PI * 2);
		ctx.stroke();
	}
}

// Desenhar painel de leitura
function drawReadingPanel(ctx, canvasWidth, canvasHeight) {
	if (!isReadingPanelOpen) return;
	
	ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	
	const panelWidth = canvasWidth * 0.9;
	const panelHeight = canvasHeight * 0.9;
	const panelX = (canvasWidth - panelWidth) / 2;
	const panelY = (canvasHeight - panelHeight) / 2;
	
	ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
	ctx.shadowBlur = 20;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 5;
	
	ctx.fillStyle = '#5D4037';
	ctx.fillRect(panelX - 8, panelY - 8, panelWidth + 16, panelHeight + 16);
	
	ctx.fillStyle = '#8D6E63';
	ctx.fillRect(panelX - 4, panelY - 4, panelWidth + 8, panelHeight + 8);
	
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
	
	ctx.shadowColor = 'transparent';
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	
	// Botão fechar
	const closeButtonSize = 40;
	const closeButtonX = panelX + panelWidth - closeButtonSize - 10;
	const closeButtonY = panelY + 10;
	
	ctx.fillStyle = '#E74C3C';
	ctx.fillRect(closeButtonX, closeButtonY, closeButtonSize, closeButtonSize);
	
	ctx.strokeStyle = '#C0392B';
	ctx.lineWidth = 2;
	ctx.strokeRect(closeButtonX, closeButtonY, closeButtonSize, closeButtonSize);
	
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(closeButtonX + 10, closeButtonY + 10);
	ctx.lineTo(closeButtonX + closeButtonSize - 10, closeButtonY + closeButtonSize - 10);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(closeButtonX + closeButtonSize - 10, closeButtonY + 10);
	ctx.lineTo(closeButtonX + 10, closeButtonY + closeButtonSize - 10);
	ctx.stroke();
	
	ReadingSystem.closeButtonBounds = {
		x: closeButtonX,
		y: closeButtonY,
		width: closeButtonSize,
		height: closeButtonSize
	};
	
	// Título
	ctx.fillStyle = '#000000';
	ctx.font = 'bold 28px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';
	ctx.fillText('📖 LEITURA DESBLOQUEADA', panelX + panelWidth / 2, panelY + 20);
	
	// Conteúdo
	ctx.font = '18px Arial';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	
	const lines = ReadingSystem.currentPhaseContent.split('\n');
	const lineHeight = 25;
	let textY = panelY + 80;
	
	lines.forEach(line => {
		ctx.fillText(line, panelX + 30, textY);
		textY += lineHeight;
	});
	
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
}

// ==================== BANNER DE FASE ====================

const PhaseBanner = {
	active: false,
	phaseName: '',
	y: -150,
	targetY: 30,
	state: 'hidden',
	timer: 0,
	displayDuration: 300,
	animationSpeed: 3
};

// Mostrar banner de fase
function showPhaseBanner(phaseName) {
	if (PhaseBanner.active && PhaseBanner.state !== 'leaving') {
		PhaseBanner.state = 'leaving';
	}
	
	PhaseBanner.active = true;
	PhaseBanner.phaseName = phaseName;
	PhaseBanner.y = -150;
	PhaseBanner.state = 'entering';
	PhaseBanner.timer = 0;
	
	console.log(`📢 Banner de fase ativado: "${phaseName}"`);
}

// Atualizar animação do banner
function updatePhaseBanner() {
	if (State.isPaused) return;
	if (!PhaseBanner.active) return;
	
	switch (PhaseBanner.state) {
		case 'entering':
			PhaseBanner.y += PhaseBanner.animationSpeed;
			if (PhaseBanner.y >= PhaseBanner.targetY) {
				PhaseBanner.y = PhaseBanner.targetY;
				PhaseBanner.state = 'showing';
				PhaseBanner.timer = 0;
			}
			break;
			
		case 'showing':
			PhaseBanner.timer++;
			if (PhaseBanner.timer >= PhaseBanner.displayDuration) {
				PhaseBanner.state = 'leaving';
			}
			break;
			
		case 'leaving':
			PhaseBanner.y -= PhaseBanner.animationSpeed;
			if (PhaseBanner.y <= -150) {
				PhaseBanner.active = false;
				PhaseBanner.state = 'hidden';
			}
			break;
	}
}

// Desenhar banner de fase
function drawPhaseBanner(ctx, canvasWidth) {
	if (!PhaseBanner.active) return;
	
	const bannerWidth = 400;
	const bannerHeight = 80;
	const bannerX = (canvasWidth - bannerWidth) / 2;
	const bannerY = PhaseBanner.y;
	
	ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
	ctx.shadowBlur = 20;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 5;
	
	ctx.fillStyle = '#5D4037';
	ctx.fillRect(bannerX - 6, bannerY - 6, bannerWidth + 12, bannerHeight + 12);
	
	ctx.fillStyle = '#8D6E63';
	ctx.fillRect(bannerX - 3, bannerY - 3, bannerWidth + 6, bannerHeight + 6);
	
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);
	
	ctx.shadowColor = 'transparent';
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	
	ctx.fillStyle = '#000000';
	ctx.font = 'bold 36px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(PhaseBanner.phaseName, bannerX + bannerWidth / 2, bannerY + bannerHeight / 2);
	
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
}
