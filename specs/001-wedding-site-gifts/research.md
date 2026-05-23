# Research: Site de Casamento com Lista de Presentes

**Feature**: `001-wedding-site-gifts`
**Date**: 2026-05-23

---

## Decisão 1: Stack Tecnológica

**Decision**: HTML5 + CSS3 + Vanilla JavaScript com arquivo `config.json` para conteúdo.

**Rationale**:
- Zero dependência de build tool ou framework — nenhuma curva de aprendizado, deploys instantâneos.
- Arquivo `config.json` centraliza todo o conteúdo editável (evento, presentes, Pix) — cumpre FR-009.
- Menor bundle possível (<50KB total sem imagens) — garante SC-002 (< 3s em 4G).
- Funciona nativamente em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages, Cloudflare Pages).
- Um desenvolvedor júnior consegue manter sem framework específico.

**Alternatives considered**:
- **Next.js (static export)**: Descartado — overkill para 2 páginas, aumenta bundle e complexidade de build.
- **Astro**: Bom candidato, mas adiciona um passo de build que não é necessário para este escopo.
- **Vue 3 SPA**: Descartado — framework desnecessário para interações simples de uma lista de cards.

---

## Decisão 2: Geração de QR Code Pix (Client-Side)

**Decision**: Gerar o payload Pix (BR Code / EMV QRCode) no lado do cliente usando uma função utilitária leve, e renderizar o QR Code com a biblioteca `qrcode.js` (qrcode-generator).

**Rationale**:
- O Banco Central do Brasil define o padrão EMV para Pix estático. O payload segue um formato bem documentado (especificação BACEN - SPI - Pix Regulatório).
- Uma função de ~2KB gera o string correto no formato CRC16-CCITT com todos os campos obrigatórios.
- `qrcode-generator` é uma biblioteca JS pura de 20KB minificada (sem dependências), madura e amplamente utilizada.
- O QR Code é renderizado como SVG ou canvas no momento da seleção — sem necessidade de pré-gerar e armazenar imagens.
- A chave Pix + valor estão no `config.json` — o payload é gerado dinamicamente para cada presente.

**Alternatives considered**:
- **QR Codes pré-gerados (imagens estáticas)**: Descartado — não reflete o valor correto automaticamente, requer re-geração a cada alteração de preço.
- **API de terceiros para gerar QR Code**: Descartado — viola o princípio de não depender de serviços externos para um fluxo crítico; pode ter downtime.

**Formato do payload Pix estático** (resumo da especificação BACEN):
```
00 → Payload Format Indicator (01)
26 → Merchant Account Information
  00 → GUI: br.gov.bcb.pix
  01 → Chave Pix
52 → Merchant Category Code (0000)
53 → Transaction Currency (986 = BRL)
54 → Transaction Amount (valor do presente)
58 → Country Code (BR)
59 → Merchant Name
60 → Merchant City
62 → Additional Data Field (txid = "***")
63 → CRC16-CCITT checksum
```

---

## Decisão 3: Estrutura de Arquivos

**Decision**: Single Page Application (SPA) em HTML com roteamento por hash (`#`), ou duas páginas HTML separadas.

**Decision refinement**: Duas páginas HTML separadas (`index.html` e `lista.html`) são preferíveis para SEO e semântica, mas como o conteúdo é dinâmico (carregado de `config.json`), usaremos **uma única `index.html`** com seções mostradas/ocultadas via JavaScript e navegação por hash para permitir link direto à lista.

**Rationale**:
- Menos arquivos, menos requests HTTP.
- A constituição permite no máximo 2 páginas — usar seções na mesma página simplifica a gestão de estado da UI.
- Hash routing (`#lista`) funciona sem servidor de aplicação.

---

## Decisão 4: Persistência de Estado de Presentes

**Decision**: `localStorage` para marcar presentes como "presenteados" no dispositivo do convidado.

**Rationale**:
- Sem backend, não há como sincronizar o estado entre convidados.
- `localStorage` persiste entre sessões no mesmo dispositivo/browser — o convidado não re-verá o presente como disponível se voltar.
- O casal mantém controle real via WhatsApp/pessoalmente — a marcação no site é apenas indicativa para o convidado individual.

**Limitations**:
- Outro convidado no mesmo dispositivo pode ver o presente como já presenteado.
- Se o casal quiser marcar presentes como "disponíveis/indisponíveis" globalmente, precisaria de um backend (fora do escopo deste MVP).

**Alternatives considered**:
- **Supabase/Firebase como backend leve**: Descartado para MVP — aumenta complexidade e custo; a lista pequena (< 50 itens) não justifica infraestrutura.

---

## Decisão 5: Mensagem do Convidado

**Decision**: Botão "Deixar uma mensagem" abre link de WhatsApp pré-formatado (`https://wa.me/[NUMERO]?text=[MENSAGEM]`) com o nome do presente e uma mensagem template.

**Rationale**:
- Zero backend necessário — a mensagem vai direto para o WhatsApp do casal.
- 99% dos convidados brasileiros têm WhatsApp instalado no celular.
- O casal recebe a mensagem em tempo real sem nenhuma infraestrutura.
- Alternativa (formulário + e-mail): requer backend ou serviço de e-mail (Resend, Mailgun) — fora do escopo deste MVP estático.

---

## Decisão 6: Hospedagem e Deploy

**Decision**: Vercel (plano gratuito).

**Rationale**:
- Deploy automático via Git push — qualquer atualização de `config.json` é publicada em < 30 segundos.
- HTTPS automático (certificado TLS emitido via Let's Encrypt).
- CDN global — excelente tempo de carregamento no Brasil.
- Plano gratuito ilimitado para sites estáticos.

**Alternatives considered**:
- **GitHub Pages**: Igualmente bom, mas sem CDN tão robusto e sem preview URLs por branch.
- **Netlify**: Equivalente ao Vercel, ambos são válidos.
- **Cloudflare Pages**: Ótima opção também — CDN superior, mas curva maior para configurar domínio personalizado.

---

## Decisão 7: Design System

**Decision**: CSS custom properties (variáveis CSS) como único design system, seguindo a identidade visual definida na constituição.

**Paleta de cores**:
```css
:root {
  --color-primary: #c9a96e;      /* dourado elegante */
  --color-bg: #fafaf8;           /* off-white quente */
  --color-text: #1a1a1a;         /* quase-preto */
  --color-text-light: #6b6b6b;   /* cinza médio */
  --color-card-bg: #ffffff;      /* branco puro para cards */
  --color-border: #e8e2d9;       /* bege claro */
  --color-success: #2d6a4f;      /* verde elegante */
}
```

**Tipografia**:
- Títulos: `'Playfair Display'` (serifada, romântica) — via Google Fonts
- Corpo: `'Inter'` (sans-serif, legível) — via Google Fonts
- Fallback: `Georgia, serif` e `system-ui, sans-serif`

**Rationale**: CSS variables satisfazem consistência (Princípio II da constituição) sem dependência de framework CSS. Google Fonts tem CDN próprio com cache agressivo.

---

## Dependências Externas (todas opcionais no sentido de failure-safe)

| Dependência | Uso | Tamanho | Fallback |
|------------|-----|---------|---------|
| `qrcode-generator` | Renderizar QR Code Pix | ~20KB | Mostrar apenas chave Pix copiável |
| Google Fonts (Playfair Display + Inter) | Tipografia elegante | ~40KB | Georgia + system-ui |

**Nenhuma dependência é bloqueante** — o site funciona mesmo se ambas falharem (fonts caem para fallback, QR Code tem fallback de chave copiável).
