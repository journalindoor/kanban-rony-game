/* ============================================
   UI - Sistema de Interface (Painel de Leitura, Banner de Fase)
   ============================================ */

// ==================== PAINEL DE LEITURA ====================

// Estado do painel de leitura
let isReadingPanelOpen = false;

const ReadingSystem = {
	hasNewContent: false,
	selectedPhaseIndex: 0, // Seleciona o "?" (Sobre este jogo) por padrão na abertura inicial
	unlockedPhases: [0], // Fase 0 (primeira fase do jogo) desbloqueada desde o início
	unlockedSpecialItems: ['about'], // "Sobre este jogo" (?) sempre desbloqueado
	
	// Controle de abertura automática (primeira entrada no jogo)
	hasOpenedAutomatically: false,
	
	// Propriedades do botão dentro do canvas
	buttonX: 0,
	buttonY: 10,
	buttonSize: 50,
	
	// Conteúdos de leitura (fases + itens especiais)
	// Ordem de exibição no grid 2x2: [?][🕸️] [0][1] [2]...
	phaseContents: [
		// Índice 0: Item especial "Sobre este jogo" (sempre desbloqueado, selecionado por padrão)
		{
			type: 'special',
			id: 'about',
			title: 'Sobre este jogo',
			content: 'Este jogo é uma representação da minha história profissional.\nCada fase simboliza um momento da minha trajetória, misturando carreira, lugares e aprendizados.\n\nSe você quiser conhecer minha experiência completa, pode acessar meu currículo no LinkedIn:\n\nwww.linkedin.com/in/ronaldojr/'
		},
		// Índice 1: Item especial "Mundo Teia" (desbloqueado ao pegar primeira guitarra)
		{
			type: 'special',
			id: 'mundoteia',
			title: 'Mundo Teia',
			content: 'Além da tecnologia, encontrei no cosplay uma forma de impactar pessoas de maneira diferente.\n\nParticipei de ações visitando hospitais como o Hemorio, além de creches e orfanatos, levando alegria para crianças e famílias através do personagem do Homem-Aranha.\n\nHoje faço parte do Mundo Teia, um grupo de cosplayers do Homem-Aranha que busca usar o personagem para fazer o bem e espalhar felicidade por onde passa.\n\nSe quiser conhecer mais sobre esse projeto:\n\nwww.instagram.com/mundoteia/'
		},
		// Índice 2: Fase 0 - Cidade Urbana (desbloqueada desde o início)
		{
			type: 'phase',
			phaseIndex: 0,
			title: 'Cidade Urbana',
			content: 'Bem-vindo à Cidade Urbana!\n\nEste é o bairro residencial onde Rony vive. As ruas são tranquilas, mas os carros não param por ninguém.\n\nCuidado ao atravessar!\n\nDica: Use o espaço para pular sobre os obstáculos.'
		},
		// Índice 3: Fase 1 - Cidade
		{
			type: 'phase',
			phaseIndex: 1,
			title: 'Cidade',
			content: 'A Cidade está mais movimentada!\n\nMais carros, mais velocidade, mais desafios.\n\nMantenha o ritmo e não perca sua guitarra!\n\nDica: A guitarra te protege de colisões por 3 segundos após perdê-la.'
		},
		// Índice 4: Fase 2 - Cidade Noturna
		{
			type: 'phase',
			phaseIndex: 2,
			title: 'Cidade Noturna',
			content: 'A noite chegou na cidade!\n\nAs luzes das janelas brilham na escuridão. O tráfego não diminui à noite.\n\nMantenha o foco mesmo com pouca luz!\n\nDica: Buracos são especialmente perigosos à noite.'
		}
	]
};

// Desbloquear novo conteúdo
function unlockReadingContent() {
	ReadingSystem.hasNewContent = true;
	const currentPhaseIndex = Phases.findIndex(p => p.name === getCurrentPhase().name);
	if (currentPhaseIndex !== -1) {
		// Desbloquear fase se ainda não estiver desbloqueada
		if (!ReadingSystem.unlockedPhases.includes(currentPhaseIndex)) {
			ReadingSystem.unlockedPhases.push(currentPhaseIndex);
			console.log(`📖 Fase ${currentPhaseIndex} desbloqueada para leitura!`);
			
			// Só mudar seleção se não for a primeira fase (deixar "?" selecionado no início)
			if (currentPhaseIndex !== 0) {
				const contentIndex = ReadingSystem.phaseContents.findIndex(
					c => c.type === 'phase' && c.phaseIndex === currentPhaseIndex
				);
				
				if (contentIndex !== -1) {
					ReadingSystem.selectedPhaseIndex = contentIndex;
				}
			}
		}
	}
}

// Desbloquear item especial
function unlockSpecialItem(itemId) {
	if (!ReadingSystem.unlockedSpecialItems.includes(itemId)) {
		ReadingSystem.unlockedSpecialItems.push(itemId);
		ReadingSystem.hasNewContent = true;
		console.log(`📖 Item especial "${itemId}" desbloqueado para leitura!`);
	}
}

// Helper: Verificar se conteúdo está desbloqueado
function isContentUnlocked(content) {
	if (content.type === 'special') {
		return ReadingSystem.unlockedSpecialItems.includes(content.id);
	}
	return ReadingSystem.unlockedPhases.includes(content.phaseIndex);
}

// Helper: Obter ícone do conteúdo
function getContentIcon(content, isUnlocked) {
	if (!isUnlocked) return '🔒';
	if (content.type === 'special') {
		return content.id === 'about' ? '?' : '🕸️';
	}
	return content.phaseIndex.toString();
}

