---
description: "Task list for Site de Casamento com Lista de Presentes"
---

# Tasks: Site de Casamento com Lista de Presentes

**Input**: Design documents from `specs/001-wedding-site-gifts/`

**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/config-schema.md ✅ | quickstart.md ✅

**Tests**: Validação manual via checklist do `quickstart.md` — nenhum framework de teste automatizado.

**Stack**: HTML5 + CSS3 + Vanilla JS | `qrcode-generator` (bundled em `lib/`) | `config.json` como fonte de verdade | Deploy: Vercel

---

## Phase 1: Setup (Estrutura Inicial)

**Purpose**: Criar a estrutura de diretórios, arquivos base e dependências locais.

- [x] T001 Criar estrutura de diretórios do projeto: `css/`, `js/`, `lib/`, `images/`, `images/gifts/` na raiz de `pagcasamento/`
- [x] T002 Baixar `qrcode-generator` v1.x minificado e salvar em `lib/qrcode.min.js` (fonte: https://github.com/kazuhikoarase/qrcode-generator/blob/master/js/qrcode.js)
- [x] T003 Criar `config.json` na raiz com estrutura completa de exemplo — campos: `wedding` (coupleName, weddingDate, weddingTime, venue, couplePhotoUrl, message), `gifts` (array com 5 presentes de exemplo com `available: true`/`false`), `pix` (key, keyType, receiverName, city, whatsappNumber) — conforme schema em `specs/001-wedding-site-gifts/contracts/config-schema.md`
- [x] T004 [P] Criar `images/casal.jpg` com foto placeholder e `images/gifts/` com 5 imagens placeholder nomeadas `gift-001.jpg` a `gift-005.jpg` para desenvolvimento local

**Checkpoint**: Estrutura existe; `config.json` válido com todos os campos obrigatórios; `lib/qrcode.min.js` presente.

---

## Phase 2: Foundational (Infraestrutura Bloqueante)

**Purpose**: Core compartilhado — DEVE estar completo antes de qualquer user story.

**⚠️ CRÍTICO**: Nenhuma user story pode iniciar antes desta fase.

- [x] T005 Criar `index.html` com: `<!DOCTYPE html>`, `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, `<meta name="theme-color" content="#FAF9F6">`, `<link rel="preconnect" href="https://fonts.googleapis.com">`, import das fontes Google Fonts (`Cormorant+Garamond:400,600` e `Montserrat:400,500`), `<link rel="stylesheet">` para `css/main.css`, `css/home.css`, `css/gifts.css`, dois `<section>` com id `home` e `lista` vazios, `<script src="lib/qrcode.min.js">` antes do fechamento do `<body>`, `<script src="js/storage.js">`, `<script src="js/pix.js">`, `<script src="js/home.js">`, `<script src="js/gifts.js">`, `<script src="js/app.js">`
- [x] T006 [P] Criar `css/main.css` com: CSS custom properties completas (paleta: `--color-bg-light: #FAF9F6`, `--color-bg-warm: #F4F1EA`, `--color-brand: #B8A18E`, `--color-text-dark: #2A2A2A`, `--color-text-muted: #6A6660`, `--color-card-bg: #FFFFFF`, `--color-border: #E8E2D9`, `--color-success: #2D6A4F`), declaração de fontes (`Cormorant Garamond` para títulos, `Montserrat` para corpo), reset CSS universal (`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }`), classes utilitárias (`.hidden { display: none !important }`, `.btn`, `.btn-primary`, `.btn-secondary`)
- [x] T007 [P] Criar `js/storage.js` com três funções exportadas: `markGifted(giftId)` — salva `{[giftId]: true}` em `localStorage` sob a chave `cadife_wedding_gifted`; `isGifted(giftId)` — retorna `boolean`; `getAllGifted()` — retorna objeto com todos os ids marcados; usar `JSON.parse`/`JSON.stringify` para serialização
- [x] T008 Criar `js/app.js` com: função `async init()` que faz `fetch('/config.json')` e armazena resultado; função `router()` que lê `window.location.hash` e chama `showHome()` ou `showGifts()` para alternar visibilidade dos `<section>`; event listener `window.addEventListener('hashchange', router)`; chamar `init()` seguido de `router()` no `DOMContentLoaded`; expor `window.appConfig` para acesso pelos outros módulos
- [x] T009 [P] Criar `js/pix.js` com: (a) função `crc16(str)` implementando CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF, retorna string hex 4 chars em maiúsculas); (b) função `buildTLV(id, value)` que formata `id + tamanho_com_2_digitos + value`; (c) função `generatePixPayload(pixConfig, amount)` que monta payload EMV completo com campos 00, 26 (GUI + chave), 52, 53, 54, 58, 59, 60, 62 (txid=`***`), 63 (CRC); (d) função `renderQRCode(payload, containerId)` que usa `qrcode` (qrcode-generator) para renderizar SVG no elemento com o id informado

