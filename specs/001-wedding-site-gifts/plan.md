# Implementation Plan: Site de Casamento com Lista de Presentes

**Branch**: `001-wedding-site-gifts` | **Date**: 2026-05-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-wedding-site-gifts/spec.md`

## Summary

Site estático de casamento com duas seções (homepage com história do casal + lista de presentes) e fluxo de pagamento via Pix gerado dinamicamente no navegador. Todo o conteúdo é controlado por um `config.json` — nenhum backend necessário. Deploy automático no Vercel via `git push`.

## Technical Context

**Language/Version**: HTML5 + CSS3 + Vanilla JavaScript (ES2020+)

**Primary Dependencies**:
- `qrcode-generator` v1.x (20KB, bundled localmente em `lib/`) — geração de QR Code Pix client-side
- Google Fonts: `Cormorant Garamond` + `Montserrat` (via CDN, fallback para `Georgia` + `system-ui`)
- `AOS` (Animate On Scroll) v2.x (15KB, CDN opcional) — animações de scroll
- `Lucide Icons` (SVG inline, ~10KB) — ícones de ações e detalhes

**Storage**: `localStorage` (browser) para estado de presentes por dispositivo; `config.json` como fonte de verdade do conteúdo

**Testing**: Manual — checklists no `quickstart.md`; nenhum framework de teste automatizado (escopo estático simples)

**Target Platform**: Navegadores modernos (Chrome 90+, Safari 14+, Firefox 88+, Edge 90+); mobile-first (iOS Safari, Android Chrome)

**Project Type**: Static website (Jamstack)

**Performance Goals**: Página principal carrega < 3s em 4G; bundle total < 100KB sem imagens

**Constraints**: Zero backend; zero dados de pagamento processados; conteúdo atualizável apenas via edição de `config.json` + deploy

**Scale/Scope**: 2 seções de UI (home + lista), até 50 presentes, 1 arquivo de configuração

## Constitution Check

*GATE: Verificado antes da Phase 0. Re-verificado após Phase 1.*

| Princípio | Status | Evidência |
|-----------|--------|-----------|
| I. Conteúdo em Primeiro Lugar | ✅ PASS | US1 é P1; homepage exibe evento above the fold; `config.json` atualizável sem tocar em código |
| II. Simplicidade e Elegância Visual | ✅ PASS | HTML puro + CSS custom props; sem frameworks desnecessários; paleta editorial quente definida |
| III. Experiência de Presentes Sem Atrito | ✅ PASS | SC-001: fluxo em ≤ 3 cliques; QR Code gerado imediatamente na tela de pagamento |
| IV. Transparência no Pagamento | ✅ PASS | Modal de confirmação obrigatório (FR-004); FR-010 proíbe armazenamento de dados de pagamento |
| V. Responsividade e Acessibilidade | ✅ PASS | Mobile-first; SC-003 WCAG AA; SC-004 viewport 375px; SC-002 < 3s em 4G |

**Resultado: GATE PASSED — nenhuma violação identificada.**

## Project Structure

### Documentation (this feature)

```text
specs/001-wedding-site-gifts/
├── plan.md              # Este arquivo
├── research.md          # Decisões tecnológicas e racionais
├── data-model.md        # Entidades, payload Pix EMV, fluxo de estado
├── quickstart.md        # Setup local e deploy
├── contracts/
│   └── config-schema.md # Schema completo do config.json
└── tasks.md             # Gerado por /speckit-tasks
```

### Source Code (repository root)

```text
pagcasamento/
├── index.html              # Única página HTML (seções home + lista via hash routing)
├── config.json             # Fonte de verdade — edite aqui para atualizar o site
├── css/
│   ├── main.css            # Variáveis CSS, reset, tipografia, layout global
│   ├── home.css            # Estilos da seção homepage
│   └── gifts.css           # Estilos da lista, cards, modal e tela de pagamento
├── js/
│   ├── app.js              # Bootstrap, fetch do config.json, hash routing
│   ├── home.js             # Renderização da seção home
│   ├── gifts.js            # Renderização dos cards, modal de confirmação, tela de pagamento
│   ├── pix.js              # Gerador de payload Pix EMV + CRC16-CCITT
│   └── storage.js          # Wrapper do localStorage (namespace cadife_wedding_gifted)
├── lib/
│   └── qrcode.min.js       # qrcode-generator (bundled localmente — sem dependência de CDN)
└── images/
    ├── casal.jpg            # Foto principal do casal
    └── gifts/               # Imagens dos presentes (gift-001.jpg, gift-002.jpg, ...)
```

**Structure Decision**: Single-file HTML com hash routing (`#lista`) — sem build step, sem servidor, roteamento client-side via `window.location.hash`. Mantém o stack mínimo e 100% compatível com hospedagem estática.

## Complexity Tracking

> Nenhuma violação de constituição identificada — seção não aplicável.