// Helper: Processar links no texto e converter em parágrafos HTML
function processContentLinks(text) {
	// Dividir o texto em parágrafos (separação por \n\n ou \n)
	const paragraphs = text.split('\n\n').map(para => para.trim()).filter(para => para.length > 0);
	
	// Processar cada parágrafo
	const htmlParagraphs = paragraphs.map(paragraph => {
		// Substituir \n simples por espaço (dentro do parágrafo)
		const cleanParagraph = paragraph.replace(/\n/g, ' ');
		
		// Processar palavras para tornar URLs clicáveis
		const words = cleanParagraph.split(/(\s+)/);
		const processedText = words.map(word => {
			if (word.startsWith('http://') || word.startsWith('https://') || word.startsWith('www.')) {
				const url = word.startsWith('www.') ? 'https://' + word : word;
				return `<a href="${url}" target="_blank" rel="noopener">${word}</a>`;
			}
			return word;
		}).join('');
		
		return `<p>${processedText}</p>`;
	});
	
	return htmlParagraphs.join('');
}

// Abrir painel de leitura
function openReadingPanel() {
	isReadingPanelOpen = true;
	State.isPaused = true;
	
	if (ReadingSystem.selectedPhaseIndex !== 0) {
		ReadingSystem.selectedPhaseIndex = 0;
	}
	
	document.getElementById('readingPanel').style.display = 'flex';
	
	// Esconder botões de UI
	const jumpBtn = document.getElementById('jumpButton');
	const readingBtn = document.getElementById('readingButton');
	if (jumpBtn) jumpBtn.style.display = 'none';
	if (readingBtn) readingBtn.style.display = 'none';
	
	renderReadingIndex();
	renderReadingContent();
}

// Fechar painel de leitura
function closeReadingPanel() {
	isReadingPanelOpen = false;
	State.isPaused = false;
	ReadingSystem.hasNewContent = false;
	
	// Resetar lastTime para evitar deltaTime grande após pausa
	State.lastTime = performance.now();
	
	document.getElementById('readingPanel').style.display = 'none';
}

// Renderizar índice do painel
function renderReadingIndex() {
	const indexContainer = document.getElementById('readingIndex');
	indexContainer.innerHTML = '';
	
	ReadingSystem.phaseContents.forEach((content, index) => {
		const item = document.createElement('div');
		item.className = 'reading-index-item';
		
		const isUnlocked = isContentUnlocked(content);
		const icon = getContentIcon(content, isUnlocked);
		
		item.textContent = icon;
		
		if (!isUnlocked) item.classList.add('locked');
		if (index === ReadingSystem.selectedPhaseIndex) item.classList.add('selected');
		
		if (isUnlocked) {
			item.addEventListener('click', () => {
				ReadingSystem.selectedPhaseIndex = index;
				renderReadingIndex();
				renderReadingContent();
			});
		}
		
		indexContainer.appendChild(item);
	});
}

// Renderizar conteúdo selecionado
function renderReadingContent() {
	const selectedContent = ReadingSystem.phaseContents[ReadingSystem.selectedPhaseIndex];
	const titleEl = document.getElementById('readingTitle');
	const textEl = document.getElementById('readingText');
	const contentEl = document.getElementById('readingContent');
	
	if (!selectedContent) {
		titleEl.textContent = 'Conteúdo não encontrado';
		textEl.innerHTML = '';
		return;
	}
	
	const isUnlocked = isContentUnlocked(selectedContent);
	titleEl.textContent = selectedContent.title;
	
	if (isUnlocked) {
		textEl.innerHTML = processContentLinks(selectedContent.content);
	} else {
		textEl.innerHTML = '<div class="reading-locked-message">🔒 Conteúdo bloqueado</div>';
	}
	
	contentEl.scrollTop = 0;
}

// Resetar flag de abertura automática (chamado ao voltar à tela inicial)
function resetReadingPanelAutoOpen() {
	ReadingSystem.hasOpenedAutomatically = false;
	console.log('🔄 Flag de abertura automática resetada');
}

// ==================== BANNER DE FASE (removido - substituído pelo painel) ====================

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

// Desenhar banner de fase (estilo pixel art)
function drawPhaseBanner(ctx, canvasWidth) {
	if (!PhaseBanner.active) return;
	
	const bannerWidth = 400;
	const bannerHeight = 80;
	const bannerX = Math.floor((canvasWidth - bannerWidth) / 2);
	const bannerY = Math.floor(PhaseBanner.y);
	
	// Sombra pixel (4px offset, sem blur)
	ctx.fillStyle = '#000000';
	ctx.fillRect(bannerX + 4, bannerY + 4, bannerWidth, bannerHeight);
	
	// Borda externa (madeira escura)
	ctx.fillStyle = '#5D4037';
	ctx.fillRect(bannerX - 6, bannerY - 6, bannerWidth + 12, bannerHeight + 12);
	
	// Borda interna (madeira média)
	ctx.fillStyle = '#8D6E63';
	ctx.fillRect(bannerX - 3, bannerY - 3, bannerWidth + 6, bannerHeight + 6);
	
	// Fundo branco
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);
	
	// Texto com sombra pixel
	ctx.fillStyle = '#000000';
	ctx.font = 'bold 32px "Courier New", monospace';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(PhaseBanner.phaseName, bannerX + bannerWidth / 2 + 2, bannerY + bannerHeight / 2 + 2);
	
	ctx.fillStyle = '#000000';
	ctx.fillText(PhaseBanner.phaseName, bannerX + bannerWidth / 2, bannerY + bannerHeight / 2);
	
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
}