**Checkpoint**: `app.js` faz fetch do `config.json` sem erros no console; hash routing alterna visibilidade entre seções; `pix.js` gera payload válido (testar manualmente com chave e valor fixos no console).

---

## Phase 3: User Story 1 — Homepage com História do Casal (Priority: P1) 🎯 MVP

**Goal**: Convidado acessa o site e vê nome do casal, data, local, horário e história — above the fold em mobile (375px).

**Independent Test**: Abrir via Live Server → homepage renderiza dados do `config.json`; foto do casal visível; botão "Lista de Presentes" acessível sem scroll em iPhone SE (375px).

- [x] T010 [US1] Criar `css/home.css` com estilos da homepage: seção `.hero` (foto do casal `background-image` full-width com `min-height: 100svh`, overlay escurecido via `::after`, texto do casal centralizado em fonte Cormorant Garamond branca), seção `.event-details` (fundo `--color-bg-warm`, grid de 3 colunas para data/horário/local com ícones Unicode, padding generoso), seção `.couple-story` (fundo `--color-bg-light`, parágrafo em Montserrat, margem editorial), botão `.btn-gifts` centralizado abaixo da história
- [x] T011 [US1] Criar `js/home.js` com função `renderHome(config)` que: seleciona o `<section id="home">`, injeta innerHTML com estrutura hero (usando `config.wedding.couplePhotoUrl` como `background-image`), popula `config.wedding.coupleName`, formata `config.wedding.weddingDate` para pt-BR com `new Date(config.wedding.weddingDate + 'T00:00:00').toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})`, insere `config.wedding.weddingTime`, `config.wedding.venue.name`, `config.wedding.venue.address`, `config.wedding.message`; adiciona link `<a href="#lista">Lista de Presentes</a>`
- [x] T012 [US1] Atualizar `js/app.js` para: na função `showHome()`, chamar `renderHome(window.appConfig)` antes de tornar a seção visível; garantir que `renderHome` só é chamada na primeira visita (flag `homeRendered`)

**Checkpoint**: US1 completa e testável de forma independente — homepage renderiza dados reais em 375px sem scroll horizontal nem elementos sobrepostos.

---

## Phase 4: User Story 2 — Lista de Presentes (Priority: P2)

**Goal**: Convidado navega para lista e vê cards de presentes com imagem, nome e valor; presentes indisponíveis mostram badge "Presenteado!".

**Independent Test**: Clicar no botão/link "Lista de Presentes" → URL muda para `#lista` → grid de cards renderiza com dados do `config.json`; card com `available: false` exibe badge e está desabilitado (cursor not-allowed, sem evento de clique).

- [x] T013 [P] [US2] Criar `css/gifts.css` com: grid responsivo `.gifts-grid` (`display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem`), `.gift-card` (fundo branco, border-radius, box-shadow sutil, `overflow: hidden`, `cursor: pointer`, transição hover `transform: translateY(-4px)` e `box-shadow` intensificado), `.gift-card img` (aspect-ratio 4/3, `object-fit: cover`, transição de zoom `transform: scale(1.04)` no hover do card), `.gift-card__body` (padding, nome em Cormorant Garamond, valor formatado em Montserrat bold), `.gift-card--gifted` (opacidade 0.6, cursor not-allowed, badge "Presenteado! ✓" em overlay verde `--color-success`)
- [x] T014 [US2] Criar `js/gifts.js` com função `renderGifts(config)` que: limpa `<section id="lista">`, insere header com link "← Home" para `#home` e título "Lista de Presentes", cria `<div class="gifts-grid">`, itera `config.gifts[]`, para cada gift cria elemento card com: `<img src="${gift.imageUrl}" alt="${gift.name}" loading="lazy" onerror="this.src='data:image/svg+xml,...'"` (placeholder SVG inline de caixa de presente), nome, valor formatado via `Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(gift.value)`, verifica `!gift.available || storage.isGifted(gift.id)` para aplicar classe `.gift-card--gifted`; cards disponíveis recebem `data-gift-id="${gift.id}"` e event listener de clique
- [x] T015 [US2] Atualizar `js/app.js`: na função `showGifts()`, chamar `renderGifts(window.appConfig)` e tornar `#lista` visível; ocultar `#home`

