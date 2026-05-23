# Implementation Plan: Site de Casamento com Lista de Presentes

**Branch**: `001-wedding-site-gifts` | **Date**: 2026-05-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-wedding-site-gifts/spec.md`

## Summary

Site de casamento estático com página principal informativa e lista de presentes com fluxo de pagamento via Pix. Implementado em HTML/CSS/Vanilla JS puro com um arquivo `config.json` como fonte de verdade editável. Nenhum backend necessário — o QR Code Pix é gerado client-side seguindo o padrão EMV do Banco Central, e as mensagens dos convidados são enviadas via link de WhatsApp pré-formatado.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES2020 (sem transpilação, sem build step)

**Primary Dependencies**:
- `qrcode-generator` v1.4.4 (copiado localmente em `lib/`) — renderiza QR Code Pix como SVG/canvas
- Google Fonts (Playfair Display + Inter) — tipografia elegante com fallback local
- (Nenhuma outra dependência)

**Storage**: `localStorage` para persistir presentes presenteados por dispositivo; `config.json` estático como fonte de verdade do conteúdo

**Testing**: Manual (checklist de go-live); nenhum framework de testes automatizados — justificado pelo tamanho e natureza do projeto (site estático de evento único)

**Target Platform**: Web (mobile-first: iOS Safari 15+, Android Chrome 100+, Chrome/Firefox/Safari desktop)

**Project Type**: Static website (site estático de evento)

**Performance Goals**: Primeira renderização de conteúdo (FCP) < 1.5s em WiFi, < 3s em 4G

**Constraints**:
- Sem backend, sem servidor de aplicação, sem banco de dados
- Sem processamento ou armazenamento de dados de pagamento
- Conteúdo atualizável apenas via edição do `config.json` (sem CMS)
- Bundle total < 150KB sem imagens

**Scale/Scope**: ~50 presentes, ~200 convidados, evento único

## Constitution Check

*GATE: Verificação dos 5 princípios antes da implementação.*

### Princípio I — Conteúdo em Primeiro Lugar ✅ PASS

- Home page renderiza `coupleName`, `weddingDate`, `weddingTime` e `venue.name` no viewport inicial (above the fold em mobile 375px).
- Botão/link "Lista de Presentes" é visível na home sem scroll.
- `config.json` centraliza todo o conteúdo — atualizável sem alterar código.

### Princípio II — Simplicidade e Elegância Visual ✅ PASS

- Design system baseado em CSS custom properties — paleta consistente em todo o site.
- Animações limitadas a: fade-in no modal de confirmação (200ms), feedback "Copiado!" (2s).
- Nenhum componente desnecessário — 2 seções (home + lista), 1 modal de confirmação, 1 tela de pagamento.

### Princípio III — Experiência de Presentes Sem Atrito ✅ PASS

- Fluxo: card → modal de confirmação → tela de pagamento = **3 interações** (conforme limite da constituição).
- Card exibe imagem, nome e valor de forma clara.
- QR Code e chave Pix exibidos imediatamente após confirmação.

### Princípio IV — Transparência no Pagamento ✅ PASS

- Modal de confirmação exibe: "Você está presenteando o casal com [PRESENTE] no valor de R$ [VALOR]. Confirmar?"
- Tela de pagamento exibe chave Pix e valor em destaque.
- **NUNCA** processa ou armazena dados de pagamento — transferência ocorre no app bancário do convidado.

### Princípio V — Responsividade e Acessibilidade ✅ PASS

- Layout mobile-first (base em 375px, breakpoint tablet em 768px, desktop em 1024px).
- Imagens com `alt` descritivo obrigatório (fallback visual se não carregarem).
- Contraste de texto: paleta verificada para atender WCAG AA (4.5:1 para texto normal).
- FCP < 3s em 4G — garantido pelo tamanho mínimo do bundle e ausência de requests bloqueantes.

**Resultado**: Todos os gates passam. Nenhuma violação identificada.

## Project Structure

### Documentation (this feature)

```text
specs/001-wedding-site-gifts/
├── plan.md              # Este arquivo (/speckit-plan)
├── spec.md              # Especificação da feature
├── research.md          # Decisões tecnológicas (Phase 0)
├── data-model.md        # Entidades e fluxo de estado (Phase 1)
├── quickstart.md        # Guia de desenvolvimento local e deploy (Phase 1)
├── contracts/           # Esquemas de contrato (Phase 1)
│   └── config-schema.md # Schema do config.json
└── tasks.md             # Tarefas de implementação (gerado por /speckit-tasks)
```

### Source Code (repository root)

```text
pagcasamento/
├── index.html              # Página única com seções home e lista
├── config.json             # Fonte de verdade do conteúdo (editável)
├── css/
│   ├── main.css            # Reset, variáveis CSS, tipografia global
│   ├── home.css            # Estilos da seção home (hero, info do evento)
│   └── gifts.css           # Estilos de cards, modal, tela de pagamento
├── js/
│   ├── app.js              # Bootstrap, fetch do config.json, roteamento por hash
│   ├── home.js             # Renderização dinâmica da seção home
│   ├── gifts.js            # Lista de presentes, seleção, modal, pagamento
│   ├── pix.js              # Geração de payload Pix EMV + CRC16-CCITT
│   └── storage.js          # localStorage: marcar presentes como presenteados
├── lib/
│   └── qrcode.min.js       # qrcode-generator (bundled localmente)
└── images/
    ├── casal.jpg            # Foto do casal (fornecida pelo casal)
    └── gifts/               # Imagens dos presentes
```

**Structure Decision**: Single HTML file com seções (`<section id="home">`, `<section id="lista">`) mostradas/ocultadas via JavaScript. Hash routing para navegação direta. Estrutura planejada; os arquivos fonte ainda não existem e serão criados na fase de implementação (`/speckit-implement`).

## Complexity Tracking

> **Nenhuma violação da constituição identificada.** Esta seção está vazia intencionalmente.
