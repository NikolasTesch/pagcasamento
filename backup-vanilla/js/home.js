let homeRendered = false;

function renderHome(config) {
  if (homeRendered) return;
  homeRendered = true;

  const w = config.wedding;

  const dateObj = new Date(w.weddingDate + 'T12:00:00');
  const dateFormatted = dateObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const dateCapitalized = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  const [firstName, secondName] = w.coupleName.split('&').map(s => s.trim());

  const mapsLink = w.venue.mapsUrl
    ? `<a class="event-detail__link" href="${w.venue.mapsUrl}" target="_blank" rel="noopener">Ver no mapa →</a>`
    : '';

  document.getElementById('home').innerHTML = `
    <section class="hero" style="background-image: url('${w.couplePhotoUrl}')">
      <div class="hero__content">
        <p class="hero__eyebrow">Casamento</p>
        <h1 class="hero__names">
          ${firstName}<br>
          <span class="hero__ampersand">&amp;</span><br>
          ${secondName}
        </h1>
        <p class="hero__date">${dateCapitalized}</p>
        <a href="#lista" class="hero__cta">Lista de presentes 🎁</a>
      </div>
    </section>

    <section class="event-details">
      <div class="event-details__inner">
        <div>
          <span class="event-detail__icon">📅</span>
          <p class="event-detail__label">Data</p>
          <p class="event-detail__value">${dateCapitalized}</p>
        </div>
        <div>
          <span class="event-detail__icon">🕐</span>
          <p class="event-detail__label">Horário</p>
          <p class="event-detail__value">${w.weddingTime}h</p>
        </div>
        <div>
          <span class="event-detail__icon">📍</span>
          <p class="event-detail__label">Local</p>
          <p class="event-detail__value">${w.venue.name}</p>
          <p class="event-detail__sub">${w.venue.address}</p>
          ${mapsLink}
        </div>
      </div>
    </section>

    <section class="couple-story">
      <div class="couple-story__inner">
        <p class="couple-story__eyebrow">Nossa História</p>
        <h2 class="couple-story__title">Como tudo começou</h2>
        <p class="couple-story__text">${w.story || ''}</p>
        <div class="couple-story__divider"></div>
        <p class="couple-story__message">"${w.message}"</p>
      </div>
    </section>

    <section class="gift-cta">
      <div class="gift-cta__inner">
        <h2 class="gift-cta__title">Lista de Presentes</h2>
        <p class="gift-cta__sub">
          Sua presença é nosso maior presente.<br>
          Se desejar nos presentear, escolha um item especial para o nosso lar.
        </p>
        <a href="#lista" class="btn btn-primary">Ver lista de presentes</a>
      </div>
    </section>

    <footer class="site-footer">
      <p>${firstName} &amp; ${secondName} · ${w.weddingDate.split('-')[0]} · Feito com amor 💕</p>
    </footer>
  `;
}
