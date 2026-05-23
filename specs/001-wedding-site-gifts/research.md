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

## Decisão 7: Design System (Clássico & Romântico Editorial)

**Decision**: CSS custom properties (variáveis CSS) como base de design, seguindo a paleta de cores neutra quente, refinada e editorial do exemplo de referência.

**Paleta de cores**:
```css
:root {
  --color-bg-light: #FAF9F6;      /* off-white suave */
  --color-bg-warm: #F4F1EA;       /* bege quente/creme */
  --color-brand: #B8A18E;         /* sand/taupe clássico */
  --color-brand-hover: #A08A77;   /* sand escurecido */
  --color-text-dark: #2A2A2A;     /* charcoal/quase-preto para contraste suave */
  --color-text-muted: #6A6660;    /* cinza médio quente */
  --color-card-bg: #FFFFFF;       /* branco puro */
  --color-border: #E8E2D9;        /* cinza bege claro */
  --color-success: #2D6A4F;       /* verde escuro elegante */
}
```

**Tipografia**:
- Títulos: `'Cormorant Garamond'` (serifada romana editorial) — via Google Fonts
- Corpo, Menus e Botões: `'Montserrat'` (sans-serif geométrica limpa) — via Google Fonts
- Fallback: `Georgia, serif` e `system-ui, sans-serif`

**Rationale**: A paleta de tons quentes terrosos e pastéis suaves com tipografia romana serifada cria a atmosfera editorial romântica ideal, elevando o visual do site sem precisar de frameworks pesados.

---

## Decisão 8: Gateway de Pagamento (InfinitePay Pix Link Checkout)

**Decision**: Integrar a API de Checkout Link da **InfinitePay** para geração de Pix dinâmico com **Taxa Zero** e suporte a **Webhooks**.

**Rationale**:
- A InfinitePay oferece transações Pix gratuitas (Taxa Zero), o que é ideal para uma lista de presentes de casamento, garantindo que 100% do valor enviado pelo convidado chegue ao casal.
- Ao gerar uma cobrança via `POST https://api.checkout.infinitepay.io/links`, enviamos o campo `webhook_url` e `order_nsu` (identificador único da contribuição) diretamente no payload.
- O gateway cuida da geração e validação do Pix, redireciona o usuário (`redirect_url`) e envia um POST para nossa rota de webhook assim que o pagamento for confirmado.
- Elimina a necessidade de rodar decodificadores complexos de payload Pix client-side (BR Code EMV), tornando o processo extremamente seguro e controlado no servidor.

---

## Decisão 9: Banco de Dados e Infraestrutura de Servidor (Firebase/Neon vs VPS)

**Decision**: Propor **Firebase Firestore (Spark Plan)** ou **Neon Serverless Postgres** em vez de uma VPS auto-hospedada, explicando os prós e contras para a decisão do casal.

**Análise de Infraestrutura:**

1. **O problema do Congelamento no Supabase (Free Tier):**
   - O Supabase pausa bancos de dados gratuitos após 7 dias de inatividade de API. Para reativar, o casal precisa acessar o painel e clicar em "Restore", o que gera falha para convidados que tentam acessar o site nesse meio tempo.
   - *Solução Alternativa 1: Firebase (Firestore - Plano Spark - Gratuito)*
     - **Nunca congela:** O Firebase Firestore gratuito permanece online indefinidamente, independente de inatividade.
     - **Limites generosos:** 50.000 leituras e 20.000 escritas diárias (overkill absoluto para um site de casamento com centenas de acessos).
     - **Sem custos:** 100% gratuito.
   - *Solução Alternativa 2: Neon Postgres (Plano Gratuito - Serverless)*
     - **Auto-Wakeup:** O banco "dorme" após 5 minutos de inatividade, mas **acorda automaticamente** no primeiro request em 1 a 3 segundos (sem intervenção manual ou congelamento definitivo).
     - **Banco Relacional real:** Mantém a estrutura SQL convencional.

2. **Por que uma VPS (Virtual Private Server) pode ser um Overkill?**
   - **Custo:** Mínimo de R$ 25 a R$ 40 mensais (DigitalOcean, AWS Lightsail, Hetzner) indefinidamente.
   - **Complexidade de Setup:** Requer configuração manual de Linux, Docker, instalação de PostgreSQL, configuração de proxy reverso (Nginx/Caddy), emissão de certificados SSL (Let's Encrypt), rotinas de backup de banco e monitoramento de CPU/disco.
   - **Manutenção:** Se o servidor travar ou sofrer um ataque, o desenvolvedor precisa intervir manualmente.
   - *Conclusão:* Para um site de casamento temporário (até a data do evento), usar serviços **Serverless Gratuitos Sem Congelamento (Firebase Firestore ou Neon Postgres)** hospedados na Vercel oferece custo zero e zero manutenção, sendo muito mais eficiente que manter uma VPS ativa.

---

## Decisão 10: Reconstrução do CSS (Tailwind CSS + Design System Customizado)

**Decision**: Reconstruir completamente a camada de estilos utilizando **Tailwind CSS v4** integrado ao Next.js, mantendo a sofisticação editorial.

**Rationale**:
- Tailwind CSS acelera o desenvolvimento de componentes interativos em React.
- Facilidade na criação da barra de progresso animada da vaquinha, estados de "disabled" nos itens comprados, e modais elegantes.
- Garantia de total responsividade (mobile-first) e micro-interações nativas com classes simplificadas.
- O estilo clássico e romântico editorial (Montserrat e Cormorant Garamond) será portado perfeitamente utilizando a customização de fontes e cores do Tailwind.

---

## Dependências Externas (Stack Atualizada)

| Dependência | Uso | Tipo | Alternativa / Fallback |
|------------|-----|------|------------------------|
| `next` / `react` | Core framework e UI declarativa | NPM | - |
| `@google-cloud/firestore` ou `@neondatabase/serverless` | Comunicação segura com o Banco de Dados no backend | NPM | - |
| `lucide-react` | Ícones interativos modernos e leves | NPM | SVGs inline |
| `tailwindcss` | Reconstrução moderna dos estilos e responsividade | NPM | CSS Modules |
| `axios` / `fetch` | Comunicação com a API de checkout da InfinitePay | NPM | - |