**Checkpoint**: US1 e US2 funcionam independentemente — navegação home ↔ lista via hash sem reload; cards renderizam corretamente; badge "Presenteado!" aparece para gifts com `available: false`.

---

## Phase 5: User Story 3 — Modal de Confirmação (Priority: P2)

**Goal**: Clicar em card disponível abre modal com imagem do presente, nome, valor e botões "Confirmar" e "Cancelar".

**Independent Test**: Clicar card disponível → modal abre com texto "Você está presenteando o casal com [Nome] no valor de R$ [Valor]. Confirmar?"; clicar "Cancelar" → modal fecha, lista intacta; clicar fora do modal → fecha também.

- [x] T016 [US3] Adicionar ao `index.html` o modal: `<div id="modal-overlay" class="modal-overlay hidden"><div class="modal-content"><img id="modal-gift-img"><h2 id="modal-gift-name"></h2><p id="modal-confirm-text"></p><div class="modal-actions"><button id="btn-modal-confirm" class="btn btn-primary">Confirmar</button><button id="btn-modal-cancel" class="btn btn-secondary">Cancelar</button></div></div></div>`
- [x] T017 [US3] Adicionar estilos do modal em `css/gifts.css`: `.modal-overlay` (`position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000`), `.modal-content` (fundo branco, border-radius 12px, padding 2rem, max-width 440px, width 90%, animação de entrada `@keyframes modalIn { from { transform: scale(0.9); opacity: 0 } to { transform: scale(1); opacity: 1 } }`), `.modal-content img` (width 100%, aspect-ratio 4/3, object-fit cover, border-radius 8px, margin-bottom 1rem), `.modal-actions` (display flex, gap 1rem, margin-top 1.5rem)
- [x] T018 [US3] Implementar lógica do modal em `js/gifts.js`: função `openConfirmModal(gift)` que popula `#modal-gift-img`, `#modal-gift-name`, `#modal-confirm-text` e remove classe `.hidden` do overlay; event listener no overlay (não no `.modal-content`) para fechar ao clicar fora; `#btn-modal-cancel` chama `closeModal()`; `#btn-modal-confirm` chama `closeModal()` e `openPaymentScreen(gift)`; armazenar gift atual em variável de módulo `let currentGift`

**Checkpoint**: Fluxo home → lista → modal → cancelar/confirmar funciona completo em mobile 375px.

---

## Phase 6: User Story 4 — Pagamento via Pix (Priority: P3)

**Goal**: Após confirmar, convidado vê imagem do presente + QR Code Pix gerado dinamicamente com valor correto + chave Pix copiável.

**Independent Test**: Confirmar um presente → tela de pagamento exibe imagem do presente, QR Code SVG, chave Pix em texto; botão "Copiar chave" copia corretamente e exibe "Copiado! ✓" por 2s; QR Code escaneado com app bancário mostra recebedor e valor corretos.

