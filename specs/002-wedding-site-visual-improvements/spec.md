# Feature Specification: Melhorias Visuais, Mapa, Countdown e Complementos

**Feature Branch**: `002-wedding-site-visual-improvements`

**Created**: 2026-07-22

**Status**: Draft

**Input**: Melhorias visuais na homepage, countdown timer, mapa interativo, botão WhatsApp, loading screen, página de agradecimento, structured data SEO, favicon, meta tags e botão voltar ao topo.

---

## User Stories

### User Story 1 — Melhorias Visuais na Homepage (Priority: P1)

Como convidado, quero uma experiência visual mais fluida com animações de entrada, navegação mobile funcional e transições suaves entre seções.

**Why this priority**: A primeira impressão do site impacta diretamente o engajamento.

**Independent Test**: Abrir o site no celular → menu hamburguer funciona; scroll → seções aparecem com animação; links âncora → scroll suave.

**Acceptance Scenarios**:

1. **Given** o convidado acessa o site no mobile, **When** a página carrega, **Then** o navbar exibe ícone de hamburguer que ao clicar abre overlay com todos os links
2. **Given** o convidado faz scroll na página, **When** cada seção entra no viewport, **Then** ela aparece com animação suave de fade-in-up
3. **Given** o convidado clica em link âncora, **When** a navegação ocorre, **Then** o scroll é suave e o navbar destaca a seção ativa
4. **Given** o convidado prefere movimento reduzido, **When** o sistema detecta `prefers-reduced-motion`, **Then** as animações são desabilitadas

---

### User Story 2 — Countdown Timer (Priority: P2)

Como convidado, quero ver uma contagem regressiva para o casamento.

**Independent Test**: Homepage → timer visível atualizando em tempo real.

**Acceptance Scenarios**:

1. **Given** o convidado acessa a homepage, **When** a página carrega, **Then** um countdown timer é exibido entre o hero e os detalhes do evento
2. **Given** o timer está visível, **When** os segundos passam, **Then** o timer atualiza sem causar reflow (CLS < 0.1)
3. **Given** a data do casamento já passou, **When** o timer chega a zero, **Then** exibe "Chegou o Grande Dia!"

---

### User Story 3 — Mapa Interativo (Priority: P3)

Como convidado, quero ver um mapa com a localização do evento.

**Independent Test**: Homepage → mapa com marcador e botões Google Maps/Waze.

**Acceptance Scenarios**:

1. **Given** o convidado scrolla até a seção do evento, **When** ele visualiza o mapa, **Then** um mapa estático é exibido com a localização do Sítio São Bento
2. **Given** o mapa está visível, **When** o convidado clica em "Abrir no Google Maps", **Then** abre o Google Maps com a rota
3. **Given** o mapa está visível, **When** o convidado clica em "Abrir no Waze", **Then** abre o Waze com o destino configurado

---

### User Story 4 — WhatsApp Tirar Dúvidas (Priority: P2)

Como convidado, quero um botão de contato rápido via WhatsApp para tirar dúvidas com os noivos.

**Independent Test**: Homepage → botão WhatsApp flutuante ou no footer → clica → abre WhatsApp com mensagem pré-preenchida.

**Acceptance Scenarios**:

1. **Given** o convidado acessa qualquer página, **When** ele clica no botão WhatsApp, **Then** abre o WhatsApp com o número dos noivos e mensagem "Olá! Tenho uma dúvida sobre o casamento…"
2. **Given** o botão está visível no mobile, **When** o convidado scrolla, **Then** o botão permanece acessível (fixo ou no footer)

---

### User Story 5 — Loading Screen / Splash Animado (Priority: P2)

Como convidado, quero uma tela de entrada bonita ao acessar o site, criando uma experiência premium desde o primeiro contato.

**Independent Test**: Acessar o site → splash screen com iniciais K&L aparece por ~2s → transição suave para homepage.

**Acceptance Scenarios**:

1. **Given** o convidado acessa a URL, **When** o site começa a carregar, **Then** uma tela splash é exibida com as iniciais K&L, uma frase romântica e fundo elegante
2. **Given** a splash está visível, **When** o carregamento termina ou após 2.5s, **Then** a splash faz fade-out e a homepage aparece com transição suave
3. **Given** o convidado já visitou o site antes, **When** ele acessa novamente, **Then** a splash é pulada (via `sessionStorage`)

---

### User Story 6 — Página de Agradecimentos Pós-Casamento (Priority: P3)

Como convidado, quero uma página com fotos e mensagem de agradecimento após o casamento.

**Independent Test**: Acessar `/agradecimentos` → vê fotos e mensagem de gratidão.

