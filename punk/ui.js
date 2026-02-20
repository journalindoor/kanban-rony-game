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
	
	// Controle de itens visualizados (para badges "Novo")
	viewedItems: ['about'], // "Sobre este jogo" já visualizado por padrão
	
	// Controle de abertura automática (primeira entrada no jogo)
	hasOpenedAutomatically: false,
	
	// Estado de animação
	isAnimating: false,
	buttonPulseTime: 0,
	animationStartTime: 0, // Tempo de início da animação de novo conteúdo
	
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
		// Índice 2: Fase 0 - Raízes Digitais
		{
			type: 'phase',
			phaseIndex: 0,
			title: 'Fase 0 – Raízes Digitais (Nilópolis / Edson Passos)',
			content: 'Crescer em Nilópolis e Edson Passos significou aprender cedo que curiosidade e persistência valem mais que qualquer ferramenta. Entre ruas da Baixada e tardes explorando computadores antigos, descobri que a tecnologia podia ser um caminho para criar soluções, resolver problemas e transformar ideias em realidade. Foi nesse período que a semente do desenvolvedor nasceu, com pequenas experiências em HTML, PHP e design, cada erro sendo um aprendizado e cada acerto, uma motivação para seguir.'
		},
		// Índice 3: Fase 1 - Surto Criativo
		{
			type: 'phase',
			phaseIndex: 1,
			title: 'Fase 1 – Surto Criativo (Freelance / Primeiros Projetos)',
			content: 'Criar sites, logotipos, mascotes e materiais para pequenas empresas me colocou em contato com o mundo real do desenvolvimento e da comunicação digital. Aprendi que além de código, era necessário entender pessoas, processos e expectativas. Cada cliente, cada pedido inesperado e cada prazo apertado se tornou uma lição de autonomia, resolução de problemas e criatividade aplicada. Esse período foi decisivo para consolidar disciplina técnica e visão de produto, combinando design, front-end e PHP para entregar soluções que realmente funcionassem.'
		},
		// Índice 4: Fase 2 - Evolução Técnica
		{
			type: 'phase',
			phaseIndex: 2,
			title: 'Fase 2 – Evolução Técnica (CL Digital Marketing / Front-End Senior)',
			content: 'Aprofundar-me em Front-End e desenvolvimento web trouxe uma nova dimensão: não bastava que o código funcionasse, ele precisava ser limpo, eficiente e escalável. Trabalhar em projetos de layout, hotsites e apps mobile me ensinou a importância de boas práticas, modularização e reutilização de componentes. Cada interface, cada teste e cada otimização me aproximavam da capacidade de transformar complexidade em experiências digitais consistentes, mesclando técnica e estética com foco em qualidade e impacto.'
		},
		// Índice 5: Fase 3 - Liderança Técnica
		{
			type: 'phase',
			phaseIndex: 3,
			title: 'Fase 3 – Liderança Técnica (Ventron / Medgrupo)',
			content: 'Assumir papéis de liderança técnica foi mais do que coordenar projetos ou times: foi aprender a guiar pessoas, priorizar demandas e conectar objetivos estratégicos a entregas concretas. Criar softwares internos, diagramação de apostilas digitais e novas funcionalidades me fez perceber que soluções técnicas só são valiosas se integradas a processos claros e equipes bem alinhadas. O aprendizado aqui foi duplo: excelência técnica e desenvolvimento da habilidade de liderar com empatia e visão sistêmica.'
		},
		// Índice 6: Fase 4 - Mestre Ágil
		{
			type: 'phase',
			phaseIndex: 4,
			title: 'Fase 4 – Mestre Ágil (Scrum Master / Delivery Manager)',
			content: 'Transformar equipes em protagonistas da entrega de valor exigiu mais do que metodologias: exigiu atenção às pessoas, cultura organizacional e clareza de propósito. Facilitar cerimônias, remover obstáculos e alinhar objetivos estratégicos com a execução diária me ensinou que agilidade não é só velocidade, mas impacto real. Cada sprint e retrospectiva era oportunidade de aprendizado, tanto para o time quanto para mim, consolidando práticas ágeis como cultura e não apenas como processos, sempre buscando entregar valor relevante e sustentável.'
		},
		// Índice 7: Fase 5 - Inovação Inteligente
		{
			type: 'phase',
			phaseIndex: 5,
			title: 'Fase 5 – Inovação Inteligente (GenAI4Devs / Squad Enablers)',
			content: 'A chegada da Inteligência Artificial ao meu trabalho trouxe desafios inéditos: coordenar a adoção de ferramentas generativas, criar métricas, testar agentes de IA e transformar experimentação em aprendizado organizacional. Cada projeto exigiu intencionalidade, cuidado com dados e visão estratégica para que a tecnologia ampliasse a capacidade do time e não apenas gerasse relatórios. Aprendi que inovação verdadeira nasce da combinação entre rigor técnico, curiosidade e responsabilidade humana, criando soluções escaláveis e seguras.'
		},
		// Índice 8: Fase 6 - Impacto Estratégico
		{
			type: 'phase',
			phaseIndex: 6,
			title: 'Fase 6 – Impacto Estratégico (YDUQS / Agile Master Sr)',
			content: 'Hoje, meu foco é conectar pessoas, dados, tecnologia e decisões estratégicas para gerar valor real. Apoiar equipes, evoluir processos, implementar métricas e garantir entregas consistentes me permite transformar desafios complexos em oportunidades de aprendizado e inovação. Cada projeto, cada decisão e cada interação reforçam que agilidade vai muito além de frameworks: trata-se de criar clareza, impacto e propósito, unindo técnica e experiência humana para resultados que realmente importam.'
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

// Helper: Verificar se item é novo (desbloqueado mas não visualizado)
function isItemNew(content) {
	const isUnlocked = isContentUnlocked(content);
	if (!isUnlocked) return false;
	
	if (content.type === 'special') {
		return !ReadingSystem.viewedItems.includes(content.id);
	} else if (content.type === 'phase') {
		const phaseId = `phase-${content.phaseIndex}`;
		return !ReadingSystem.viewedItems.includes(phaseId);
	}
	return false;
}

// Helper: Marcar item como visualizado
function markItemAsViewed(content) {
	if (content.type === 'special') {
		if (!ReadingSystem.viewedItems.includes(content.id)) {
			ReadingSystem.viewedItems.push(content.id);
		}
	} else if (content.type === 'phase') {
		const phaseId = `phase-${content.phaseIndex}`;
		if (!ReadingSystem.viewedItems.includes(phaseId)) {
			ReadingSystem.viewedItems.push(phaseId);
		}
	}
	
	// Atualizar hasNewContent: só fica true se ainda houver itens novos
	const hasAnyNew = ReadingSystem.phaseContents.some(c => isItemNew(c));
	ReadingSystem.hasNewContent = hasAnyNew;
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
		const showNewBadge = isItemNew(content);
		
		item.textContent = icon;
		
		if (!isUnlocked) item.classList.add('locked');
		if (index === ReadingSystem.selectedPhaseIndex) item.classList.add('selected');
		
		// Adicionar badge "Novo" se aplicável
		if (showNewBadge) {
			const badge = document.createElement('span');
			badge.className = 'new-badge';
			badge.textContent = 'Novo';
			item.appendChild(badge);
		}
		
		if (isUnlocked) {
			item.addEventListener('click', () => {
				ReadingSystem.selectedPhaseIndex = index;
				// Marcar como visualizado
				markItemAsViewed(content);
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
	const subtitleEl = document.getElementById('readingSubtitle');
	const textEl = document.getElementById('readingText');
	const contentEl = document.getElementById('readingContent');
	
	if (!selectedContent) {
		titleEl.textContent = 'Conteúdo não encontrado';
		subtitleEl.textContent = '';
		textEl.innerHTML = '';
		return;
	}
	
	const isUnlocked = isContentUnlocked(selectedContent);
	
	// Separar título e subtítulo (conteúdo entre parênteses)
	const fullTitle = selectedContent.title;
	const parenthesesMatch = fullTitle.match(/^(.+?)\s*\((.+)\)\s*$/);
	
	if (parenthesesMatch) {
		// Tem subtítulo entre parênteses
		titleEl.textContent = parenthesesMatch[1].trim();
		subtitleEl.textContent = parenthesesMatch[2].trim();
		subtitleEl.style.display = 'block';
	} else {
		// Sem subtítulo
		titleEl.textContent = fullTitle;
		subtitleEl.textContent = '';
		subtitleEl.style.display = 'none';
	}
	
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
