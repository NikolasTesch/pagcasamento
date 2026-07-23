---
description: "Task list for Melhorias Visuais, Mapa, Countdown e Complementos"
---

# Tasks: Melhorias Visuais, Mapa, Countdown e Complementos

**Input**: Design documents from `specs/002-wedding-site-visual-improvements/`

**Stack**: Next.js 16 (App Router) | TypeScript | Tailwind CSS v4 | Lucide React | date-fns

---

## Phase 1: Setup — Componentes Base e Utilitários

**Propósito**: Extrair componentes reutilizáveis e preparar utils.

- [ ] T001 [P] Extrair `Navbar` para `src/components/Navbar.tsx` — componente com `items: { label, href }[]`, responsivo, com integração futura do menu mobile
- [ ] T002 [P] Extrair `Footer` para `src/components/Footer.tsx` — iniciais, data, frase
- [ ] T003 [P] Criar `src/lib/utils.ts` — `cn(...classes)` para merge de classes, `formatDateBR`
- [ ] T004 Instalar `date-fns` via `npm install date-fns`
- [ ] T005 Integrar Navbar e Footer em `page.tsx` e `presentes/page.tsx` + `GiftsPageClient.tsx`

**Checkpoint**: Navbar e Footer componentes funcionando nas 2 páginas sem diferença visual.

---

## Phase 2: Melhorias Visuais — Animações e Navegação

**Propósito**: Animações de scroll, menu hamburguer, scroll suave, seção ativa.

- [ ] T006 [P] Criar `src/components/ScrollReveal.tsx` — wrapper com IntersectionObserver para fade-in-up; respeita `prefers-reduced-motion`; props: `delay`, `className`, `as`
- [ ] T007 Atualizar `src/app/globals.css` — keyframes `fadeInUp`, `slideDown`, `fadeIn`, estilos do overlay mobile, classes utilitárias
- [ ] T008 Implementar menu hamburguer mobile no `Navbar.tsx`:
  - Botão hamburguer visível apenas em `< md` com animação de ícone (X ↔ hamburguer)
  - Overlay fullscreen com fundo semi-transparente e links com slide-in
  - Fechar ao clicar em link ou overlay; travar scroll do body
- [ ] T009 Adicionar scroll suave + seção ativa no `Navbar.tsx`:
  - `scroll-behavior: smooth` no `<html>`
  - IntersectionObserver nas seções para destacar link ativo (classe `text-brand`)
- [ ] T010 [P] Adicionar `prefers-reduced-motion` no `globals.css`
- [ ] T011 Aplicar `ScrollReveal` nas seções da `page.tsx`: hero, detalhes, história, galeria, CTA

**Checkpoint**: Animações, menu mobile, scroll suave e seção ativa funcionando.

---

## Phase 3: Countdown Timer

- [ ] T012 Criar `src/components/CountdownTimer.tsx`:
  - Componente cliente com `useEffect` + `setInterval` 1s
  - Calcula diferença para `2026-10-11T15:30:00-03:00` com `date-fns`
  - 4 blocos fixos: DIAS, HORAS, MINUTOS, SEGUNDOS
  - **Dimensões fixas** para CLS zero
  - Estado "completo": "🎉 Chegou o Grande Dia!"
- [ ] T013 [P] Estilos do countdown no `globals.css`
- [ ] T014 Integrar na homepage após o hero

**Checkpoint**: Countdown visível e atualizando sem layout shift.

---

## Phase 4: Mapa Interativo

- [ ] T015 Criar `src/components/MapSection.tsx`:
  - Embed `<iframe>` do Google Maps com localização do Sítio São Bento
  - Placeholder/skeleton enquanto carrega
  - 2 botões: "Abrir no Google Maps" e "Abrir no Waze"
  - Waze: `https://www.waze.com/ul?ll=...&navigate=yes`
- [ ] T016 [P] Estilos do mapa no `globals.css`
- [ ] T017 Integrar na homepage após detalhes do evento

**Checkpoint**: Mapa visível com botões funcionais.

---

## Phase 5: WhatsApp — Tirar Dúvidas

- [ ] T018 Criar `src/components/WhatsAppButton.tsx`:
  - Botão flutuante posicionado no canto inferior direito
  - Ícone do WhatsApp (Lucide ou SVG) com fundo verde `#25D366`
  - Link: `https://wa.me/5573999760129?text=Olá! Tenho uma dúvida sobre o casamento…`
  - Sombra sutil e hover scale
  - Visível em todas as páginas (incluir no layout ou via componente injetado)
- [ ] T019 Integrar no `layout.tsx` para aparecer em todas as páginas

**Checkpoint**: Botão WhatsApp visível e funcional em mobile e desktop.

---

## Phase 6: Loading Screen / Splash Animado

