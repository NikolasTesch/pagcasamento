let config = null;

async function init() {
  try {
    const res = await fetch('config.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    config = await res.json();
    window.appConfig = config;
    router();
  } catch (err) {
    document.body.innerHTML = `
      <div class="app-error">
        <div>
          <p style="font-size:2rem;margin-bottom:1rem;">💕</p>
          <p>Não foi possível carregar o site.<br>Verifique sua conexão e recarregue a página.</p>
        </div>
      </div>`;
  }
}

function showHome() {
  document.getElementById('home').classList.remove('hidden');
  document.getElementById('lista').classList.add('hidden');
  document.getElementById('payment-screen').classList.add('hidden');
  document.getElementById('modal-overlay').classList.add('hidden');
  document.title = config?.wedding?.coupleName
    ? `Casamento de ${config.wedding.coupleName}`
    : 'Nosso Casamento';
  renderHome(config);
}

function showGifts() {
  document.getElementById('home').classList.add('hidden');
  document.getElementById('lista').classList.remove('hidden');
  document.getElementById('payment-screen').classList.add('hidden');
  document.getElementById('modal-overlay').classList.add('hidden');
  document.body.style.overflow = '';
  document.title = 'Lista de Presentes';
  renderGifts(config);
}

function router() {
  if (!config) return;
  const hash = window.location.hash;
  if (hash === '#lista') {
    showGifts();
  } else {
    showHome();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initGiftListeners();
  init();
});

window.addEventListener('hashchange', () => {
  if (!config) return;
  router();
});
