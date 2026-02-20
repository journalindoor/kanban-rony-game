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