- [ ] T020 Criar `src/components/LoadingScreen.tsx`:
  - Componente cliente com estado de `isVisible`
  - Exibe: iniciais "K & L" em Playfair Display grande, frase "Uma história de amor…", divider decorativo, fundo `bg-bg-light` ou gradiente suave
  - Fade-out com `opacity` + `transition` após 2.5s ou quando `window.load` event disparar
  - Pular se `sessionStorage.getItem('splashSeen')` existir
  - Pular se `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
  - Após fade-out, setar `sessionStorage.setItem('splashSeen', 'true')`
- [ ] T021 [P] Estilos da splash no `globals.css`
- [ ] T022 Integrar no `layout.tsx` como wrapper do `{children}`

**Checkpoint**: Splash aparece na primeira visita, some com transição, não aparece em visitas seguintes.

---

## Phase 7: Página de Agradecimentos

- [ ] T023 Criar `src/app/agradecimentos/page.tsx`:
  - Página server component
  - **Antes do casamento (10/11/2026)**: redirecionar (via `redirect()`) para homepage ou exibir "Em breve…"
  - **Após o casamento**: exibir fotos (reutilizar grid da galeria), mensagem dos noivos, botão de volta ao início
  - Lightbox reutilizando a mesma lógica da homepage (pode extrair componente `GalleryLightbox`)
- [ ] T024 [P] Extrair `GalleryLightbox` da `page.tsx` para `src/components/GalleryLightbox.tsx` e reutilizar na homepage e na página de agradecimento
- [ ] T025 [P] Estilos da página de agradecimento no `globals.css`

**Checkpoint**: `/agradecimentos` redireciona antes da data; exibe galeria após o casamento.

---

## Phase 8: Favicon, Meta Tags e Structured Data

**Propósito**: SEO, compartilhamento social e identidade visual do site.

- [ ] T026 [P] Gerar assets de favicon:
  - Criar `public/favicon.ico` (32x32)
  - Criar `public/favicon-16x16.png` (16x16)
  - Criar `public/favicon-32x32.png` (32x32)
  - Criar `public/apple-touch-icon.png` (180x180)
  - _(Usar ferramenta online ou gerar SVG e converter)_
- [ ] T027 [P] Criar `public/images/og-image.png` (1200x630px) — imagem de compartilhamento com K&L, data e foto do casal
- [ ] T028 Atualizar `src/app/layout.tsx`:
  - Adicionar `favicon.ico`, `icon`, `apple-touch-icon` no `metadata.icons`
  - Adicionar `metadata.openGraph.images` com URL da `og-image.png`
  - Adicionar `metadata.twitter.card` e `metadata.twitter.images`
- [ ] T029 Adicionar Structured Data JSON-LD (Schema.org Event) no `layout.tsx`:
  ```typescript
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Casamento Katharyna & Leonardo",
    startDate: "2026-10-11T15:30",
    endDate: "2026-10-12T00:00",
    location: {
      "@type": "Place",
      name: "Sítio São Bento",
      address: "Teixeira de Freitas - BA",
    },
    description: "Casamento de Katharyna e Leonardo",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  };
  ```
  - Injetar via `<script type="application/ld+json" dangerouslySetInnerHTML={...} />` no `<head>`

**Checkpoint**: Favicon na aba; og:image no card do WhatsApp; Schema.org válido (testar no Google Rich Results Test).

---

## Phase 9: Botão Voltar ao Topo

- [ ] T030 Criar `src/components/BackToTop.tsx`:
  - Componente cliente
  - `useEffect` + scroll listener: visível quando `scrollY > 400`
  - Botão circular no canto inferior esquerdo (acima do WhatsApp)
  - Ícone de seta para cima (Lucide `ArrowUp`)
  - `onClick` → `window.scrollTo({ top: 0, behavior: 'smooth' })`
  - Animação de fade-in/fade-out
  - Não aparecer se `prefers-reduced-motion`
- [ ] T031 [P] Estilos do back-to-top no `globals.css`
- [ ] T032 Integrar no `layout.tsx`

**Checkpoint**: Botão aparece ao scrollar, leva ao topo suavemente.

---

## Phase 10: Polimento e QA

- [ ] T033 Verificar responsividade: 375px, 768px, 1440px — todas as seções, menu, splash, mapa
- [ ] T034 Testar `prefers-reduced-motion` — animações, splash e back-to-top desabilitados
- [ ] T035 Testar fluxo completo: splash (1ª visita) → homepage → scroll com animações → countdown → mapa → WhatsApp → back-to-top
- [ ] T036 Validar Structured Data no Google Rich Results Test (https://search.google.com/test/rich-results)
- [ ] T037 Validar og:image no Facebook Sharing Debugger ou WhatsApp preview
- [ ] T038 Rodar `lsp_diagnostics` em todos os arquivos — zero errors
- [ ] T039 Gerar favicon/og-image finais (se usando placeholders, substituir por versão final)

**Checkpoint**: Tudo funcionando, responsivo, acessível e validado.

---

## Dependencies & Execution Order

```
Phase 1: Setup ──────→ Phase 2: Visual ──→ Phase 3: Countdown ──→ Phase 4: Mapa
  T001-T005               T006-T011            T012-T014               T015-T017
                              │
                              ↓
Phase 5: WhatsApp ──→ Phase 6: Splash ──→ Phase 7: Agradecimentos
  T018-T019               T020-T022            T023-T025

Phase 8: Favicon/SEO ──→ Phase 9: BackToTop ──→ Phase 10: QA
  T026-T029                  T030-T032             T033-T039
```

### Paralelo possível

| Task | Com |
|------|-----|
| T001, T002, T003 | Paralelo |
| T006, T010 | Paralelo |
| T013 | Paralelo com T012 |
| T016 | Paralelo com T015 |
| T024, T025 | Paralelo |
| T026, T027 | Paralelo |
| T030, T031 | Paralelo |

### Novas dependências

- **Phase 6 (Splash)**: Depende de Phase 1 (Navbar/Footer existirem)
- **Phase 7 (Agradecimentos)**: Depende de ter a GalleryLightbox extraída (T024)
- **Phase 8 (SEO)**: Independente — pode rodar a qualquer momento após Phase 1
- **Phase 9 (BackToTop)**: Independente — pode rodar junto com Phase 5