- [x] T019 [US4] Adicionar ao `index.html` a tela de pagamento: `<div id="payment-screen" class="hidden"><button id="btn-payment-back" class="btn btn-secondary">← Voltar à lista</button><img id="payment-gift-img"><h2 id="payment-gift-name"></h2><p id="payment-gift-value"></p><div id="qrcode-container"></div><p>Ou use a chave Pix:</p><code id="pix-key-display"></code><button id="btn-copy-pix" class="btn btn-primary">Copiar chave Pix</button><div id="payment-actions"><a id="btn-whatsapp" class="btn btn-primary" target="_blank" rel="noopener">Enviar mensagem ao casal 💬</a><button id="btn-back-list" class="btn btn-secondary">Voltar à lista de presentes</button></div></div>`
- [x] T020 [US4] Adicionar estilos da tela de pagamento em `css/gifts.css`: `#payment-screen` (max-width 480px, margin auto, padding 2rem, text-align center), `#payment-gift-img` (width 100%, max-width 280px, aspect-ratio 1, object-fit cover, border-radius 50%, margin 1rem auto, display block), `#qrcode-container` (display inline-block, padding 1rem, border 1px solid var(--color-border), border-radius 8px, margin 1.5rem 0), `#pix-key-display` (display block, background var(--color-bg-warm), padding 0.75rem 1rem, border-radius 6px, font-size 0.875rem, word-break break-all, margin 0.5rem 0 1rem), `#btn-copy-pix` (width 100%, margin-bottom 2rem)
- [x] T021 [US4] Implementar `openPaymentScreen(gift)` em `js/gifts.js`: (a) ocultar `#lista` e qualquer modal, exibir `#payment-screen`; (b) popular `#payment-gift-img`, `#payment-gift-name`, `#payment-gift-value` com dados do gift; (c) chamar `pix.generatePixPayload(window.appConfig.pix, gift.value)` e armazenar payload; (d) limpar `#qrcode-container` e chamar `pix.renderQRCode(payload, 'qrcode-container')`; (e) exibir `window.appConfig.pix.key` em `#pix-key-display`; (f) chamar `storage.markGifted(gift.id)`
- [x] T022 [US4] Implementar botão "Copiar chave Pix" em `js/gifts.js`: `navigator.clipboard.writeText(key).catch(() => fallbackCopy(key))` onde `fallbackCopy` usa `document.execCommand('copy')` via elemento `<textarea>` temporário; ao copiar com sucesso, alterar `textContent` do botão para "Copiado! ✓", adicionar classe de estilo de sucesso, e reverter após 2000ms via `setTimeout`
- [x] T023 [US4] Implementar `#btn-payment-back` em `js/gifts.js`: ocultar `#payment-screen`, chamar `renderGifts(window.appConfig)`, exibir `#lista`

**Checkpoint (crítico)**: QR Code gerado é válido — escanear com app bancário (Nubank, Inter, etc.) mostra nome do recebedor e valor corretos; "Copiar chave" funciona em iOS Safari e Android Chrome.

---

## Phase 7: User Story 5 — Mensagem e Agradecimento (Priority: P4)

**Goal**: Após ver QR Code, convidado envia mensagem via WhatsApp ou volta à lista com o presente marcado como "Presenteado!".

**Independent Test**: Na tela de pagamento → clicar "Enviar mensagem ao casal" → WhatsApp abre com mensagem pré-formatada com nome do presente; clicar "Voltar à lista" → lista reaparece com o presente marcado como presenteado.

- [x] T024 [US5] Implementar função `buildWhatsAppLink(gift, pixConfig)` em `js/gifts.js`: retorna `https://wa.me/${pixConfig.whatsappNumber.replace(/\D/g,'')}?text=${encodeURIComponent('Olá! Acabei de presentear vocês com "' + gift.name + '" 🎁 Que o presente chegue cheio de amor! 💕')}`; se `pixConfig.whatsappNumber` for nulo, ocultar o botão WhatsApp
- [x] T025 [US5] Conectar `buildWhatsAppLink` ao botão `#btn-whatsapp` dentro de `openPaymentScreen(gift)`: atribuir o link gerado ao `href` do elemento `<a id="btn-whatsapp">`
- [x] T026 [US5] Implementar `#btn-back-list` em `js/gifts.js`: ocultar `#payment-screen`, chamar `renderGifts(window.appConfig)` (re-renderiza lista com estado atualizado do localStorage), exibir `#lista`

**Checkpoint**: Fluxo completo ponta a ponta validado — após presentear, botão WhatsApp abre mensagem correta; voltar à lista mostra badge "Presenteado!" no card correto.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Qualidade, acessibilidade, performance e robustez em todos os fluxos.

