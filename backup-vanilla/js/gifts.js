let currentGift = null;
let appConfig = null;

const GIFT_IMG_PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23F4F1EA'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='40' fill='%23B8A18E'%3E🎁%3C/text%3E%3C/svg%3E`;

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// ── RENDER GIFTS ──────────────────────────────────────────────────────────────
function renderGifts(config) {
  appConfig = config;
  const section = document.getElementById('lista');

  section.innerHTML = `
    <div class="gifts-page">
      <header class="gifts-header">
        <a href="#home" class="gifts-header__back">← Início</a>
        <h1 class="gifts-header__title">Lista de Presentes</h1>
        <div class="gifts-header__spacer"></div>
      </header>
      <div class="gifts-body">
        <div class="gifts-grid" id="gifts-grid"></div>
      </div>
    </div>
  `;

  const grid = document.getElementById('gifts-grid');

  config.gifts.forEach(gift => {
    const gifted = !gift.available || isGifted(gift.id);
    const card = document.createElement('div');
    card.className = 'gift-card' + (gifted ? ' gift-card--gifted' : '');
    card.dataset.giftId = gift.id;

    card.innerHTML = `
      ${gifted ? '<span class="gift-card__gifted-badge">Presenteado ✓</span>' : ''}
      <div class="gift-card__img-wrap">
        <img
          src="${gift.imageUrl || GIFT_IMG_PLACEHOLDER}"
          alt="${gift.name}"
          loading="lazy"
          onerror="this.src='${GIFT_IMG_PLACEHOLDER}'"
        >
      </div>
      <div class="gift-card__body">
        ${gift.category ? `<p class="gift-card__category">${gift.category}</p>` : ''}
        <h3 class="gift-card__name">${gift.name}</h3>
        ${gift.description ? `<p class="gift-card__desc">${gift.description}</p>` : ''}
        <p class="gift-card__value">${formatCurrency(gift.value)}</p>
      </div>
    `;

    if (!gifted) {
      card.addEventListener('click', () => openConfirmModal(gift));
    }

    grid.appendChild(card);
  });
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function openConfirmModal(gift) {
  currentGift = gift;

  document.getElementById('modal-gift-img').src = gift.imageUrl || GIFT_IMG_PLACEHOLDER;
  document.getElementById('modal-gift-img').onerror = function() { this.src = GIFT_IMG_PLACEHOLDER; };
  document.getElementById('modal-gift-name').textContent = gift.name;
  document.getElementById('modal-gift-value').textContent = formatCurrency(gift.value);
  document.getElementById('modal-confirm-text').textContent =
    `Você está presenteando o casal com "${gift.name}" no valor de ${formatCurrency(gift.value)}. Confirmar?`;

  document.getElementById('modal-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.body.style.overflow = '';
  currentGift = null;
}

// ── PAYMENT SCREEN ────────────────────────────────────────────────────────────
function openPaymentScreen(gift) {
  markGifted(gift.id);

  document.getElementById('payment-gift-img').src = gift.imageUrl || GIFT_IMG_PLACEHOLDER;
  document.getElementById('payment-gift-img').onerror = function() { this.src = GIFT_IMG_PLACEHOLDER; };
  document.getElementById('payment-gift-name').textContent = gift.name;
  document.getElementById('payment-gift-value').textContent = formatCurrency(gift.value);

  const pix = appConfig.pix;
  document.getElementById('pix-key-display').textContent = pix.key;

  document.getElementById('qrcode-container').innerHTML = '';
  try {
    const payload = generatePixPayload(pix, gift.value);
    renderQRCode(payload, 'qrcode-container');
  } catch (e) {
    document.getElementById('qrcode-container').innerHTML =
      '<p style="font-size:0.8rem;color:#888;padding:1rem;">QR Code indisponível.<br>Use a chave abaixo.</p>';
  }

  const waLink = buildWhatsAppLink(gift, pix);
  const btnWa = document.getElementById('btn-whatsapp');
  if (waLink && btnWa) {
    btnWa.href = waLink;
    btnWa.classList.remove('hidden');
  } else if (btnWa) {
    btnWa.classList.add('hidden');
  }

  document.getElementById('lista').classList.add('hidden');
  document.getElementById('payment-screen').classList.remove('hidden');
  window.scrollTo(0, 0);
}

// ── COPY PIX KEY ──────────────────────────────────────────────────────────────
function copyPixKey() {
  const key = appConfig?.pix?.key || '';
  const btn = document.getElementById('btn-copy-pix');

  function onSuccess() {
    btn.textContent = 'Copiado! ✓';
    btn.classList.add('btn-copy--copied');
    setTimeout(() => {
      btn.textContent = 'Copiar chave Pix';
      btn.classList.remove('btn-copy--copied');
    }, 2000);
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(key).then(onSuccess).catch(() => fallbackCopy(key, onSuccess));
  } else {
    fallbackCopy(key, onSuccess);
  }
}

function fallbackCopy(text, onSuccess) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    onSuccess();
  } catch {}
  document.body.removeChild(ta);
}

// ── WHATSAPP ──────────────────────────────────────────────────────────────────
function buildWhatsAppLink(gift, pixConfig) {
  if (!pixConfig.whatsappNumber) return null;
  const number = pixConfig.whatsappNumber.replace(/\D/g, '');
  const message = `Olá! Acabei de presentear vocês com "${gift.name}" 🎁 Que o presente chegue cheio de amor para o novo lar de vocês! 💕`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// ── BACK TO LIST ──────────────────────────────────────────────────────────────
function backToList() {
  document.getElementById('payment-screen').classList.add('hidden');
  document.getElementById('lista').classList.remove('hidden');
  renderGifts(appConfig);
  window.scrollTo(0, 0);
}

// ── INIT EVENT LISTENERS ──────────────────────────────────────────────────────
function initGiftListeners() {
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.getElementById('btn-modal-cancel').addEventListener('click', closeModal);

  document.getElementById('btn-modal-confirm').addEventListener('click', () => {
    const gift = currentGift;
    closeModal();
    openPaymentScreen(gift);
  });

  document.getElementById('btn-copy-pix').addEventListener('click', copyPixKey);

  document.getElementById('btn-payment-back').addEventListener('click', () => {
    document.getElementById('payment-screen').classList.add('hidden');
    document.getElementById('lista').classList.remove('hidden');
    renderGifts(appConfig);
    window.scrollTo(0, 0);
  });

  document.getElementById('btn-back-list').addEventListener('click', backToList);
}
