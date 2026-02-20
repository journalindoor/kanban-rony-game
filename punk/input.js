/* ============================================
   Controle de Input e Botões
   ============================================ */

// Detectar se é dispositivo móvel
function isMobileDevice() {
	return window.innerWidth <= 768 && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Solicitar fullscreen
function requestFullscreen() {
	const elem = document.documentElement;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) {
		elem.webkitRequestFullscreen();
	} else if (elem.mozRequestFullScreen) {
		elem.mozRequestFullScreen();
	} else if (elem.msRequestFullscreen) {
		elem.msRequestFullscreen();
	}
}

// Sair do fullscreen
function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}

// Verificar se está em fullscreen
function isFullscreen() {
	return !!(document.fullscreenElement || document.webkitFullscreenElement || 
			  document.mozFullScreenElement || document.msFullscreenElement);
}

// Toggle fullscreen
function toggleFullscreen() {
	if (isFullscreen()) {
		exitFullscreen();
		console.log('🔲 Saindo do fullscreen');
	} else {
		requestFullscreen();
		console.log('🔲 Entrando em fullscreen');
	}
}

// Botão pressionado
function handleButtonPress(config) {
	return function(e) {
		// Bloquear input se painel de leitura estiver aberto
		if (isReadingPanelOpen) return;
		
		e.preventDefault();
		State.buttonPressed = true;
		jump(config);
	};
}

// Botão solto
function handleButtonRelease(e) {	// Bloquear input se painel de leitura estiver aberto
	if (isReadingPanelOpen) return;
		e.preventDefault();
	State.buttonPressed = false;
	
	// Se estiver balançando e soltar o botão, soltar a teia
	if (State.playerState === 'balancando') {
		soltarTeia();
	}
}