- [x] T027 [P] Adicionar fallback de erro no `fetch` do `config.json` em `js/app.js`: capturar exceção e exibir `<p class="error-msg">Não foi possível carregar o site. Verifique sua conexão e recarregue a página.</p>` no `<body>`
- [x] T028 [P] Adicionar SVG placeholder inline como `onerror` em todas as imagens de presentes em `js/gifts.js`: SVG simples de caixa de presente (80x80px, cor `--color-border`) para quando a imagem não carregar
- [ ] T029 [P] Validar contraste WCAG AA: abrir WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/) para cada par de cor texto/fundo nas custom properties do `css/main.css`; ajustar valores de `--color-text-muted` ou `--color-brand` se necessário para atingir razão ≥ 4.5:1
- [ ] T030 Validar performance no Chrome DevTools: configurar throttling "Fast 4G", recarregar homepage, medir LCP e tempo até DOMContentLoaded; garantir < 3 segundos; se necessário comprimir imagens com https://squoosh.app
- [ ] T031 [P] Adicionar `<link rel="apple-touch-icon" href="/images/icon-180.png">` e `<meta name="description" content="Site do casamento de [CASAL] — [DATA]">` ao `<head>` do `index.html`; criar `images/icon-180.png` de 180x180px com iniciais do casal
- [ ] T032 Executar checklist completo de `specs/001-wedding-site-gifts/quickstart.md`: marcar cada item do "Checklist de Go-Live" manualmente; testar em dispositivo iOS real e Android real
- [ ] T033 Validar QR Code Pix com app bancário real (Nubank, Inter, C6, Itaú ou similar): escanear QR Code gerado e confirmar que nome do recebedor e valor aparecem corretamente antes de qualquer deploy

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sem dependências — pode iniciar imediatamente
- **Phase 2 (Foundational)**: Depende de Phase 1 — **BLOQUEIA todas as user stories**
- **Phase 3 (US1)**: Depende de Phase 2
- **Phase 4 (US2)**: Depende de Phase 2 — pode rodar em paralelo com Phase 3 (arquivos diferentes)
- **Phase 5 (US3)**: Depende de Phase 4 — modal usa cards renderizados por `gifts.js`
- **Phase 6 (US4)**: Depende de Phase 5 — tela de pagamento abre após confirmação do modal
- **Phase 7 (US5)**: Depende de Phase 6 — botões ficam dentro da tela de pagamento
- **Phase 8 (Polish)**: Depende de Phases 3–7 concluídas

### User Story Dependencies

| User Story | Depende de | Pode rodar em paralelo com |
|------------|-----------|---------------------------|
| US1 Homepage (P1) | Phase 2 | US2 (arquivos distintos) |
| US2 Lista (P2) | Phase 2 | US1 (arquivos distintos) |
| US3 Modal (P2) | US2 | — |
| US4 Pagamento (P3) | US3 | — |
| US5 Mensagem (P4) | US4 | — |

### Parallel Opportunities

```bash
# Phase 1 — tudo em paralelo:
T001 Estrutura dirs  |  T002 Download qrcode  |  T003 config.json  |  T004 Imagens placeholder

# Phase 2 — em paralelo:
T006 css/main.css  |  T007 js/storage.js  |  T009 js/pix.js

# Phases 3+4 — em paralelo (dois desenvolvedores):
Dev A: T010, T011, T012 (US1 - home.css, home.js)
Dev B: T013, T014, T015 (US2 - gifts.css, gifts.js)

# Phase 8 — em paralelo:
T027 Fetch fallback  |  T028 Img fallback  |  T029 WCAG  |  T031 Meta tags
```

---

## Implementation Strategy

### MVP First (US1 apenas)

1. Phase 1 + Phase 2 (Setup + Foundational)
2. Phase 3 (US1 — Homepage)
3. **PARAR E VALIDAR**: homepage renderiza dados reais em mobile?
4. Deploy de preview no Vercel e compartilhar link com o casal para aprovação visual

### Incremental Delivery

1. Setup + Foundational → infraestrutura pronta
2. US1 Homepage → **preview** (casal aprova o visual antes de continuar)
3. US2 Lista de Presentes → **validar cards e navegação**
4. US3 Modal de Confirmação → **validar fluxo de seleção**
5. US4 Pagamento Pix → **⚠️ validar QR Code com app bancário real** ← ponto crítico
6. US5 Mensagem → **validar link WhatsApp**
7. Polish → **checklist go-live completo → deploy final**

---

## Notes

- `[P]` = tarefa paralelizável com outras marcadas `[P]` na mesma fase (arquivos distintos, sem bloqueio)
- `[USn]` = user story à qual a tarefa pertence (rastreabilidade com `spec.md`)
- **Ponto crítico T033**: testar QR Code com app bancário real ANTES do go-live — payload EMV mal formatado gera QR Code inválido
- **Ponto crítico T022**: `navigator.clipboard` requer HTTPS ou `localhost` — testar o botão "Copiar" com Live Server, não abrindo `index.html` diretamente
- `config.json` é a única interface de atualização de conteúdo — nunca modificar HTML/CSS/JS para mudar dados do evento ou presentes