**Acceptance Scenarios**:

1. **Given** o convidado acessa `/agradecimentos`, **When** a página carrega, **Then** exibe fotos do casamento e uma mensagem de agradecimento dos noivos
2. **Given** a página está visível, **When** o convidado clica em uma foto, **Then** abre lightbox igual à galeria existente
3. **Given** é antes do casamento, **When** o convidado acessa `/agradecimentos`, **Then** redireciona para a homepage ou exibe "Em breve…"

---

### User Story 7 — Favicon, Meta Tags e Structured Data (Priority: P2)

Como convidado, quero que o site tenha uma identidade visual completa ao ser compartilhado (WhatsApp, Google) e nos favoritos do navegador.

**Independent Test**: Compartilhar link no WhatsApp → card com foto do casal; pesquisar no Google → resultado com dados do evento; aba do navegador → ícone K&L.

**Acceptance Scenarios**:

1. **Given** o convidado compartilha o link no WhatsApp, **When** o card é gerado, **Then** exibe a foto do casal (og:image), título e descrição corretos
2. **Given** o Google indexa o site, **When** o resultado é exibido, **Then** mostra dados estruturados do evento (data, local, horário)
3. **Given** o convidado adiciona o site aos favoritos, **When** ele vê a aba, **Then** o favicon personalizado K&L está visível

---

### User Story 8 — Botão Voltar ao Topo (Priority: P2)

Como convidado, quero um botão para voltar ao topo da página rapidamente.

**Independent Test**: Scrollar para baixo → botão aparece → clicar → scroll suave ao topo.

**Acceptance Scenarios**:

1. **Given** o convidado scrolla além de 400px, **When** o botão aparece, **Then** ele está visível com animação suave e link para o topo
2. **Given** o convidado está no topo, **When** o botão não é necessário, **Then** ele permanece oculto

---

### Edge Cases

- **Countdown**: Fuso horário — usar UTC-3 fixo
- **Countdown**: Data já passou — exibir mensagem celebrativa
- **Animações**: `prefers-reduced-motion` respeitado
- **Loading Screen**: Pular se convidado já visitou (sessionStorage), ou se `prefers-reduced-motion`
- **Agradecimentos**: Redirecionar para homepage se data ainda não chegou
- **WhatsApp**: Detectar se WhatsApp Web vs mobile para abrir link correto (`wa.me` ou `https://web.whatsapp.com`)

---

## Requirements

### Functional Requirements

- **FR-001**: Navbar com menu hamburguer mobile e overlay animado
- **FR-002**: Animações fade-in-up via Intersection Observer nas seções
- **FR-003**: Navbar destaca seção ativa durante scroll
- **FR-004**: Scroll âncora suave (`scroll-behavior: smooth`)
- **FR-005**: `prefers-reduced-motion` desabilita animações
- **FR-006**: Countdown timer para 11/10/2026 15:30 BRT sem CLS
- **FR-007**: Mapa estático embed com botões Google Maps + Waze
- **FR-008**: Botão WhatsApp flutuante com link `wa.me` e mensagem pré-preenchida
- **FR-009**: Loading screen com iniciais do casal, transição fade-out, pulável via sessionStorage
- **FR-010**: Página `/agradecimentos` com fotos e lightbox (redireciona se antes do casamento)
- **FR-011**: Structured Data JSON-LD (Schema.org Event) no `<head>`
- **FR-012**: Favicon personalizado em múltiplos tamanhos (32x32, 16x16, 180x180 apple-touch-icon)
- **FR-013**: Meta tag `og:image` com foto real do casal; `og:title` e `og:description` corretos
- **FR-014**: Botão "Voltar ao topo" visível após 400px de scroll, com scroll suave
- **FR-015**: Navbar e Footer como componentes reutilizáveis

---

## Success Criteria

- **SC-001**: Homepage < 3s em 4G com todas as melhorias
- **SC-002**: CLS < 0.1
- **SC-003**: Card do WhatsApp mostra og:image correta
- **SC-004**: Google exibe Event schema nos resultados
- **SC-005**: Loading screen não impacta LCP (imagens pré-carregadas atrás da splash)

---

## Assumptions

- Animações com CSS puro + Intersection Observer (sem lib externa)
- Mapa com embed estático Google Maps (gratuito)
- WhatsApp usa `https://wa.me/5573999760129?text=...`
- Loading screen usa sessionStorage para lembrar visite anteriores
- Structured Data gerado server-side no `layout.tsx` (não client-side)
- og:image será uma foto real do casal em `/images/og-image.png` (criar a partir de imagem existente)
