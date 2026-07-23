# Implementation Plan: Melhorias Visuais, Mapa, Countdown e Complementos

**Branch**: `002-wedding-site-visual-improvements` | **Date**: 2026-07-22 | **Spec**: [spec.md](./spec.md)

---

## Summary

Melhorar a experiência visual do site de casamento com animações de scroll, menu hamburguer mobile, countdown timer, mapa interativo, botão WhatsApp, loading screen, página de agradecimento, structured data SEO, favicon, meta tags e botão voltar ao topo. Tudo client-side (exceto structured data gerado no server).

---

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 16.2.6 (App Router), React 19.2.4

**Dependencies**: `lucide-react` (já instalado), `date-fns` (a adicionar)

**Storage**: `sessionStorage` — lembrar se convidado já viu a loading screen

**Testing**: Manual — verificação visual + DevTools + WhatsApp share preview + Google Rich Results Test

**Target**: Navegadores modernos (Chrome 90+, Safari 15+, Firefox 88+, Edge 90+); mobile-first

**Constraints**:
- Structured Data gerado server-side (evitar CLS e SEO penalty)
- Loading screen pulável via `sessionStorage` + `prefers-reduced-motion`
- og:image precisa ser imagem real (criar a partir de foto existente)
- WhatsApp link funcionando em mobile e desktop

---

## Constitution Check

*GATE: PASSED*

| Princípio | Status |
|-----------|--------|
| Conteúdo em Primeiro Lugar | ✅ Loading screen rápida e pulável; não atrapalha acesso ao conteúdo |
| Simplicidade Visual | ✅ Splash minimalista (iniciais + frase); sem firulas |
| Experiência sem Atrito | ✅ WhatsApp direto; voltar ao topo com 1 clique |
| Responsividade e Acessibilidade | ✅ `prefers-reduced-motion`; botões com touch target adequado |

---

## Project Structure

```text
src/
├── app/
│   ├── page.tsx                              # [EDIT] Animações, countdown, mapa, WhatsApp, splash trigger
│   ├── layout.tsx                            # [EDIT] Structured Data JSON-LD, meta tags og:image
│   ├── globals.css                           # [EDIT] Keyframes, splash styles, back-to-top
│   ├── agradecimentos/
│   │   └── page.tsx                          # [NEW] Página pós-casamento
│   └── presentes/
│       ├── page.tsx                          # [EDIT] Usar Navbar/Footer
│       └── GiftsPageClient.tsx               # [EDIT] Usar Navbar/Footer
├── components/
│   ├── Navbar.tsx                            # [EXTRACT] Navbar + menu mobile + seção ativa
│   ├── Footer.tsx                            # [EXTRACT] Footer reutilizável
│   ├── ScrollReveal.tsx                      # [NEW] Animação fade-in-up
│   ├── CountdownTimer.tsx                    # [NEW] Timer regressivo
│   ├── MapSection.tsx                        # [NEW] Mapa + botões
│   ├── WhatsAppButton.tsx                    # [NEW] Botão flutuante WhatsApp
│   ├── LoadingScreen.tsx                     # [NEW] Splash animado
│   └── BackToTop.tsx                         # [NEW] Botão voltar ao topo
├── lib/
│   └── utils.ts                              # [NEW] cn(), formatDateBR()
└── public/
    ├── favicon.ico                           # [NEW] Favicon
    ├── favicon-16x16.png                     # [NEW]
    ├── favicon-32x32.png                     # [NEW]
    ├── apple-touch-icon.png                  # [NEW] 180x180
    └── images/
        └── og-image.png                      # [NEW] 1200x630
```

---

## Complexity Tracking

Nenhuma violação.
